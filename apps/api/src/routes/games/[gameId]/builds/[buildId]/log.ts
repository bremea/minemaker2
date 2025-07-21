import type { ElysiaApp } from '$src/app';
import { getBuild, getGame, isGameOwner } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { NotFoundError, t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'/',
		async ({ id, authenticated, params, r2, query, redirect }) => {
			if (!authenticated || !(await isGameOwner(params.gameId, id))) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const builds = await getBuild(params.buildId);

			const exists = await r2.exists(builds.log_object);
			if (!exists) {
				throw new NotFoundError();
			}

			try {
				const log = r2.file(builds.log_object);
				const url = log.presign({
					method: 'GET',
					expiresIn: 3600
				});

				if (query.noRedirect) {
					return url;
				} else {
					return redirect(url, 302);
				}
			} catch (e) {
				throw new NotFoundError();
			}
		},
		{
			params: t.Object({
				gameId: t.String(),
				buildId: t.String()
			}),
			query: t.Object({
				noRedirect: t.Optional(t.String())
			})
		}
	);
