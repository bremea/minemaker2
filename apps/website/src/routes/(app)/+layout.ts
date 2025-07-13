import { PUBLIC_API_URL } from '$env/static/public';
import { setApiClient, setLoggedIn, setUserState } from '$lib/state.svelte';
import RestClient from '@minemaker/caller';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	setLoggedIn(data.loggedIn);
	if (data.me) setUserState(data.me);

	setApiClient(
		new RestClient('', {
			apiUrl: PUBLIC_API_URL,
			refreshWithCookie: true,
			useCookieAuth: true
		})
	);

	return data;
};
