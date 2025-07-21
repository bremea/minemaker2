import type { ApiBuild } from '@minemaker/types';
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

export async function getBuilds(client: RestClient, gameId: string): Promise<ApiBuild[]> {
	return await client.request<ApiBuild[]>('GET', `games/${gameId}/builds`);
}

export async function getBuild(
	client: RestClient,
	gameId: string,
	buildId: string
): Promise<ApiBuild> {
	return await client.request<ApiBuild>('GET', `games/${gameId}/builds/${buildId}`);
}

export async function getBuildLogUrl(
	client: RestClient,
	gameId: string,
	buildId: string
): Promise<string> {
	return await client.request<string>('GET', `games/${gameId}/builds/${buildId}/log?noRedirect=true`);
}

export async function getBuildLog(
	client: RestClient,
	gameId: string,
	buildId: string
): Promise<string> {
	const url = await getBuildLogUrl(client, gameId, buildId);
	const blob = await client.requestResource('GET', url);
	return await blob.text();
}
