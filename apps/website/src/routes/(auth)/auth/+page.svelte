<script lang="ts">
	import RestClient, { getMe } from '@minemaker/caller';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { setApiClient, setUserState } from '$lib/state.svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let { data }: PageProps = $props();

	onMount(async () => {
		const apiClient = new RestClient(data.token, {apiUrl: PUBLIC_API_URL, refreshWithCookie: true});

		setApiClient(apiClient);

		const me = await getMe(apiClient);
		setUserState(me);

		goto('/');
	});
</script>

Loading...