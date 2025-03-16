<script lang="ts">
	import { Button, Link } from '@minemaker/ui';
	import UilWindows from '~icons/uil/windows';
	import FluentAdd12Filled from '~icons/fluent/add-12-filled';
	import { onMount } from 'svelte';
	import { getUserProjects, type Project } from '@minemaker/caller';
	import { getApiClient } from '$lib/state.svelte';

	let projects: Project[] = $state([]);

	onMount(async () => {
		projects = await getUserProjects(getApiClient()!);
	});
</script>

<main class="space-y-8 p-12">
	<section
		class="flex w-full flex-col items-center justify-center space-y-8 rounded-2xl bg-gray-700 px-12 py-4"
	>
		<img src="/studiologo.png" alt="Minemaker Studio Logo" class="h-20" />
		<div class="flex flex-col items-center space-y-2">
			<p class="text-center">
				Download the free Minemaker Studio app to build and test your projects.
			</p>
			<Button color="purple"><UilWindows /> <span>Download</span></Button>
			<Link class="text-xs !text-gray-400 hover:text-gray-300!">Other downloads</Link>
		</div>
	</section>

	<section class="space-y-4 pt-8">
		<h1 class="px-4 text-3xl font-bold">Your projects</h1>
		<div
			class="grid h-max w-full auto-cols-fr grid-cols-1 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6"
		>
			<a
				class="group m-4 flex w-[256px] cursor-pointer flex-col items-center justify-center text-center shadow-none"
				href="/studio/projects/new"
			>
				<div
					class="group-hover:outline-mineblue outline-mm-blue flex h-[171px] w-[256px] items-center justify-center bg-gray-700 outline-0 outline-offset-2 transition-all duration-50 group-hover:rounded group-hover:outline-2 active:scale-95"
				>
					<FluentAdd12Filled class="h-12 w-12 text-gray-500" />
				</div>
				<p class="mt-1">New Project</p>
			</a>
			{#each projects as project}
				<a
					class="group m-4 flex w-[256px] cursor-pointer flex-col items-center justify-center text-center shadow-none"
					href={`/studio/projects/${project.id}`}
				>
					<img
						src="https://placehold.co/384x256"
						class="group-hover:outline-mineblue outline-mm-blue flex h-[171px] w-[256px] items-center justify-center bg-gray-700 outline-0 outline-offset-2 transition-all duration-50 group-hover:rounded group-hover:outline-2 active:scale-95"
						alt="Project icon"
					/>
					<p class="mt-1">{project.name}</p>
				</a>
			{/each}
		</div>
	</section>
</main>
