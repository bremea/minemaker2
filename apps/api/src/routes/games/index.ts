import type { ElysiaApp } from '$src/app';
import { getMostPopularGames } from '@minemaker/db';
import { authenticatedUsersOnly, verifiedUsersOnly } from 'lib/utils/auth';
import { getUserApiGames } from 'lib/utils/game';

// get all user projects
export default (app: ElysiaApp) =>
	app
		.get('/popular', async () => {
			const projects = await getMostPopularGames();
			return projects;
		})
		.use(verifiedUsersOnly)
		.get('/', async ({ id }) => {
			const projects = await getUserApiGames(id);
			return projects;
		});
