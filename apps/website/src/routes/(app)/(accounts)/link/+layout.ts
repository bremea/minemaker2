import { getLoggedIn, getUserState } from '$lib/state.svelte';
import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load: LayoutLoad = async () => {
	if (!browser) return;

	if (!getLoggedIn()) {
		redirect(303, '/login');
	} else {
		const me = getUserState();
		if (!me) {
			redirect(303, '/login');
		}

		if (!me.guest && me.verified) {
			redirect(303, '/');
		}
	}

	return;
};
