import type { ElysiaApp } from '$src/app';
import { getUser } from '@minemaker/db';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ uuid }) => {
		const user = await getUser(uuid);
		return user;
	});
