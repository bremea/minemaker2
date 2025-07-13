import { exists, BaseDirectory, mkdir, writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import type { GameManifest } from '@minemaker/types';
import { join } from '@tauri-apps/api/path';
import type { LocalProjectListing } from './types';

export const createProjectIndex = async (data: LocalProjectListing[] = []) => {
	await writeTextFile('projects.json', JSON.stringify(data), {
		baseDir: BaseDirectory.AppLocalData
	});
};

export const getManifest = async (path: string): Promise<GameManifest> => {
	return JSON.parse(await readTextFile(path)) as GameManifest;
};

export const getLocalProjectListings = async (): Promise<LocalProjectListing[]> => {
	if (!(await exists('projects.json', { baseDir: BaseDirectory.AppLocalData }))) {
		await createProjectIndex();
		return [];
	}

	const projects = await readTextFile('projects.json', { baseDir: BaseDirectory.AppLocalData });

	return JSON.parse(projects) as LocalProjectListing[];
};

export const updateLocalProjects = async (id: string, newData: Partial<LocalProjectListing>) => {
	const projects = await getLocalProjectListings();

	const existingIndex = projects.findIndex((i) => i.id === id);
	if (existingIndex == -1) {
		projects.push({
			name: newData.name ?? '',
			id,
			path: newData.path ?? '',
			manifestPath: newData.manifestPath ?? '',
			lastEdited: newData.lastEdited ?? new Date().toString()
		});
	} else {
		projects[existingIndex] = { ...projects[existingIndex], ...newData };
	}

	await writeTextFile('projects.json', JSON.stringify(projects), {
		baseDir: BaseDirectory.AppLocalData
	});
};

export const createProject = async (id: string, name: string, path: string) => {
	await mkdir(path);
	await mkdir(await join(path, 'plugins'));
	await mkdir(await join(path, 'packs'));
	await mkdir(await join(path, 'worlds'));

	const manifest: GameManifest = {
		localId: id,
		name,
		maxPlayers: 0
	};

	const manifestPath = await join(path, 'manifest.json');
	await writeTextFile(manifestPath, JSON.stringify(manifest));

	await updateLocalProjects(id, {
		name,
		path,
		manifestPath
	});
};
