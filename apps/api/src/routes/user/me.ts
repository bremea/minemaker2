import type { ElysiaApp } from '$src/app';
import { getUserAndPlayerData } from '@minemaker/db';
import { ApiUser } from '@minemaker/types';
import { blockAuth } from 'lib/utils/auth';

export default (app: ElysiaApp) =>
	app.use(blockAuth).get('/', async ({ id }) => {
		const { user, player } = await getUserAndPlayerData(id);

		const accountVerified = player !== undefined;

		const apiUser: ApiUser = {
			id: user.account_id,
			email: user.email,
			verified: accountVerified,
			created: user.created_at,
			lastLogin: user.last_login,
			gems: user.gems
		};

		if (accountVerified) {
			apiUser.minecraftAccount = {
				uuid: player.player_uuid,
				username: player.username,
				created: player.created_at,
				lastLogin: player.last_login
			};
		}

		return apiUser;
	});
