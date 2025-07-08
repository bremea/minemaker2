import { pool } from '$src/connection';
import { InternalApiError, DatabasePlayer } from '@minemaker/types';

/** Creates new player */
export async function createPlayer(playerUUID: string, username: string): Promise<void> {
	await pool.query('INSERT INTO users (player_uuid, username) VALUES (?, ?);', [
		playerUUID,
		username
	]);
}

/** Creates new player */
export async function linkPlayer(accountId: string, uuid: string): Promise<void> {
	await pool.query('UPDATE users SET mc_account = ? WHERE account_id = ?', [
		uuid, accountId
	]);
}

/** Gets player via UUID */
export async function getPlayer(playerUUID: string): Promise<DatabasePlayer> {
	const [playerData] = await pool.query<DatabasePlayer[]>(
		'SELECT * FROM players WHERE player_uuid = ?;',
		[playerUUID]
	);

	if (playerData.length == 0) {
		throw new InternalApiError(404, `No player exists with UUID ${playerUUID}`);
	}

	return playerData[0];
}

/** Test if player exists using UUID */
export async function playerExists(playerUUID: string): Promise<boolean> {
	const [playerData] = await pool.query<DatabasePlayer[]>(
		'SELECT 1 FROM players WHERE player_uuid = ?;',
		[playerUUID]
	);

	return playerData.length > 0;
}
