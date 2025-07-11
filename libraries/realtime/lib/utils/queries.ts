import { createInbox, Empty, type Msg, type MsgCallback } from '@nats-io/transport-node';
import { natsConnection } from '..';
import { wait } from '.';

export async function createQuery<T = any>(
	subject: string,
	data: any = Empty,
	timeout: number = 1000
): Promise<T | null> {
	try {
		return (await natsConnection.request(subject, data, { timeout })) as T;
	} catch (_) {
		return null;
	}
}

export async function createMultiResponseQuery<T = any>(
	subject: string,
	data: any = Empty,
	timeout: number = 1000
): Promise<Array<T>> {
	const replySubject = createInbox();

	const sub = natsConnection.subscribe(replySubject);
	const responses: T[] = [];

	natsConnection.publish(subject, data, { reply: replySubject });

	const callback = (err: Error | null, msg: Msg) => {
		responses.push(msg.json<T>());
	};
	sub.callback = callback;

	await wait(timeout);
	sub.unsubscribe();
	return responses;
}

export async function listenForQuery(subject: string, callback: MsgCallback<Msg>) {
	natsConnection.subscribe(subject, {
		callback
	});
}
