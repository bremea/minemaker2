import type { ElysiaApp } from '$src/app';
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

			submit('queues.builds', JSON.stringify(buildData));

			return { submitted: true };
		},
		{
			params: t.Object({
				gameId: t.String()
			}),
			body: t.Object({
				buildObjectId: t.String()
			})
		}
	);
