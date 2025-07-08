import { getGame, getGameTags } from '$src/studio';
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
