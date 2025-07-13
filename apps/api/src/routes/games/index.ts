import type { ElysiaApp } from '$src/app';
import { blockAuth, blockVerified } from 'lib/utils/auth';
import { getUserApiGames } from 'lib/utils/game';

// get all user projects
export default (app: ElysiaApp) =>
	app.use(blockVerified).get('/', async ({ id }) => {
		const projects = await getUserApiGames(id);
		return projects;
	});
