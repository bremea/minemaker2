import type RestClient from '@minemaker/caller';
import type { ApiVerifiedUser } from '@minemaker/types';
import type { LocalProject } from './types';
import { getLocalProjectListings, getManifest } from './fs';

let loggedIn: boolean = $state(false);

export function getLoggedIn() {
	return loggedIn;
}

export function setLoggedIn(newValue: boolean) {
	loggedIn = newValue;
}

let userState: ApiVerifiedUser | undefined = $state();

export function getUserState(): ApiVerifiedUser | undefined {
	return userState;
}

export function setUserState(newValue: ApiVerifiedUser) {
	userState = newValue;
}

let apiClient: RestClient | undefined = $state();

export function getApiClient() {
	return apiClient;
}

export function setApiClient(newValue: RestClient) {
	apiClient = newValue;
}

let localProjects: { [key: string]: LocalProject } = $state({});

export function getLocalProjects() {
	return localProjects;
}

export function updateLocalProject(id: string, newValue: Partial<LocalProject>) {
	localProjects[id] = { ...localProjects[id], ...newValue };
}

export function setLocalProjects(newValue: { [key: string]: LocalProject }) {
	localProjects = newValue;
}

export async function updateLocalProjectsState() {
	const localProjectListings = await getLocalProjectListings();
	const localProjects = getLocalProjects();

	for (const project of localProjectListings) {
		if (!localProjects[project.id] || !localProjects[project.id].saved)
			localProjects[project.id] = {
				name: project.name,
				id: project.id,
				path: project.path,
				manifest: await getManifest(project.manifestPath),
				lastEdited: new Date(project.lastEdited),
				saved: true
			};
	}

	setLocalProjects(localProjects);
}
