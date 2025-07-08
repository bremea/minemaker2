import type { ApiGame } from '@minemaker/types';
import type RestClient from '..';

export async function createProject(client: RestClient, projectName: string): Promise<ApiGame> {
	return await client.request<ApiGame>('POST', 'projects/new', {
		body: JSON.stringify({
			name: projectName
		})
	});
}

export async function getUserProjects(client: RestClient): Promise<ApiGame[]> {
	return await client.request<ApiGame[]>('GET', 'projects');
}

export async function getProject(client: RestClient, id: string): Promise<ApiGame> {
	return await client.request<ApiGame>('GET', `projects/${id}`);
}

export async function deleteProject(client: RestClient, id: string): Promise<void> {
	return await client.request('DELETE', `projects/${id}`);
}

export async function updateProject(
	client: RestClient,
	id: string,
	data: { name?: string; description?: string; public?: boolean }
): Promise<ApiGame> {
	return await client.request('PATCH', `projects/${id}`, {
		body: JSON.stringify(data)
	});
}
