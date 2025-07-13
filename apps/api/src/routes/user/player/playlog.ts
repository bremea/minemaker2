import type { ElysiaApp } from '$src/app';
import { getPlaylog } from '@minemaker/db';
import { ApiPlaylog } from '@minemaker/types';
import { blockNonGuest } from 'lib/utils/auth';
import { getApiGame } from 'lib/utils/game';

export default (app: ElysiaApp) =>
	app.use(blockNonGuest).get('/', async ({ uuid }) => {
		const playlog = await getPlaylog(uuid);

		const apiPlaylog: ApiPlaylog = [];
		for (const logEntry of playlog) {
			const game = await getApiGame(logEntry.game_id);

			apiPlaylog.push({
				game: game,
				lastPlayed: logEntry.last_played
			});
		}

		return apiPlaylog;
	});
