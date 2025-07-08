import { PUBLIC_API_URL } from '$env/static/public';
import {
	getApiClient,
	getLoggedIn,
	setApiClient,
	setLoggedIn,
	setUserState
} from '$lib/state.svelte';
import RestClient, { getMe, staticTokenRefresh } from '@minemaker/caller';
import type { ClientInit, Handle, HandleFetch } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	try {
		const tokenFetch = await staticTokenRefresh(PUBLIC_API_URL);
		const apiClient = new RestClient(tokenFetch.token, {
			apiUrl: PUBLIC_API_URL,
			refreshWithCookie: true
		});

		setApiClient(apiClient);

		const me = await getMe(apiClient);
		setUserState(me);

		setLoggedIn(true);
	} catch (e) {
		setLoggedIn(false);
	}
};