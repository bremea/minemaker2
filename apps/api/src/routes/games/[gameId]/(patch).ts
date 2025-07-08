import type { ElysiaApp } from '$src/app';
import { getGame, updateGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { checkAuth } from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app.use(checkAuth).patch(
		'',
		async ({ params: { gameId }, body, id, authenticated }) => {
			const project = await getGame(gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const newData = { ...project, ...body };

			await updateGame(id, newData.name, newData.description, newData.public);
			return await getGame(id);
		},
		{
			params: t.Object({
				gameId: t.String()
			}),
			body: t.Object({
				name: t.Optional(t.String()),
				description: t.Optional(t.String()),
				public: t.Optional(t.Boolean())
			})
		}
	);
