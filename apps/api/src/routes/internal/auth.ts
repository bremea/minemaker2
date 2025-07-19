import type { ElysiaApp } from '$src/app';
import { t } from 'elysia';

export default (app: ElysiaApp) =>
	app.get(
		'/:id',
		async ({ jwt, params }) => {
			const token = await jwt.sign({
				server: "true",
				id: params.id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // expires in 30 days
			});

			return { token };
		},
		{
			params: t.Object({
				id: t.String()
			})
		}
	);
