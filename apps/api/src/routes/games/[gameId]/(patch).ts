import type { ElysiaApp } from '$src/app';
import { getApiGame } from 'lib/utils/game';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';
import { getGame, setBuildLive, updateGame } from '@minemaker/db';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).patch(
		'',
		async ({ params, body, id, authenticated }) => {
			const project = await getGame(params.gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			if (body.description || body.public || body.name) {
				const newData = { ...project, ...body };

				await updateGame(params.gameId, newData.name, newData.description, newData.public);
			}

			if (body.liveBuild) {
				await setBuildLive(params.gameId, body.liveBuild);
			}
			
			return await getApiGame(id);
		},
		{
			params: t.Object({
				gameId: t.String()
			}),
			body: t.Object({
				name: t.Optional(t.String()),
				description: t.Optional(t.String()),
				public: t.Optional(t.Boolean()),
				liveBuild: t.Optional(t.String())
			})
		}
	);
