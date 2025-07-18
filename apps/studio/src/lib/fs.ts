import {
	exists,
	BaseDirectory,
	mkdir,
	writeTextFile,
	readTextFile,
	create,
	readDir,
	readFile
} from '@tauri-apps/plugin-fs';
import type { GameManifest } from '@minemaker/types';
import { appLocalDataDir, join } from '@tauri-apps/api/path';
import type { LocalProjectListing } from './types';
import JSZip from 'jszip';
import { path } from '@tauri-apps/api';

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
		version: 1,
		localId: id,
		name,
		properties: { maxPlayers: 10 }
	};

	const manifestPath = await join(path, 'manifest.json');
	await writeTextFile(manifestPath, JSON.stringify(manifest));

	await updateLocalProjects(id, {
		name,
		path,
		manifestPath
	});
};

export async function createBuildArchive(id: number, src: string): Promise<string> {
	if (
		!(await exists('archives', {
			baseDir: BaseDirectory.AppLocalData
		}))
	) {
		await mkdir('archives', { baseDir: BaseDirectory.AppLocalData });
	}

	const file = await create(`archives/${id}`, { baseDir: BaseDirectory.AppLocalData });

	const zip = new JSZip();
	await zipDir(zip, src);
	const zipBlob = await zip.generateAsync({ type: 'uint8array' });
	await file.write(zipBlob);
	await file.close();

	return await join(await appLocalDataDir(), `archives/${id}`);
}

async function zipDir(zip: JSZip, directory: string, zipFolder: JSZip | null = null) {
	const entries = await readDir(directory);

	for (const entry of entries) {
		if (entry.isDirectory) {
			const folder = (zipFolder ?? zip).folder(entry.name);
			await zipDir(zip, await join(directory, entry.name), folder ?? zip);
		} else {
			const fileData = await readFile(await join(directory, entry.name));
			(zipFolder ?? zip).file(entry.name, fileData);
		}
	}
}
