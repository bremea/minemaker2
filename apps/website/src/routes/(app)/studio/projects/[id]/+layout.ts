import { browser } from '$app/environment';
import { getApiClient } from '$lib/state.svelte';
import RestClient, { getProject } from '@minemaker/caller';

export const load = async ({ params, parent }) => {
	const awaitGetProject = async () => {
		if (!browser) return;

		await parent();
		return await getProject(getApiClient() as RestClient, params.id);
	};

	return {
		id: params.id,
		project: await awaitGetProject()
	};
};
