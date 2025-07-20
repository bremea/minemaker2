export interface ApiPlayer {
	uuid: string;
	username: string;
	created: string;
	lastLogin: string;
}

export interface ApiVerifiedUser {
	// verified
	id: string;
	email: string;
	verified: true;
	player: ApiPlayer;
	created: string;
	lastLogin: string;
	gems: number;
	guest: false;
}

export interface ApiUnverifiedUser {
	// not verified
	id: string;
	email: string;
	verified: false;
	created: string;
	lastLogin: string;
	gems: number;
	guest: false;
}

export interface ApiGuest {
	player: ApiPlayer;
	guest: true;
}

export type ApiUser = ApiVerifiedUser | ApiUnverifiedUser | ApiGuest;

export interface ApiServer {
	id: string;
	region: string;
	gameId: string;
	online: number;
	maxPlayers: number;
}

export interface ApiPresence {
	game: ApiGame;
	server?: ApiServer;
}

export interface ApiProfile {
	playerData: ApiPlayer;
	userData?: ApiUserProfile;
	creations?: ApiGame[];
	presence?: ApiPresence;
}

export interface ApiUserProfile {
	id: string;
	verified: boolean;
	created: string;
	lastLogin: string;
}

export interface ApiGameProperties {
	maxPlayers: number;
}

export interface ApiGame {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	created: string;
	public: boolean;
	online: number;
	properties?: ApiGameProperties;
	tags?: string[];
}

export interface ApiBuild {
	buildId: string;
	gameId: string;
	userId: string;
	status: string;
	success: boolean;
	description: string;
	builderId: string;
	submitterIp: string;
	submittedAt: string;
	finishedAt: string;
}

export interface ApiTag {
	id: number;
	name: string;
}

export type ApiError = { error: boolean; code: number; message?: string };

export type ApiPlaylog = Array<ApiPlaylogEntry>;

export interface ApiPlaylogEntry {
	game: ApiGame;
	lastPlayed: string;
}
