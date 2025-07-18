import type { ElysiaApp } from '$src/app';
import { t } from 'elysia';
import { getApiProfile } from 'lib/utils/user';

export default (app: ElysiaApp) =>
	app.get(
		'/',
		async ({ params }) => {
			const user = await getApiProfile(params.username);
			return user;
		},
		{
			params: t.Object({
				username: t.String()
			})
		}
	);
