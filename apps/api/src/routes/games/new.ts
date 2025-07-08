import type { ElysiaApp } from '$src/app';
import { createGame, getApiGame } from '@minemaker/db';
import { t } from 'elysia';
import { blockVerified } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockVerified).post(
		'/',
		async ({ id, body, snowflake }) => {
			const gameId = snowflake.nextId().toString();
			await createGame(gameId, id, body.name);

			const project = await getApiGame(gameId.toString());
			return project;
		},
		{
			body: t.Object({
				name: t.String()
			})
		}
	);
