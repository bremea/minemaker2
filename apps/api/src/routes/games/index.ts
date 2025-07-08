import type { ElysiaApp } from '$src/app';
import { getUserGames } from '@minemaker/db';
import { blockAuth } from 'lib/utils/auth';

// get all user projects
export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ id }) => {
		const projects = await getUserGames(id);
		return projects;
	});
