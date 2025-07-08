import type { ElysiaApp } from '$src/app';
import { getGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { checkAuth } from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app.use(checkAuth).get(
		'',
		async ({ params: { gameId }, id, authenticated }) => {
			const project = await getGame(gameId);

			if (project.public) {
				return project;
			}

			if (!project.public && authenticated && project.owner === id) {
				return project;
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
