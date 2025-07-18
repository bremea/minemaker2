import type { ElysiaApp } from '$src/app';
import { NotFoundError, t } from 'elysia';
import { checkAuth } from 'lib/utils/auth';
import { getApiGame } from 'lib/utils/game';

// get project
export default (app: ElysiaApp) =>
	app.use(checkAuth).get(
		'',
		async ({ params: { gameId }, authResult }) => {
			const game = await getApiGame(gameId);

			if (game.public) {
				return game;
			}

			if (!game.public && authResult.authenticated && game.ownerId === authResult.id) {
				return game;
			} else {
				throw new NotFoundError();
			}
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
