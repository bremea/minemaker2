import { getLoggedIn, setApiClient, setLoggedIn, setUserState } from '$lib/state.svelte';
import RestClient, { getMe, tokenRefresh } from '@minemaker/caller';
import type { LayoutLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { isRedirect, redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { load as storeLoad } from '@tauri-apps/plugin-store';

export const load: LayoutLoad = async () => {
	if (getLoggedIn() || !browser) return;

	try {
		const store = await storeLoad('auth.json', { autoSave: true });

		if (!(await store.has('refreshToken'))) {
			redirect(303, '/login');
		}

		const tokenFetch = await tokenRefresh(
			PUBLIC_API_URL,
			(await store.get('refreshToken')) as string
		);
		const apiClient = new RestClient(tokenFetch.token, {
			apiUrl: PUBLIC_API_URL,
			refreshWithCookie: true
		});

		await store.set('refreshToken', tokenFetch.refreshToken);

		setApiClient(apiClient);

		const me = await getMe(apiClient);
		setUserState(me);

		setLoggedIn(true);

		if (!me.verified) {
			redirect(303, '/verify');
		}

		return { apiClient };
	} catch (e) {
		if (isRedirect(e)) {
			redirect(e.status, e.location);
		} else {
			redirect(303, '/login');
		}
	}
};
