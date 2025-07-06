import type { ElysiaApp } from '$src/app';
import { getUserProjects } from '@minemaker/db';
import { blockAuth } from 'lib/utils/auth';

// get all user projects
export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ uuid }) => {
		const projects = await getUserProjects(uuid);
		return projects;
	});
