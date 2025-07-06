import { RowDataPacket } from "mysql2";

export interface DatabaseProject extends RowDataPacket {
	game_id: string;
	owner: string;
	description: string;
	created_at: string;
	public: boolean;
}

export interface DatabaseTags extends RowDataPacket {
	tag_id: number;
	name: string;
}


export interface DatabaseGameTags extends RowDataPacket {
	tag_id: number;
	game_id: number;
}
