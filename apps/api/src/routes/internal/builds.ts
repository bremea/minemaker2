import type { ElysiaApp } from '$src/app';
import { getBuild, updateBuild } from '@minemaker/db';
import { status, t } from 'elysia';
import { serverOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(serverOnly).patch(
		'/:bid',
		async ({ params, id, body }) => {
			await updateBuild(
				params.bid,
				body.success,
				body.status,
				body.object,
				body.log,
				id ?? null,
				new Date(Date.now()).toISOString().split('.')[0] + 'Z'
			);

			return { ok: true };
		},
		{
			params: t.Object({
				bid: t.String()
			}),
			body: t.Object({
				status: t.String(),
				success: t.Boolean(),
				object: t.String(),
				log: t.String()
			})
		}
	);
