import type { LayoutLoad } from '../$types';
import { getLocalProjects, setLocalProjects } from '$lib/state.svelte';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export const load: LayoutLoad = ({ params }) => {
	const projectData = getLocalProjects();

	if (projectData[params.project!] == undefined) {
		goto('/');
	}

	const save = async () => {
		projectData[params.project!].saved = true;

		setLocalProjects(projectData);
	};

	return { project: projectData[params.project!], save };
};
