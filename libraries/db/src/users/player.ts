import { pool } from '$src/connection';
import {
	InternalApiError,
	DatabasePlayer,
	DatabaseLinkRequest,
	DatabaseUser,
	Join
} from '@minemaker/types';

/** Creates new player */
export async function createPlayer(playerUUID: string, username: string): Promise<void> {
	await pool.query('INSERT INTO players (player_uuid, username) VALUES (?, ?);', [
		playerUUID,
		username
	]);
}

export async function getPlayerByUsername(
	username: string
): Promise<Join<DatabasePlayer, { account_id: string | null }>> {
	const [playerData] = await pool.query<Join<DatabasePlayer, { account_id: string | null }>[]>(
		'SELECT players.*, users.account_id FROM players LEFT JOIN users ON users.mc_account = players.player_uuid WHERE players.username = ?;',
		[username]
	);

	if (playerData.length == 0) {
		throw new InternalApiError(404, `No player exists with username ${username}`);
	}

	return playerData[0];
}

/** Links Minecraft account to user account */
export async function linkPlayer(accountId: string, uuid: string): Promise<void> {
	await pool.query('UPDATE users SET mc_account = ? WHERE account_id = ?', [uuid, accountId]);
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

/** Create link request */
export async function createLinkRequest(
	code: string,
	accountId: string,
	uuid: string
): Promise<void> {
	await pool.query('INSERT INTO link_requests (code, account_id, player_uuid) VALUES (?, ?, ?);', [
		code,
		accountId,
		uuid
	]);
}

/** Get link request */
export async function getLinkRequest(code: string): Promise<DatabaseLinkRequest> {
	const [linkRequestData] = await pool.query<DatabaseLinkRequest[]>(
		'SELECT * FROM link_requests WHERE code = ?;',
		[code]
	);

	if (linkRequestData.length == 0) {
		throw new InternalApiError(404, `No link request found with code ${code}`);
	}

	return linkRequestData[0];
}

/** Delete link request */
export async function deleteLinkRequest(code: string): Promise<void> {
	await pool.query('DELETE FROM link_requests WHERE code = ?;', [code]);
}
