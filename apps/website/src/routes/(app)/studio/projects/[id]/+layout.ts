import { browser } from '$app/environment';
import { getApiClient } from '$lib/state.svelte';
import RestClient, { getGame } from '@minemaker/caller';

export const load = async ({ params, parent }) => {
	const awaitGetProject = async () => {
		if (!browser) return;

		await parent();
		return await getGame(getApiClient() as RestClient, params.id);
	};

	return {
		id: params.id,
		project: await awaitGetProject()
	};
};
