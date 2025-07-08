import type { ElysiaApp } from '$src/app';
import { getApiGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { checkAuth } from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app.use(checkAuth).get(
		'',
		async ({ params: { gameId }, id, authenticated }) => {
			const game = await getApiGame(gameId);

			if (game.public) {
				return game;
			}

			if (!game.public && authenticated && game.ownerId === id) {
				return game;
			} else {
				throw new InternalApiError(400, 'Unauthorized');
			}
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
