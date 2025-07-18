import type RestClient from '..';

export async function getUploadLink(
	client: RestClient,
	gameId: string
): Promise<{ url: string; objectId: string }> {
	return await client.request<{ url: string; objectId: string }>(
		'GET',
		`games/${gameId}/builds/upload`
	);
}

export async function submitBuild(
	client: RestClient,
	gameId: string,
	buildObjectId: string
): Promise<{ submitted: boolean }> {
	return await client.request<{ submitted: boolean }>('POST', `games/${gameId}/builds/submit`, {
		body: JSON.stringify({ buildObjectId })
	});
}
