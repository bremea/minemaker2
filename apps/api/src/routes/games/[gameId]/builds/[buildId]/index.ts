import type { ElysiaApp } from '$src/app';
import { getBuild, getGame } from '@minemaker/db';
import { ApiBuild, InternalApiError } from '@minemaker/types';
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

			const build = await getBuild(params.buildId);
			const apiBuild: ApiBuild = {
				buildId: build.build_id,
				gameId: build.game_id,
				success: build.success,
				submittedAt: build.submitted_at,
				finishedAt: build.finished_at,
				userId: build.account_id,
				status: build.status,
				description: build.description,
				builderId: build.builder_id,
				submitterIp: build.submitter_ip
			};

			return apiBuild;
		},
		{
			params: t.Object({
				gameId: t.String(),
				buildId: t.String()
			})
		}
	);
