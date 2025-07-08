import { pool } from '$src/connection';
import { InternalApiError, DatabasePlayer, DatabasePlayLog, DatabaseUser } from '@minemaker/types';
import { getPlayer } from './player';

/** Creates new user */
export async function createUser(id: string, email: string, passwordHash: string): Promise<void> {
	await pool.query('INSERT INTO users (account_id, email, password) VALUES (?, ?, ?);', [
		id,
		email,
		passwordHash
	]);
}

/** Gets user via UUID */
export async function getUser(id: string): Promise<DatabaseUser> {
	const [userData] = await pool.query<DatabaseUser[]>('SELECT * FROM users WHERE account_id = ?;', [
		id
	]);

	if (userData.length == 0) {
		throw new InternalApiError(400, `No user exists with UUID ${id}`);
	}

	return userData[0];
}

/** Checks if user is verified */
export async function checkUserVerified(id: string): Promise<boolean> {
	const [userData] = await pool.query<DatabaseUser[]>(
		'SELECT 1 FROM users WHERE account_id = ? AND mc_account IS NOT NULL;',
		[id]
	);

	return userData.length > 0;
}

/** Gets user and its player data via UUID */
export async function getUserAndPlayerData(
	id: string
): Promise<{ user: DatabaseUser; player?: DatabasePlayer }> {
	const user = await getUser(id);
	let player: DatabasePlayer | undefined = undefined;

	if (typeof user.mc_account == 'string') {
		player = await getPlayer(user.mc_account);
	}

	return {
		user,
		player
	};
}

/** Gets user via UUID */
export async function getUserByEmail(email: string): Promise<DatabaseUser> {
	const [userData] = await pool.query<DatabaseUser[]>('SELECT * FROM users WHERE email = ?;', [
		email
	]);

	if (userData.length == 0) {
		throw new InternalApiError(400, `No user exists with email ${email}`);
	}

	return userData[0];
}

/** Test if user exists with email */
export async function userExists(email: string): Promise<boolean> {
	const [userData] = await pool.query<DatabaseUser[]>('SELECT 1 FROM users WHERE email = ?;', [
		email
	]);

	return userData.length > 0;
}
