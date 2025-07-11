import type { ElysiaApp } from '$src/app';
import { getApiUser } from '@minemaker/db';
import { blockGuest } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockGuest).get('/', async ({ id }) => {
		const user = await getApiUser(id);
		return user;
	});
