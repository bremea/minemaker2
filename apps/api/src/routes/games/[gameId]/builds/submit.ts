import type { ElysiaApp } from '$src/app';
import { createBuild } from '@minemaker/db';
import { BuildSubmitData, submit } from '@minemaker/realtime';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).post(
		'/',
		async ({ params, body, snowflake }) => {
			const buildId = snowflake.nextId().toString();

			const buildData: BuildSubmitData = {
				buildId,
				gameId: params.gameId,
				buildSrc: body.buildObjectId
			};

			await createBuild(
				buildId,
				params.gameId,
				false,
				null,
				new Date(Date.now()).toISOString().split('.')[0]+"Z",
				body.description ?? ''
			);

			submit(`queues.builds.${params.gameId}`, JSON.stringify(buildData));

			return { submitted: true };
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
