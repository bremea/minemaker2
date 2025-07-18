import type { ElysiaApp } from '$src/app';
import { randomUUIDv7 } from 'bun';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'/',
		async ({ params, r2 }) => {
			const uuid = randomUUIDv7();

			const upload = r2.presign(uuid, {
				expiresIn: 3600, // 1 hour
				method: 'PUT',
				acl: 'authenticated-read'
			});

			return { url: upload, objectId: uuid };
		},
		{
			params: t.Object({
				gameId: t.String()
			})
		}
	);
