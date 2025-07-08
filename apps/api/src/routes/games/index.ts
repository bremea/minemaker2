import type { ElysiaApp } from '$src/app';
import { getUserApiGames } from '@minemaker/db';
import { blockAuth } from 'lib/utils/auth';

// get all user projects
export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ id }) => {
		const projects = await getUserApiGames(id);
		return projects;
	});
