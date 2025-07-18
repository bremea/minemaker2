import { pool } from '$src/connection';
import { DatabaseGame, DatabasePlayerCount, Join } from '@minemaker/types';
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
export async function getUserGames(
	ownerId: string
): Promise<Join<DatabaseGame, { online: number }>[]> {
	const [games] = await pool.query<Join<DatabaseGame, { online: number }>[]>(
		'SELECT g.*, COALESCE(pc.online, 0) AS online FROM games g LEFT JOIN (SELECT pc1.game_id, pc1.online FROM player_counts pc1 JOIN (SELECT game_id, MAX(time) AS max_time FROM player_counts GROUP BY game_id) pc2 ON pc1.game_id = pc2.game_id AND pc1.time = pc2.max_time) pc ON g.game_id = pc.game_id WHERE g.owner = ?;',
		[ownerId]
	);

	return games;
}

/** Gets game by ID */
export async function getGame(gameId: string): Promise<Join<DatabaseGame, { online: number }>> {
	const [gameData] = await pool.query<Join<DatabaseGame, { online: number }>[]>(
		'SELECT g.*, COALESCE(pc.online, 0) AS online FROM games g LEFT JOIN (SELECT online, game_id FROM player_counts WHERE game_id = ? ORDER BY time DESC LIMIT 1) pc ON g.game_id = pc.game_id WHERE g.game_id = ?;',
		[gameId, gameId]
	);

	if (gameData.length == 0) {
		throw `No game exists with id ${gameId}`;
	}

	return gameData[0];
}

/** Gets most popular games */
export async function getMostPopularGames(
	limit: number = 10
): Promise<Join<DatabaseGame, { online: number }>[]> {
	const [gameData] = await pool.query<Join<DatabaseGame, { online: number }>[]>(
		'SELECT g.*, COALESCE(pc.online, 0) AS online FROM games g LEFT JOIN (SELECT pc1.game_id, pc1.online FROM player_counts pc1 JOIN (SELECT game_id, MAX(time) AS max_time FROM player_counts GROUP BY game_id) pc2 ON pc1.game_id = pc2.game_id AND pc1.time = pc2.max_time) pc ON g.game_id = pc.game_id WHERE g.public = true ORDER BY online DESC LIMIT ?;',
		[limit]
	);

	return gameData;
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
