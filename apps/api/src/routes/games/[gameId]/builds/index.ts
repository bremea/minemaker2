import type { ElysiaApp } from '$src/app';
import { getBuilds, getGame } from '@minemaker/db';
import { ApiBuild, InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';
import { convertToApiBuild } from 'lib/utils/builds';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'/',
		async ({ id, authenticated, params, query }) => {
			const project = await getGame(params.gameId);

			if (!authenticated || id !== project.owner) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const builds = await getBuilds(params.gameId, query.limit ?? 25, query.offset ?? 0);
			const apiBuilds: ApiBuild[] = [];

			for (const build of builds) {
				apiBuilds.push(convertToApiBuild(build));
			}

			return apiBuilds;
		},
		{
			params: t.Object({
				gameId: t.String()
			}),
			query: t.Optional(
				t.Object({
					limit: t.Optional(t.Number()),
					offset: t.Optional(t.Number())
				})
			)
		}
	);
