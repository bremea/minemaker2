import type { ElysiaApp } from '$src/app';
import { getApiUser } from '@minemaker/db';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ id }) => {
		const user = await getApiUser(id);
		return user;
	});
