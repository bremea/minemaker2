import type { ElysiaApp } from '$src/app';
import { getGame, deleteGame, isGameOwner } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).delete(
		'',
		async ({ params, id, authenticated }) => {
			if (!authenticated || !(await isGameOwner(params.gameId, id))) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			await deleteGame(params.gameId);
			return;
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
