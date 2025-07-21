import type { ElysiaApp } from '$src/app';
import { getGame, deleteGame, updateGame, isGameOwner } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { authenticatedUsersOnly, verifiedUsersOnly } from 'lib/utils/auth';

// get thumbnail upload link for this project
export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'',
		async ({ params, id, authenticated }) => {
			if (!authenticated || !(await isGameOwner(params.gameId, id))) {
				throw new InternalApiError(400, 'Unauthorized');
			}
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
