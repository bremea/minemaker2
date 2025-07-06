import type { ElysiaApp } from '$src/app';
import { createProject, getProject } from '@minemaker/db';
import { t } from 'elysia';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).post(
		'/',
		async ({ uuid, body, snowflake }) => {
			const id = snowflake.nextId().toString();
			await createProject(id, uuid, body.name);

			const project = await getProject(id.toString());
			return project;
		},
		{
			body: t.Object({
				name: t.String()
			})
		}
	);
