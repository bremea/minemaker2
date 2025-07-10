import { connect } from '@nats-io/transport-node';
import { GatewaySession } from './lib/session';
import { jetstream, jetstreamManager } from '@nats-io/jetstream';

const connections: Map<string, GatewaySession> = new Map();

const server = Bun.serve<{ id: string }, any>({
	port: 4000,
	fetch(req, server) {
		server.upgrade(req, {
			data: {
				id: crypto.randomUUID().replace(/-/g, '')
			}
		});
	},
	websocket: {
		async open(ws) {
			const natsConnection = await connect();
			const jsm = await jetstreamManager(natsConnection);
			const js = jetstream(natsConnection);

			const connection = new GatewaySession(ws, js, jsm, '127.0.0.1');
			connections.set(ws.data.id, connection);
			connection.open();
		},
		async message(ws, message) {
			connections.get(ws.data.id)?.receive(message.toString());
		},
		async close(ws, code, reason) {
			connections.delete(ws.data.id);
		}
	}
});

console.log(`Listening on ${server.hostname}:${server.port}`);
