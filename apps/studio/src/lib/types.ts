import type { GameManifest } from '@minemaker/types';

export interface LocalProjectListing {
	name: string;
	id: string;
	path: string;
	manifestPath: string;
	lastEdited: string;
}

export interface LocalProject {
	name: string;
	id: string;
	path: string;
	manifest: GameManifest;
	lastEdited: Date;
	saved: boolean;
}
