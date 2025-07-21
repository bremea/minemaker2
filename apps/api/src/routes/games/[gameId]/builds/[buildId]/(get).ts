import type { ElysiaApp } from '$src/app';
import { getBuild, getGame, isGameOwner } from '@minemaker/db';
import { ApiBuild, InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { verifiedUsersOnly } from 'lib/utils/auth';
import { convertToApiBuild } from 'lib/utils/builds';

export default (app: ElysiaApp) =>
	app.use(verifiedUsersOnly).get(
		'/',
		async ({ id, authenticated, params }) => {
			if (!authenticated || !(await isGameOwner(params.gameId, id))) {
				throw new InternalApiError(400, 'Unauthorized');
			}

			const build = await getBuild(params.buildId);

			return convertToApiBuild(build);
		},
		{
			params: t.Object({
				gameId: t.String(),
				buildId: t.String()
			})
		}
	);
