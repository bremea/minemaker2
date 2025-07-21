import type { ElysiaApp } from '$src/app';
import { getMostPopularGames } from '@minemaker/db';
import { authenticatedUsersOnly, verifiedUsersOnly } from 'lib/utils/auth';
import { convertArrayToApiGame, getUserApiGames } from 'lib/utils/game';

// get all user projects
export default (app: ElysiaApp) =>
	app
		.get('/popular', async () => {
			const games = await getMostPopularGames();
			return convertArrayToApiGame(games);
		})
		.use(verifiedUsersOnly)
		.get('/', async ({ id }) => {
			const projects = await getUserApiGames(id);
			return projects;
		});
