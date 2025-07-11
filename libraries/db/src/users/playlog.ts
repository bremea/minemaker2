import { pool } from '$src/connection';
import { InternalApiError, DatabasePlayer, DatabaseLinkRequest, DatabasePlayLog } from '@minemaker/types';

/** Gets recent playlog for player */
export async function getPlaylog(playerUUID: string): Promise<DatabasePlayLog[]> {
	const [playLog] = await pool.query<DatabasePlayLog[]>(
		'SELECT * FROM playlog WHERE player_uuid = ? LIMIT 25;',
		[playerUUID]
	);

	return playLog;
}
