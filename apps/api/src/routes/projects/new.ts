import type { ElysiaApp } from '$src/app';
import { createProject, getProject } from '@minemaker/db';
import { t } from 'elysia';
import verifyAuth from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(verifyAuth).post(
		'/',
		async ({ uuid, body, snowflake }) => {
			const id = snowflake.nextId().toString();
			console.log(id)
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
