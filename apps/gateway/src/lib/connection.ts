import type {
	ApiUser,
	GatewayEvent,
	GatewayHeartbeatAckEvent,
	GatewayHelloEvent,
	GatewayIdentifyEventData,
	GatewayReadyEvent
} from '@minemaker/types';
import { verifyAuth } from './auth';
import { getApiUser } from '@minemaker/db';

const HEARTBEAT_INTERVAL = 4500;
const HEARTBEAT_GRACE = 1000; // additional time to account for network latency

export class GatewayConnection {
	private ws: Bun.ServerWebSocket<{ id: string }>;
	private heartbeatInterval: number;
	private heartbeatGrace: number;
	private heartbeatTimeout: ReturnType<typeof setTimeout>;
	private authenticated: boolean;
	private user: ApiUser | undefined;
	private sessionId: string;

	constructor(ws: Bun.ServerWebSocket<{ id: string }>) {
		this.ws = ws;
		this.sessionId = ws.data.id;
		this.authenticated = false;
		this.heartbeatInterval = HEARTBEAT_INTERVAL;
		this.heartbeatGrace = HEARTBEAT_GRACE;
		this.heartbeatTimeout = setTimeout(
			() => this.close(4008),
			(this.heartbeatInterval + this.heartbeatGrace) * 2
		);
	}

	public close(code: number) {
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
			case 1: {
				return this.ackHeartbeat();
			}
			case 4: {
				const data = parsedMsg.d as GatewayIdentifyEventData;
				return await this.login(data.token);
			}
			case 6: {
				//return
				return;
			}
			default: {
				return this.close(4001);
			}
		}
	}

	public open() {
		this.send<GatewayHelloEvent>({ op: 3, d: { heartbeatInterval: 4500 } });
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

		this.send<GatewayHeartbeatAckEvent>({ op: 2 });
	}

	public async login(token: string) {
		try {
			var data = await verifyAuth(token);
		} catch (e) {
			return this.close(4000);
		}

		if (!data.success) {
			return this.close(4004);
		}

		this.authenticated = true;
		this.user = await getApiUser(data.id);

		this.send<GatewayReadyEvent>({ op: 5, d: { sessionId: this.sessionId } });
	}
}
