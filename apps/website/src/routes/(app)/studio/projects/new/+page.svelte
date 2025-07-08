<script lang="ts">
	import { goto } from '$app/navigation';
	import { getApiClient } from '$lib/state.svelte';
	import { createGame } from '@minemaker/caller';
	import { ArrowLinkLeft, Button, Error, Input } from '@minemaker/ui';

	let name = $state('');
	let error = $state('');
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (name.length == 0) {
			error = "Invalid name"
			loading = false;
			return;
		}
		loading = true;

		try {
			const newProject = await createGame(getApiClient()!, name);
			goto(`/studio/projects/${newProject.id}`);
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

<main class="flex w-full justify-center p-12">
	<form class="w-[500px] space-y-8" {onsubmit}>
		<div class="mb-8 flex flex-col space-y-2">
			<ArrowLinkLeft size="sm" color="gray" href="/projects">Back</ArrowLinkLeft>
			<h1 class="text-3xl font-bold">New project</h1>
		</div>
		{#if error != ''}
			<Error>{error}</Error>
		{/if}
		<Input type="text" placeholder="My project" class="w-full" bind:value={name}>
			Project name
		</Input>
		<div class="flex w-full justify-end">
			<Button {loading} type="submit">Create</Button>
		</div>
	</form>
</main>
