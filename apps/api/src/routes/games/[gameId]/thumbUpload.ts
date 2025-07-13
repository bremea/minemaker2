import type { ElysiaApp } from '$src/app';
import { getGame, deleteGame, updateGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { authenticatedUsersOnly } from 'lib/utils/auth';

// get thumbnail upload link for this project
export default (app: ElysiaApp) =>
	app.use(authenticatedUsersOnly).get(
		'',
		async ({ params: { gameId }, id, authenticated }) => {
			const project = await getGame(gameId);

			if (!authenticated || project.owner !== id) {
				throw new InternalApiError(400, 'Unauthorized');
			}
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
