import type { ElysiaApp } from '$src/app';
import { blockGuest } from 'lib/utils/auth';
import { getApiUser } from 'lib/utils/user';

export default (app: ElysiaApp) =>
	app.use(blockGuest).get('/', async ({ id }) => {
		const user = await getApiUser(id);
		return user;
	});
