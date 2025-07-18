import {
	AckPolicy,
	DeliverPolicy,
	DiscardPolicy,
	jetstream,
	jetstreamManager,
	RetentionPolicy,
	type JsMsg
} from '@nats-io/jetstream';
import { natsConnection } from '..';

export async function createQueue(name: string, subject: string) {
	const jsm = await jetstreamManager(natsConnection);

	try {
		await jsm.streams.info(name);
	} catch {
		await jsm.streams.add({
			name: name,
			subjects: [subject],
			retention: RetentionPolicy.Workqueue,
			discard: DiscardPolicy.New,
			max_msgs: 1000
		});
	}

	try {
		await jsm.consumers.info(name, 'default');
	} catch {
		await jsm.consumers.add(name, {
			name: 'default',
			filter_subjects: [subject],
			ack_policy: AckPolicy.Explicit
		});
	}
}

export async function submit(subject: string, data: any) {
	const js = jetstream(natsConnection);
	await js.publish(subject, data);
}

export async function processQueue(queueName: string): Promise<AsyncGenerator<JsMsg>> {
	const js = jetstream(natsConnection);

	const consumer = await js.consumers.get(queueName, 'default');

	async function* iterator(): AsyncGenerator<JsMsg> {
		while (true) {
			let msg: JsMsg | null;
			try {
				msg = await consumer.next();
			} catch (err) {
				throw err;
			}

			if (msg == null) {
				continue;
			}

			yield msg;
		}
	}

	return iterator();
}
