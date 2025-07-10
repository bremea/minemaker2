import {
	GatewayOpCodes,
	type ApiUser,
	type GatewayDispatchEvent,
	type GatewayDispatchEventTypes,
	type GatewayEvent,
	type GatewayHeartbeatAckEvent,
	type GatewayHelloEvent,
	type GatewayIdentifyEventData,
	type GatewayReadyEvent
} from '@minemaker/types';
import { verifyAuth } from './auth';
import { getApiUser } from '@minemaker/db';
import {
	AckPolicy,
	DeliverPolicy,
	DiscardPolicy,
	RetentionPolicy,
	StorageType,
	type ConsumerInfo,
	type JetStreamClient,
	type JetStreamManager
} from '@nats-io/jetstream';

const HEARTBEAT_INTERVAL = 4500;
const HEARTBEAT_GRACE = 1000; // additional time to account for network latency

export class GatewaySession {
	private ws: Bun.ServerWebSocket<{ id: string }>;
	private heartbeatInterval: number;
	private heartbeatGrace: number;
	private heartbeatTimeout: ReturnType<typeof setTimeout>;
	private authenticated: boolean;
	private js: JetStreamClient;
	private jsm: JetStreamManager;
	private subscriptions: GatewayDispatchEventTypes[];
	private user: ApiUser | undefined;
	private consumer: ConsumerInfo | undefined;
	private ip: string;
	private sessionId: string;

	constructor(
		ws: Bun.ServerWebSocket<{ id: string }>,
		jetstream: JetStreamClient,
		jetstreamManager: JetStreamManager,
		ip: string
	) {
		this.ws = ws;
		this.ip = ip;
		this.js = jetstream;
		this.jsm = jetstreamManager;
		this.sessionId = ws.data.id;
		this.authenticated = false;
		this.subscriptions = [];
		this.heartbeatInterval = HEARTBEAT_INTERVAL;
		this.heartbeatGrace = HEARTBEAT_GRACE;
		this.heartbeatTimeout = setTimeout(
			() => this.close(4008),
			(this.heartbeatInterval + this.heartbeatGrace) * 2
		);
	}

	public close(code: number) {
		if (this.ws.readyState != WebSocket.OPEN) return;
		this.ws.close(code);
	}

	public send<T>(msg: T): void {
		this.ws.send(JSON.stringify(msg));
	}

	public async receive(msg: string) {
		try {
			var parsedMsg = JSON.parse(msg) as GatewayEvent;
			if (!parsedMsg.op) {
				throw new Error();
			}
		} catch (e) {
			this.close(4002);
			return;
		}

		switch (parsedMsg.op) {
			case GatewayOpCodes.HEARTBEAT: {
				return this.ackHeartbeat();
			}
			case GatewayOpCodes.IDENTIFY: {
				const data = parsedMsg.d as GatewayIdentifyEventData;
				return await this.login(data.token, data.subscriptions as GatewayDispatchEventTypes[]);
			}
			case GatewayOpCodes.RESUME: {
				return;
			}
			default: {
				return this.close(4001);
			}
		}
	}

	public open() {
		this.sendHello();
	}

	public ackHeartbeat() {
		if (!this.authenticated) {
			this.close(4003);
		}

		clearTimeout(this.heartbeatTimeout);
		this.heartbeatTimeout = setTimeout(
			() => this.close(4008),
			this.heartbeatInterval + this.heartbeatGrace
		);

		this.send<GatewayHeartbeatAckEvent>({ op: GatewayOpCodes.HEARTBEAT_ACK });
	}

	public sendHello() {
		this.send<GatewayHelloEvent>({
			op: GatewayOpCodes.HELLO,
			d: { heartbeatInterval: this.heartbeatInterval }
		});
	}

	public async login(token: string, events: GatewayDispatchEventTypes[]) {
		try {
			var data = await verifyAuth(token);
		} catch (e) {
			return this.close(4000);
		}

		if (!data.success) {
			return this.close(4004);
		}

		this.authenticated = true;
		this.subscriptions = events;
		this.user = await getApiUser(data.id);

		await this.createStream();
		await this.startConsumer();
	}

	async createStream() {
		if (!this.authenticated || !this.user) return;

		const stream = `gateway_${this.user.id}`;
		const subject = `gateway.${this.user.id}.*`;

		try {
			await this.jsm.streams.add({
				name: stream,
				subjects: [subject],
				retention: RetentionPolicy.Limits,
				storage: StorageType.Memory,
				discard: DiscardPolicy.Old,
				max_age: 5 * 60 * 1000 * 1_000_000, // 5 minutes in nanoseconds
				max_msgs_per_subject: 1000
			});
		} catch (e) {
			return;
		}
	}

	async startConsumer(startSeq?: number) {
		if (!this.authenticated || !this.user) return;

		const stream = `gateway_${this.user.id}`;
		const subjects = this.subscriptions.map((s) => `gateway.${this.user!.id}.${s}`);

		await this.jsm.consumers.add(stream, {
			durable_name: this.sessionId,
			deliver_policy: startSeq ? DeliverPolicy.StartSequence : DeliverPolicy.New,
			opt_start_seq: startSeq,
			filter_subjects: subjects,
			ack_policy: AckPolicy.None,
			inactive_threshold: 5 * 60 * 1_000_000_000, // 5 min in ns
			max_ack_pending: 1000,
			mem_storage: true
		});

		const consumer = await this.js.consumers.get(stream, this.sessionId);

		while (this.ws.readyState == WebSocket.OPEN) {
			const messages = await consumer.consume();
			for await (const m of messages) {
				const eventType = m.subject.split('.')[2];

				const data = JSON.parse(m.data.toString());
				const sequence = m.info?.streamSequence;

				this.send({
					op: GatewayOpCodes.DISPATCH,
					d: data,
					s: sequence,
					t: eventType
				});
			}
		}
	}
}
