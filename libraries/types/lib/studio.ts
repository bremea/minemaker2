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
