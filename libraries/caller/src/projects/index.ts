import type RestClient from '..';
import type { Project } from '../types/project';

export async function createProject(client: RestClient, projectName: string): Promise<Project> {
	return await client.request<Project>('POST', 'projects/new', {
		body: JSON.stringify({
			name: projectName
		})
	});
}

export async function getUserProjects(client: RestClient): Promise<Project[]> {
	return await client.request<Project[]>('GET', 'projects');
}

export async function getProject(client: RestClient, id: string): Promise<Project> {
	return await client.request<Project>('GET', `projects/${id}`);
}

export async function deleteProject(client: RestClient, id: string): Promise<void> {
	return await client.request('DELETE', `projects/${id}`);
}

export async function updateProject(
	client: RestClient,
	id: string,
	data: { name?: string; description?: string; public?: boolean }
): Promise<void> {
	return await client.request('PATCH', `projects/${id}`, {
		body: JSON.stringify(data)
	});
}
