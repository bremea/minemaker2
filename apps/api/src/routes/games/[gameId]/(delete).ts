import type { ElysiaApp } from '$src/app';
import { getGame, deleteGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).delete(
		'',
		async ({ params: { gameId }, id, authenticated }) => {
			const project = await getGame(gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			await deleteGame(id);
			return;
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
