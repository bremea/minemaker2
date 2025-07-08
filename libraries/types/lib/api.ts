export interface ApiPlayer {
	uuid: string;
	username: string;
	created: string;
	lastLogin: string;
}

export type ApiUser = {
	id: string;
	email: string;
	verified: false;
	created: string;
	lastLogin: string;
	gems: number;
} | {
	id: string;
	email: string;
	verified: true;
	minecraftAccount: ApiPlayer;
	created: string;
	lastLogin: string;
	gems: number;
}

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
	tags: ApiTag[];
}

export interface ApiTag {
	id: number;
	name: string;
}

export type ApiError = { error: boolean; code: number; message?: string };
