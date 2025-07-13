import type { ElysiaApp } from '$src/app';
import { getLinkRequest, deleteLinkRequest, linkPlayer } from '@minemaker/db';
import { InternalApiError } from '@minemaker/types';
import { t } from 'elysia';
import { blockAuth } from 'lib/utils/auth';
import { getApiUser } from 'lib/utils/user';

export default (app: ElysiaApp) =>
	app.use(blockAuth).post(
		'/',
		async ({ id, body }) => {
			const linkRequest = await getLinkRequest(body.code);

			if (new Date() > new Date(linkRequest.expires)) {
				await deleteLinkRequest(body.code);
				throw new InternalApiError(404, `No link request found with code ${body.code}`);
			}

			await linkPlayer(linkRequest.account_id, linkRequest.player_uuid);
			const player = await getApiUser(linkRequest.account_id);

			return player;
		},
		{ body: t.Object({ code: t.String() }) }
	);
