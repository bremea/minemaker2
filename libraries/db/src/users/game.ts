import { pool } from '$src/connection';
import { DatabaseGame, DatabasePlayerCount } from '@minemaker/types';
import { RowDataPacket } from 'mysql2';

/** Creates new game */
export async function createGame(id: string, ownerId: string, name: string): Promise<void> {
	await pool.query('INSERT INTO games (game_id, owner, name) VALUES (?, ?, ?);', [
		id,
		ownerId,
		name
	]);
}

/** Deletes game */
export async function deleteGame(id: string): Promise<void> {
	await pool.query('DELETE FROM games WHERE game_id = ?;', [id]);
}

/** Modifies a game */
export async function updateGame(
	id: string,
	name: string,
	description: string,
	isPublic: boolean
): Promise<void> {
	await pool.query('UPDATE games SET name = ?, description = ?, public = ? WHERE game_id = ?;', [
		name,
		description,
		isPublic,
		id
	]);
}

/** Gets user's games by ID */
export async function getUserGames(ownerId: string): Promise<DatabaseGame[]> {
	const [games] = await pool.query<DatabaseGame[]>('SELECT * FROM games WHERE owner = ?;', [
		ownerId
	]);

	return games;
}

/** Gets a game's last recorded playcount */
export async function getLastPlayCount(gameId: string): Promise<DatabasePlayerCount> {
	const [playCount] = await pool.query<DatabasePlayerCount[]>(
		'SELECT * FROM player_counts WHERE game_id = ? ORDER BY time DESC LIMIT 1;',
		[gameId]
	);

	if (playCount.length == 0) {
		return {
			log_id: -1,
			game_id: gameId,
			online: 0,
			time: new Date().toString()
		} as DatabasePlayerCount;
	}

	return playCount[0];
}

/** Gets game by ID */
export async function getGame(gameId: string): Promise<DatabaseGame> {
	const [gameData] = await pool.query<DatabaseGame[]>('SELECT * FROM games WHERE game_id = ?;', [
		gameId
	]);

	if (gameData.length == 0) {
		throw `No game exists with id ${gameId}`;
	}

	return gameData[0];
}

/** Gets game tags by ID */
// TODO possibly broken
export async function getGameTags(gameId: string): Promise<string[]> {
	const [tags] = await pool.query<RowDataPacket[]>(
		`SELECT tags.name AS tags
		FROM tags
		JOIN game_tags ON tags.tag_id = game_tags.tag_id
		WHERE game_tags.game_id = ?;`,
		[gameId]
	);

	return tags as unknown as string[];
}
