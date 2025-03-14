export interface User {
	uuid: string;
	username: string;
	email: string;
	created: Date;
	lastLogin: Date;
	gems: number;
}