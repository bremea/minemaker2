import { connect, type NatsConnection } from '@nats-io/transport-node';
import {
	AckPolicy,
	DeliverPolicy,
	DiscardPolicy,
	jetstreamManager,
	ReplayPolicy,
	RetentionPolicy,
	StorageType,
	type ConsumerConfig
} from '@nats-io/jetstream';
import type { GatewayDispatchEventTypes } from '@minemaker/types';

export const natsConnection = await connect();

export async function createGatewayConsumer(
	nc: NatsConnection,
	sessionId: string,
	userId: string,
	userIp: string,
	events: GatewayDispatchEventTypes[]
) {
	const streamName = 'GATEWAY';

	const jsm = await jetstreamManager(nc);

	try {
		await jsm.streams.info(streamName);
	} catch {
		await jsm.streams.add({
			name: streamName,
			subjects: ['gateway.>'],
			retention: RetentionPolicy.Limits,
			storage: StorageType.Memory,
			discard: DiscardPolicy.Old,
			max_age: 5 * 60 * 1000 * 1000000 // 5 min in ns
		});
	}

	const subjectFilters = events.map((event) => `gateway.${userId}.${event}`);

	const config: ConsumerConfig = {
		durable_name: sessionId,
		filter_subjects: subjectFilters,
		ack_policy: AckPolicy.Explicit,
		deliver_policy: DeliverPolicy.New,
		replay_policy: ReplayPolicy.Instant,
		metadata: { userId, userIp },
		mem_storage: true,
		inactive_threshold: 5 * 60 * 1000 * 1000000 // 5 min in ns (why tf does nats use nanoseconds)
	};

	const consumer = await jsm.consumers.add(streamName, config);

	return consumer;
}
