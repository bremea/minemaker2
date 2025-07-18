import type { ElysiaApp } from '$src/app';
import { getBuilds, getGame } from '@minemaker/db';
import { ApiBuild, InternalApiError } from '@minemaker/types';
import { randomUUIDv7 } from 'bun';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

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
				apiBuilds.push({
					buildId: build.build_id,
					gameId: build.game_id,
					success: build.success,
					submittedAt: build.submitted_at,
					finishedAt: build.finished_at
				});
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
