import type { ElysiaApp } from '$src/app';
import { getBuild, updateBuild } from '@minemaker/db';
import { t } from 'elysia';
import { serverOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(serverOnly).patch(
		'/:bid',
		async ({ params, id, body }) => {
			const buildData = await getBuild(params.bid);

			if (body.success) {
				buildData.success = body.success;
			}

			if (body.log) {
				buildData.log_object = body.log;
			}

			if (body.object) {
				buildData.artifact_object = body.object;
			}

			await updateBuild(
				params.bid,
				buildData.success,
				body.status,
				buildData.artifact_object,
				buildData.log_object,
				id ?? null,
				body.finished ? new Date(Date.now()).toISOString().split('.')[0] + 'Z' : null
			);

			return { ok: true };
		},
		{
			params: t.Object({
				bid: t.String()
			}),
			body: t.Object({
				status: t.String(),
				finished: t.Optional(t.Boolean()),
				success: t.Optional(t.Boolean()),
				object: t.Optional(t.String()),
				log: t.Optional(t.String())
			})
		}
	);
