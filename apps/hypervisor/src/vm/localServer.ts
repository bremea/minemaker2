import type { GameManifest } from '@minemaker/types';
import { LocalServerStatus, type LocalServerState } from '../lib/types';

export class LocalServer {
	public state: LocalServerState;

	constructor(id: number, ip: string, manifest: GameManifest) {
		this.state = {
			id,
			ip,
			tap: `tap${id}`,
			status: LocalServerStatus.STARTING,
			online: [],
			maxPlayers: manifest.maxPlayers,
			gameId: manifest.id,
			uptime: 0,
			socket: `/tmp/vsock-${id}`
		};
	}

	// listen to vsock events
	// enforce heartbeat
	// get status updates (starting, started, etc)
	// get player count updates
}
