import type { ElysiaApp } from '$src/app';
import { getUser } from '@minemaker/db';
import verifyAuth from 'lib/utils/auth';

export default (app: ElysiaApp) => app.use(verifyAuth).get('/', async ({ uuid }) => {
	const user = await getUser(uuid);
	return user;
});
