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

export interface ApiProfile {
	id: string;
	verified: boolean;
	minecraftAccount?: ApiPlayer;
}

export interface ApiGame {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	created: string;
	public: boolean;
	online: number;
	tags: string[];
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
