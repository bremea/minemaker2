export enum LocalServerStatus {
	STARTING,
	READY,
	DESTROYING,
	DESTROYED
}

export interface LocalServerState {
	id: number;
	ip: string; // ip assigned by DHCP server
	tap: string; // attached network device
	status: LocalServerStatus;
	online: string[]; // array of connected player uuids
	maxPlayers: number;
	gameId: string;
	uptime: number;
	socket: string; // path to firecracker vsock
}
