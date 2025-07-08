<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { setApiClient, setLoggedIn, setUserState } from '$lib/state.svelte';
	import RestClient, { getMe, login } from '@minemaker/caller';
	import { Input, Error, ArrowButtonRight } from '@minemaker/ui';
	import { load } from '@tauri-apps/plugin-store';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (password.length == 0) {
			return;
		}
		loading = true;

		try {
			const store = await load('auth.json', { autoSave: true });

			const tokenData = await login(PUBLIC_API_URL, email, password);

			const apiClient = new RestClient(tokenData.token, {
				apiUrl: PUBLIC_API_URL,
				refreshWithCookie: true
			});

			await store.set('refreshToken', tokenData.refreshToken);

			setApiClient(apiClient);

			const me = await getMe(apiClient);
			setUserState(me);

			setLoggedIn(true);

			goto('/');
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	}
</script>

<main class="flex h-screen w-full items-center justify-center p-12">
	<form class="w-[500px] space-y-8" {onsubmit}>
		<img src="/studiologo.png" alt="Minemaker Studio logo" />
		<div class="mb-8 flex flex-col space-y-2">
			<h1 class="text-3xl font-bold">Login</h1>
		</div>
		{#if error !== ''}
			<Error>{error}</Error>
		{/if}
		<Input type="email" placeholder="..." class="w-full" bind:value={email}>Email Address</Input>
		<Input type="password" placeholder="..." class="w-full" bind:value={password}>Password</Input>
		<div class="flex w-full justify-end">
			<ArrowButtonRight {loading} type="submit">Login</ArrowButtonRight>
		</div>
	</form>
</main>
