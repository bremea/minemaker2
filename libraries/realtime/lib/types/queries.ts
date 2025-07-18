export interface FindServerResponse {
	id: string;
	gameId: string;
	region: string;
	ip: string;
	playersOnline: number;
	maxPlayers: number;
}

export interface GetPresenceResponse {
	uuid: string;
	gameId: string;
	serverId: string;
	region: string;
	serverIp: string;
	playerIp: string;
	/** Players on this game instance only */
	playersOnline: number;
	maxPlayers: number;
	/** Time in seconds since joining this specific server */
	timeInInstance: number;
}