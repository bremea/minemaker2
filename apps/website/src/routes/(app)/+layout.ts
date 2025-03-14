import { getLoggedIn, setApiClient, setLoggedIn, setUserState } from '$lib/state.svelte';
import RestClient, { getMe, staticTokenRefresh } from '@minemaker/caller';
import type { LayoutLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: LayoutLoad = async () => {
	if (getLoggedIn()) return;

	try {
		const tokenFetch = await staticTokenRefresh(PUBLIC_API_URL);
		console.log(tokenFetch)


		const apiClient = new RestClient(tokenFetch.token, {
			apiUrl: PUBLIC_API_URL,
			refreshWithCookie: true
		});

		setApiClient(apiClient);

		const me = await getMe(apiClient);
		setUserState(me);

		setLoggedIn(true);
	} catch (e) {
		return;
	}
};
