import { pool } from '$src/connection';
import { DatabaseBuild } from '@minemaker/types';

/** Creates new build */
export async function createBuild(
	id: string,
	gameId: string,
	accountId: string,
	success: boolean | null,
	artifactObject: string | null,
	submitTime: string,
	description: string,
	ip: string
): Promise<DatabaseBuild> {
	const [buildData] = await pool.query<DatabaseBuild[]>(
		'INSERT INTO builds (build_id, game_id, account_id, success, artifact_object, submitted_at, description, submitter_ip) VALUES (?, ?, ?, ?, ?, STR_TO_DATE(?, "%Y-%m-%dT%TZ"), ?, ?) RETURNING *;',
		[id, gameId, accountId, success, artifactObject, submitTime, description, ip]
	);

	if (buildData.length == 0) {
		throw `Build creation failed`;
	}

	return buildData[0];
}

/** Updates a build */
export async function updateBuild(
	id: string,
	success: boolean,
	status: string,
	artifactObject: string | null,
	logObject: string | null,
	builderId: string | null,
	finished: string | null,
	time: number | null
): Promise<DatabaseBuild> {
	const [buildData] = await pool.query<DatabaseBuild[]>(
		'UPDATE builds SET success = ?, status = ?, artifact_object = ?, log_object = ?, builder_id = ?, finished_at = STR_TO_DATE(?, "%Y-%m-%dT%TZ"), time = ? WHERE build_id = ?; SELECT * FROM builds WHERE build_id = ?;',
		[success, status, artifactObject, logObject, builderId, finished, time, id, id]
	);

	if (buildData.length < 1) {
		throw `Build update failed`;
	}

	return buildData[1];
}

/** Gets build by ID */
export async function getBuild(buildId: string): Promise<DatabaseBuild> {
	const [buildData] = await pool.query<DatabaseBuild[]>(
		'SELECT * FROM builds WHERE build_id = ?;',
		[buildId]
	);

	if (buildData.length == 0) {
		throw `No build exists with id ${buildId}`;
	}

	return buildData[0];
}

/** Gets builds from a specific game */
export async function getBuilds(
	gameId: string,
	limit: number = 25,
	offset: number = 0
): Promise<DatabaseBuild[]> {
	const [buildData] = await pool.query<DatabaseBuild[]>(
		'SELECT * FROM builds WHERE game_id = ? ORDER BY submitted_at DESC LIMIT ? OFFSET ?;',
		[gameId, limit, offset]
	);

	return buildData;
}

/** Gets most recent build for game by game ID */
export async function getMostRecentBuild(gameId: string): Promise<DatabaseBuild> {
	const [buildData] = await pool.query<DatabaseBuild[]>(
		'SELECT * FROM builds WHERE game_id = ? ORDER BY finished_at DESC LIMIT 1;',
		[gameId]
	);

	if (buildData.length == 0) {
		throw `No builds exists yet for game ${gameId}`;
	}

	return buildData[0];
}
