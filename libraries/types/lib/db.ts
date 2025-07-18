import type { RowDataPacket } from 'mysql2';

export type Join<A, B> = A & B;

export interface DatabasePlayer extends RowDataPacket {
	player_uuid: string;
	username: string;
	created_at: string;
	last_login: string;
}

export interface DatabaseUser extends RowDataPacket {
	account_id: string;
	email: string;
	password: string;
	mc_account: string | null;
	created_at: string;
	last_login: string;
	gems: number;
}

export interface DatabaseTrustedIp extends RowDataPacket {
	account_id: string;
	ip: string;
	last_login: string;
}

export interface DatabaseIpTrustRequest extends RowDataPacket {
	code: string;
	account_id: string;
	ip: string;
	code_sent: string;
}

export interface DatabaseSession extends RowDataPacket {
	session_id: string;
	account_id: string;
	last_ip: string;
	user_agent: string;
	created_at: string;
	expires: string;
}

export interface DatabaseUserPermission extends RowDataPacket {
	player_uuid: string;
	ban: boolean;
	kick: boolean;
	warn: boolean;
	refund: boolean;
	edit_permissions: boolean;
}

export interface DatabasePermissionEditLog extends RowDataPacket {
	log_id: number;
	editor_uuid: string;
	victim_uuid: string;
	column_changed: string;
	old_value: boolean;
	new_value: boolean;
	changed_at: string;
}

export interface DatabaseModActionLog extends RowDataPacket {
	log_id: number;
	mod_uuid: string;
	victim_uuid: string;
	action: string;
	action_data: string;
	timestamp: string;
}

export interface DatabaseGame extends RowDataPacket {
	game_id: string;
	owner: string;
	name: string;
	description: string;
	created_at: string;
	public: boolean;
}

export interface DatabasePlayerCount extends RowDataPacket {
	log_id: number;
	game_id: string;
	online: number;
	time: string;
}

export interface DatabaseBuild extends RowDataPacket {
	build_id: string;
	game_id: string;
	account_id: string;
	status: number;
	success: boolean;
	description: string;
	artifact_object: string;
	submitter_ip: string;
	builder_id: number;
	submitted_at: string;
	finished_at: string;
}

export interface DatabaseTag extends RowDataPacket {
	tag_id: number;
	name: string;
}

export interface DatabaseGameTag extends RowDataPacket {
	tag_id: number;
	game_id: string;
}

export interface DatabaseProduct extends RowDataPacket {
	product_id: string;
	game_id: string;
	name: string;
	description: string;
	price: number;
	available: boolean;
	created_at: string;
	last_modified: string;
}

export interface DatabaseGemLog extends RowDataPacket {
	purchase_uuid: string;
	account_id: string;
	product_id: string;
	price: number;
	purchased_at: string;
}

export interface DatabaseFavoriteGame extends RowDataPacket {
	player_uuid: string;
	game_id: string;
	favorited_on: string;
}

export interface DatabasePlayLog extends RowDataPacket {
	player_uuid: string;
	game_id: string;
	last_played: string;
}

export interface DatabaseLinkRequest extends RowDataPacket {
	code: string;
	account_id: string;
	player_uuid: string;
	expires: string;
}
