import { GatewayConnection } from './lib/connection';

const connections: Map<string, GatewayConnection> = new Map();

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
			const connection = new GatewayConnection(ws);
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
