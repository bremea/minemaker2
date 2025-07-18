import {
	getApiClient,
	getLocalProjects,
	getLoggedIn,
	getUserState,
	setApiClient,
	setLoggedIn,
	setUserState,
	updateLocalProjectsState
} from '$lib/state.svelte';
import RestClient, { getMe, tokenRefresh } from '@minemaker/caller';
import type { LayoutLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { load as storeLoad } from '@tauri-apps/plugin-store';
import type { ApiVerifiedUser } from '@minemaker/types';
import { goto } from '$app/navigation';

export const load: LayoutLoad = async () => {
	if (getLoggedIn()) {
		return { apiClient: getApiClient(), me: getUserState(), localProjects: getLocalProjects() };
	}

	const initApp = async () => {
		const store = await storeLoad('auth.json', { autoSave: true });

		if (!(await store.has('refreshToken'))) {
			return goto('/login');
		}

		try {
			const tokenFetch = await tokenRefresh(
				PUBLIC_API_URL,
				(await store.get('refreshToken')) as string
			);
			const apiClient = new RestClient(tokenFetch.token, {
				apiUrl: PUBLIC_API_URL,
				refreshWithCookie: true
			});

			await store.set('refreshToken', tokenFetch.refreshToken);

			try {
				var me = await getMe(apiClient);
			} catch (e) {
				return goto('/verify');
			}

			if (me.guest || !me.verified) {
				return goto('/verify');
			}

			setApiClient(apiClient);

			setUserState(me as ApiVerifiedUser);

			await updateLocalProjectsState();
			setLoggedIn(true);

			return { apiClient: getApiClient(), me: getUserState(), localProjects: getLocalProjects() };
		} catch (e) {
			goto('/login');
		}
	};

	return { state: initApp() };
};
