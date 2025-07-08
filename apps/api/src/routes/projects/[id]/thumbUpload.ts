import type { ElysiaApp } from '$src/app';
import { getGame, deleteGame, updateGame } from '@minemaker/db';
import { t } from 'elysia';
import { blockAuth } from 'lib/utils/auth';

// get thumbnail upload link for this project
export default (app: ElysiaApp) =>
	app
		.use(blockAuth)
		.get(
			'',
			async ({ params: { id }, uuid, authenticated, error }) => {
				const project = await getGame(id);

				if (!authenticated || project.owner !== uuid) {
					return error(401, { error: true, code: 'UNAUTHORIZED' });
				}

				
			},
			{
				params: t.Object({
					id: t.String()
				})
			}
		)