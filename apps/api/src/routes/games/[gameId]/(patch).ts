import type { ElysiaApp } from '$src/app';
import { getApiGame } from 'lib/utils/game';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';
import { getGame, updateGame } from '@minemaker/db';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).patch(
		'',
		async ({ params, body, id, authenticated }) => {
			const project = await getGame(params.gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const newData = { ...project, ...body };

			await updateGame(id, newData.name, newData.description, newData.public);
			return await getApiGame(id);
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
