import type { GameManifest } from '@minemaker/types';
import { LocalServer } from './localServer';

export class LocalServerManager {
	public localServers: Map<number, LocalServer>;

	constructor() {
		this.localServers = new Map();
	}

	public async createLocalServer(manifest: GameManifest) {
		/**
		 * TODO: Need to add "builder" service
		 * in studio app you submit builds to a builder queue
		 * builder builds plugin/texture pack/schematic/etc objects into rootfs file system for firecracker
		 * builder uploads that to R2 - don't have to upload each pack/plugin/schematic, just one rootfs
		 *
		 * could have builder be in studio app itself but possible security concerns?
		 */

		// download game rootfs

		// create network tap device

		// spin up VM

		const id = 0;
		const ip = '0';

		const newServer = new LocalServer(id, ip, manifest);
		this.localServers.set(id, newServer);

		// bind vsock events
	}

	// util functions for finding servers running specific games
	// hook these util functions into NATS query responses
}
