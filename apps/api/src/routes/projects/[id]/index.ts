import type { ElysiaApp } from '$src/app';
import { getProject, deleteProject, updateProject } from '@minemaker/db';
import { error } from 'console';
import { t } from 'elysia';
import { checkAuth } from 'lib/utils/auth';

// get project
export default (app: ElysiaApp) =>
	app
		.use(checkAuth)
		.get(
			'',
			async ({ params: { id }, uuid, authenticated }) => {
				const project = await getProject(id);

				if (project.public) {
					return project;
				}

				if (!project.public && authenticated && project.owner === uuid) {
					return project;
				} else {
					return error(401, { error: true, code: 'UNAUTHORIZED' });
				}
			},
			{
				params: t.Object({
					id: t.String()
				})
			}
		)
		.delete(
			'',
			async ({ params: { id }, uuid, authenticated }) => {
				const project = await getProject(id);

				if (!authenticated || uuid !== project.owner) {
					return error(401, { error: true, code: 'UNAUTHORIZED' });
				}

				await deleteProject(id);
				return;
			},
			{
				params: t.Object({
					id: t.String()
				})
			}
		)
		.patch(
			'',
			async ({ params: { id }, body, uuid, authenticated }) => {
				const project = await getProject(id);

				if (!authenticated || uuid !== project.owner) {
					return error(401, { error: true, code: 'UNAUTHORIZED' });
				}

				const newData = { ...project, ...body };

				await updateProject(id, newData.name, newData.description, newData.public);
				return await getProject(id);
			},
			{
				params: t.Object({
					id: t.String()
				}),
				body: t.Object({
					name: t.Optional(t.String()),
					description: t.Optional(t.String()),
					public: t.Optional(t.Boolean())
				})
			}
		);
