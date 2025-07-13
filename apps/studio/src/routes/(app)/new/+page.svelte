<script lang="ts">
	import { FileSelect, Button, Error, Input } from '@minemaker/ui';
	import { open } from '@tauri-apps/plugin-dialog';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as pathUtil from '@tauri-apps/api/path';
	import { createProject } from '$lib/fs';
	import { updateLocalProjectsState } from '$lib/state.svelte';

	let name = $state('');
	let id = $state('');
	let path = $state('');
	let projectDir = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		id = name
			.replace(/[^a-zA-Z0-9 -_]/g, '')
			.trim()
			.replace(/\s+/g, '-');

		pathUtil.join(path, id).then((newPath) => (projectDir = newPath));
	});

	onMount(async () => {
		try {
			path = await pathUtil.documentDir();
		} catch (e) {
			path = await pathUtil.homeDir();
		}
	});

	const selectDirectory = async (event: MouseEvent) => {
		event.preventDefault();
		const file = await open({
			directory: true
		});

		if (file) {
			path = file;
		}

		return false;
	};

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (name.length == 0) {
			error = 'Invalid name';
			loading = false;
			return;
		}
		loading = true;

		try {
			await createProject(id, name, projectDir);
			await updateLocalProjectsState();
			goto(`/${id}`);
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

<svelte:head>
	<title>New Project</title>
</svelte:head>

<main class="flex w-full justify-center p-12">
	<form class="w-[500px] space-y-8" {onsubmit}>
		<div class="mb-8 flex flex-col space-y-2">
			<h1 class="text-3xl font-bold">New project</h1>
		</div>
		{#if error != ''}
			<Error componentSize="sm">{error}</Error>
		{/if}
		<Input type="text" placeholder="My project" class="w-full" bind:value={name}>
			Project name
		</Input>
		<div>
			<FileSelect
				placeholder="My project"
				componentSize="md"
				class="w-full"
				onselectclick={selectDirectory}
				value={path}>Location</FileSelect
			>
			<p class="mt-px ml-4 text-xs wrap-anywhere opacity-50">
				Your project will be created in {projectDir}
			</p>
		</div>
		<div class="flex w-full justify-end">
			<Button {loading} type="submit">Create</Button>
		</div>
	</form>
</main>
