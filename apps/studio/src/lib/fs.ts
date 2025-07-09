import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';

export type LocalProject = { name: string; id: string; src: string };

export const getLocalProjects = async (): Promise<LocalProject[]> => {
	if (!await exists('projects/projects.json', { baseDir: BaseDirectory.AppLocalData })) {
		return [];
	}
	return [];
};