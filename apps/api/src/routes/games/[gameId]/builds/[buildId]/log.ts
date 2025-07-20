import type { ElysiaApp } from '$src/app';
import { getBuild, getGame } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'/',
		async ({ id, authenticated, params, r2, redirect }) => {
			const project = await getGame(params.gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const builds = await getBuild(params.buildId);

			const log = r2.file(builds.log_object);
			const url = log.presign({
				method: 'GET',
				expiresIn: 3600
			});

			return redirect(url, 302);
		},
		{
			params: t.Object({
				gameId: t.String(),
				buildId: t.String()
			})
		}
	);
