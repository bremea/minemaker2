import type { ElysiaApp } from '$src/app';
import { createGame, getGame } from '@minemaker/db';
import { t } from 'elysia';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).post(
		'/',
		async ({ uuid, body, snowflake }) => {
			const id = snowflake.nextId().toString();
			await createGame(id, uuid, body.name);

			const project = await getGame(id.toString());
			return project;
		},
		{
			body: t.Object({
				name: t.String()
			})
		}
	);
