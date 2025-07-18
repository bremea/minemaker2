import type { ApiGame } from '@minemaker/types';
import type RestClient from '..';

export * from './builds';

export async function createGame(client: RestClient, projectName: string): Promise<ApiGame> {
	return await client.request<ApiGame>('POST', 'games/new', {
		body: JSON.stringify({
			name: projectName
		})
	});
}

export async function getUserGames(client: RestClient): Promise<ApiGame[]> {
	return await client.request<ApiGame[]>('GET', 'games');
}

export async function getMostPopular(client: RestClient): Promise<ApiGame[]> {
	return await client.request<ApiGame[]>('GET', 'games/popular');
}

export async function getGame(client: RestClient, id: string): Promise<ApiGame> {
	return await client.request<ApiGame>('GET', `games/${id}`);
}

export async function deleteGame(client: RestClient, id: string): Promise<void> {
	return await client.request('DELETE', `games/${id}`);
}

export async function updateGame(
	client: RestClient,
	id: string,
	data: { name?: string; description?: string; public?: boolean }
): Promise<ApiGame> {
	return await client.request('PATCH', `games/${id}`, {
		body: JSON.stringify(data)
	});
}
