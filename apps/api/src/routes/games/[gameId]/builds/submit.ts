import type { ElysiaApp } from '$src/app';
import { createBuild, isGameOwner } from '@minemaker/db';
import { BuildSubmitData, submit } from '@minemaker/realtime';
import { ApiBuild, InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';
import { convertToApiBuild } from 'lib/utils/builds';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).post(
		'/',
		async ({ params, authenticated, body, snowflake, id, ip }) => {
			if (ip === '::1' || ip === '::ffff:127.0.0.1') {
				ip = '127.0.0.1';
			}

			if (!authenticated || !(await isGameOwner(params.gameId, id))) {
				throw new InternalApiError(400, 'Unauthorized');
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
				null,
				null,
				new Date(Date.now()).toISOString().split('.')[0] + 'Z',
				body.description ?? '',
				ip
			);

			submit(`queues.builds.${params.gameId}`, JSON.stringify(buildData));

			return convertToApiBuild(build);
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
