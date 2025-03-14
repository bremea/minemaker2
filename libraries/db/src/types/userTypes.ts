import { RowDataPacket } from "mysql2";

export interface DatabaseUser extends RowDataPacket {
	player_uuid: number;
	email: string;
	username: string;
	created_at: string;
	last_login: string;
}