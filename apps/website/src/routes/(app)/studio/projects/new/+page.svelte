<script lang="ts">
	import { goto } from '$app/navigation';
	import { getApiClient } from '$lib/state.svelte';
	import { createProject } from '@minemaker/caller';
	import { ArrowLinkLeft, Button, Input } from '@minemaker/ui';

	let name = $state('');
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (name.length == 0) {
			return;
		}
		loading = true;

		const newProject = await createProject(getApiClient()!, name);

		goto(`/studio/projects/${newProject.id}`);
	}
</script>

<main class="flex w-full justify-center p-12">
	<form class="w-[500px] space-y-8" {onsubmit}>
		<div class="mb-8 flex flex-col space-y-2">
			<ArrowLinkLeft size="sm" color="gray" href="/projects">Back</ArrowLinkLeft>
			<h1 class="text-3xl font-bold">New project</h1>
		</div>
		<Input type="text" placeholder="My project" class="w-full" bind:value={name}>
			Project name
		</Input>
		<div class="flex w-full justify-end">
			<Button {loading} type="submit">Create</Button>
		</div>
	</form>
</main>
