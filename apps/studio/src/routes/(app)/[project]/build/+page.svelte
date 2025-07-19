<script lang="ts">
	import { createBuildArchive } from '$lib/fs';
	import { getApiClient } from '$lib/state.svelte.js';
	import { getUploadLink } from '@minemaker/caller';
	import { Button, Input, SelectFilter } from '@minemaker/ui';
	import { upload } from '@tauri-apps/plugin-upload';

	let gameId = $state('');
	let error = $state('');
	let loading = $state(false);
	const { data } = $props();
	let project = $derived(data.project);
	let apiClient = $derived(getApiClient());

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!apiClient) return;

		if (gameId.length == 0) {
			error = 'Invalid game ID';
			loading = false;
			return;
		}
		loading = true;

		try {
			const archive = await createBuildArchive(0, project.path);
			const uploadLink = await getUploadLink(apiClient, gameId);

			console.log(uploadLink);
			const headers = new Map();
			headers.set('Content-Type', '')

			await upload(uploadLink.url, archive, ({ progress, total }) =>
				console.log(`Uploaded ${progress} of ${total} bytes`),
			);
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

select game - set description - zip archive - get upload link - upload archive - send build submit

<form {onsubmit} class="space-y-4">
	<Input type="text" bind:value={gameId}>Game ID</Input>
	<Button>Submit</Button>
</form>
