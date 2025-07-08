import { getUserAndPlayerData } from '$src/users';
import { ApiUser } from '@minemaker/types';

export const getApiUser = async (id: string): Promise<ApiUser> => {
	const { user, player } = await getUserAndPlayerData(id);

	let apiUser: ApiUser = {
		id: user.account_id,
		email: user.email,
		verified: false,
		created: user.created_at,
		lastLogin: user.last_login,
		gems: user.gems,
		guest: false
	};

	if (player !== undefined) {
		apiUser = {
			...apiUser,
			verified: true,
			minecraftAccount: {
				uuid: player.player_uuid,
				username: player.username,
				created: player.created_at,
				lastLogin: player.last_login
			}
		};
	}

	return apiUser;
};
