import type { ElysiaApp } from '$src/app';
import { getProject, deleteProject } from '@minemaker/db';
import { t } from 'elysia';
import verifyAuth from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app
		.use(verifyAuth)
		.get(
			'',
			async ({ params: { id } }) => {
				const projects = await getProject(id);
				return projects;
			},
			{
				params: t.Object({
					id: t.String()
				})
			}
		)
		.delete(
			'',
			async ({ params: { id } }) => {
				await deleteProject(id);
				return;
			},
			{
				params: t.Object({
					id: t.String()
				})
			}
		)
		.patch('', async ({ params: { id } }) => {}, {
			params: t.Object({
				id: t.String()
			}),
			body: t.Object({
				name: t.Optional(t.String()),
				description: t.Optional(t.String()),
				thumbnail: t.Optional(t.File({ format: 'image/*' })),
			})
		});
