import { getUserAndPlayerData, getPlayerByUsername, getUser } from '@minemaker/db';
import { ApiProfile, ApiUser } from '@minemaker/types';
import { getApiGame, getUserApiGames } from './game';
import { getPlayerPresence } from '@minemaker/realtime';

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
			player: {
				uuid: player.player_uuid,
				username: player.username,
				created: player.created_at,
				lastLogin: player.last_login
			}
		};
	}

	return apiUser;
};

export const getApiProfile = async (username: string): Promise<ApiProfile> => {
	const player = await getPlayerByUsername(username);
	const presence = await getPlayerPresence(player.player_uuid);

	let profile: ApiProfile = {
		playerData: {
			uuid: player.player_uuid,
			username: player.username,
			created: player.created_at,
			lastLogin: player.last_login
		}
	};

	if (player.account_id != null) {
		const user = await getUser(player.account_id);
		const games = (await getUserApiGames(player.account_id)).filter((e) => e.public == true);

		profile.userData = {
			id: user.account_id,
			verified: true,
			created: user.created_at,
			lastLogin: user.last_login
		};

		if (games && games.length > 0) {
			profile.creations = games;
		}
	}

	if (presence != null) {
		profile.presence = {
			game: await getApiGame(presence.gameId),
			server: {
				id: presence.serverId,
				region: presence.region,
				gameId: presence.gameId,
				online: presence.playersOnline,
				maxPlayers: presence.maxPlayers
			}
		};
	}

	return profile;
};
