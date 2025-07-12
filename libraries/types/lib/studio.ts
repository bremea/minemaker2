import type { ApiTag } from './api';

export interface StudioProject {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	created_at: string;
	public: boolean;
	tags: ApiTag[];
}

export interface GameManifestResource {
	id: string;
	objectId: string;
}

export interface GameManifestPlugin extends GameManifestResource {}
export interface GameManifestResourcePack extends GameManifestResource {}
export interface GameManifestSchematic extends GameManifestResource {}

export interface GameManifest {
	id: string;
	maxPlayers: number;
	plugins?: { [key: string]: GameManifestPlugin };
	resourcePacks?: { [key: string]: GameManifestResourcePack };
	schematics?: { [key: string]: GameManifestSchematic };
}
