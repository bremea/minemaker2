import { pool } from '$src/connection';
import { DatabaseProject } from '$src/types/projectTypes';
import { type Project } from '@minemaker/caller';
import { RowDataPacket } from 'mysql2';

/** Creates new project */
export async function createProject(id: string, ownerUUID: string, name: string): Promise<void> {
	await pool.query('INSERT INTO games (game_id, owner, name) VALUES (?, ?, ?);', [
		id,
		ownerUUID,
		name
	]);
}

/** Deletes project */
export async function deleteProject(id: string): Promise<void> {
	await pool.query('DELETE FROM games WHERE game_id = ?;', [id]);
}

/** Modifies a project */
export async function updateProject(
	id: string,
	name: string,
	description: string,
	isPublic: boolean
): Promise<void> {
	await pool.query('UPDATE games SET name = ?, description = ?, public = ? WHERE game_id = ?;', [
		name,
		description,
		isPublic,
		id
	]);
}

/** Gets user's project by UUID */
export async function getUserProjects(uuid: string): Promise<Project[]> {
	const [projects] = await pool.query<DatabaseProject[]>('SELECT * FROM games WHERE owner = ?;', [
		uuid
	]);

	const returnArray = [];

	for (const project of projects) {
		returnArray.push({
			id: project.game_id,
			name: project.name,
			owner: project.owner,
			description: project.description,
			createdAt: new Date(project.created_at),
			public: project.public
		});
	}

	return returnArray;
}

/** Gets project by ID */
export async function getProject(id: string): Promise<Project> {
	const [projectData] = await pool.query<DatabaseProject[]>(
		'SELECT * FROM games WHERE game_id = ?;',
		[id]
	);

	if (projectData.length == 0) {
		throw `No project exists with id ${id}`;
	}

	return {
		id: projectData[0].game_id,
		name: projectData[0].name,
		owner: projectData[0].owner,
		description: projectData[0].description,
		createdAt: new Date(projectData[0].created_at),
		public: projectData[0].public
	};
}

/** Gets project tags by ID */
export async function getProjectTags(id: string): Promise<string[]> {
	const [tags] = await pool.query<RowDataPacket[]>(
		`SELECT tags.name AS tags
		FROM tags
		JOIN game_tags ON tags.tag_id = game_tags.tag_id
		WHERE game_tags.game_id = ?;`,
		[id]
	);

	return tags as unknown as string[];
}
