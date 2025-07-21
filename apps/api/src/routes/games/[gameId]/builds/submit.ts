import type { ElysiaApp } from '$src/app';
import { createBuild } from '@minemaker/db';
import { BuildSubmitData, submit } from '@minemaker/realtime';
import { ApiBuild } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).post(
		'/',
		async ({ params, body, snowflake, id, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			const buildId = snowflake.nextId().toString();

			const buildData: BuildSubmitData = {
				buildId,
				gameId: params.gameId,
				buildSrc: body.buildObjectId
			};

			const build = await createBuild(
				buildId,
				params.gameId,
				id,
				false,
				null,
				new Date(Date.now()).toISOString().split('.')[0] + 'Z',
				body.description ?? '',
				ip
			);

			submit(`queues.builds.${params.gameId}`, JSON.stringify(buildData));

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
				gameId: t.String()
			}),
			body: t.Object({
				buildObjectId: t.String(),
				description: t.Optional(t.String())
			})
		}
	);
