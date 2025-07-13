import { getGame, getGameTags, getUserGames } from '@minemaker/db';
import { ApiGame } from '@minemaker/types';

export const getApiGame = async (gameId: string): Promise<ApiGame> => {
	const gameData = await getGame(gameId);
	const tags = await getGameTags(gameId);

	const game: ApiGame = {
		id: gameData.game_id,
		ownerId: gameData.owner,
		name: gameData.name,
		description: gameData.description,
		created: gameData.created_at,
		public: gameData.public,
		tags
	};

	return game;
};

export const getUserApiGames = async (userId: string): Promise<ApiGame[]> => {
	const userGames = await getUserGames(userId);
	const games: ApiGame[] = [];

	for (const gameData of userGames) {
		const tags = await getGameTags(gameData.game_id);
		games.push({
			id: gameData.game_id,
			ownerId: gameData.owner,
			name: gameData.name,
			description: gameData.description,
			created: gameData.created_at,
			public: gameData.public,
			tags
		});
	}

	return games;
};
