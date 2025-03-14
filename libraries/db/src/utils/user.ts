import { pool } from '$src/connection';
import { DatabaseUser } from '$src/types/userTypes';
import { type User } from '@minemaker/caller';

/** Creates new user */
export async function createUser(playerUUID: string, username: string, email: string): Promise<void> {
	await pool.query('INSERT INTO users (player_uuid, username, email) VALUES (?, ?, ?);', [
		playerUUID,
		username,
		email
	]);
}

/** Gets user via UUID */
export async function getUser(playerUUID: string): Promise<User> {
	const [userData] = await pool.query<DatabaseUser[]>(
		'SELECT * FROM users WHERE player_uuid = ?;',
		[playerUUID]
	);

	if (userData.length == 0) {
		throw `No user exists with UUID ${playerUUID}`;
	}

	return {
		uuid: playerUUID,
		username: userData[0].username,
		email: userData[0].email,
		created: new Date(userData[0].created_at),
		lastLogin: new Date(userData[0].last_login),
		gems: 100
	};
}

/** Test if user exists using UUID */
export async function userExists(playerUUID: string): Promise<boolean> {
	const [userData] = await pool.query<DatabaseUser[]>(
		'SELECT 1 FROM users WHERE player_uuid = ?;',
		[playerUUID]
	);

	return userData.length > 0;
}
