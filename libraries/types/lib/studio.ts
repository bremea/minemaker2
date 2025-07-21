import type { ApiGameProperties, ApiTag } from './api';

export interface StudioProject {
	id: string;
	ownerId: string;
	name: string;
	liveBuild?: string;
	description: string;
	created_at: string;
	public: boolean;
	tags: ApiTag[];
}

export interface GameManifestProperties {
	maxPlayers: number;
}

export interface GameManifestResource {
	id: string;
	path: string;
}

export interface GameManifestPlugin extends GameManifestResource {}
export interface GameManifestResourcePack extends GameManifestResource {}
export interface GameManifestWorld extends GameManifestResource {}

export interface GameManifest {
	version: number;
	localId: string;
	name: string;
	properties: ApiGameProperties;
	plugins?: Record<string, GameManifestPlugin>;
	resourcePacks?: Record<string, GameManifestResourcePack>;
	worlds?: Record<string, GameManifestWorld>;
}
