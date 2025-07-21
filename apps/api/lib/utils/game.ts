import { getGame, getGameTags, getUserGames } from '@minemaker/db';
import { ApiGame, DatabaseGame } from '@minemaker/types';

export const getApiGame = async (gameId: string): Promise<ApiGame> => {
	const gameData = await getGame(gameId);
	const tags = await getGameTags(gameId);

	return convertToApiGame(gameData, tags);
};

export const getUserApiGames = async (userId: string): Promise<ApiGame[]> => {
	const userGames = await getUserGames(userId);
	return convertArrayToApiGame(userGames);
};

export const convertArrayToApiGame = (games: DatabaseGame[]): ApiGame[] => {
	const apiGames: ApiGame[] = [];

	for (const gameData of games) {
		apiGames.push(convertToApiGame(gameData));
	}

	return apiGames;
};

export const convertToApiGame = (gameData: DatabaseGame, tags?: string[]): ApiGame => {
	return {
		id: gameData.game_id,
		ownerId: gameData.owner,
		name: gameData.name,
		description: gameData.description,
		created: gameData.created_at,
		liveBuild: gameData.current_build != null ? gameData.current_build : undefined,
		public: gameData.public,
		online: gameData.online,
		tags
	};
};
