<script lang="ts">
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';
	import FluentAdd20Filled from '~icons/fluent/add-20-filled';
	import { ArrowLinkRight, Button, LinkButton } from '@minemaker/ui';
	import { getLocalProjects } from '$lib/state.svelte';

	let localProjects = $derived(getLocalProjects());
</script>

<main class="flex min-h-screen w-full flex-col items-center justify-center space-y-8 py-8">
	<img src="/studiologo.png" alt="Minemaker studio logo" class="h-24" />
	<div class="flex w-full justify-center space-x-8">
		<div class="w-[500px] space-y-2">
			<div class="mb-4 flex justify-between border-b-[2px] border-b-gray-700 py-2">
				<h2 class="text-xl font-bold">My Projects</h2>

				<LinkButton href="/new" size="sm" color="gray">
					<FluentAdd20Filled /><span>New Project</span>
				</LinkButton>
			</div>
			<div class="max-h-[300px] space-y-2 overflow-y-auto">
				{#each Object.values(localProjects) as project, i}
					<a
						href={`/${project.id}`}
						class="group flex w-full items-center space-x-2 rounded p-2 text-left transition-all hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:outline-0 focus:outline-offset-2 active:scale-95"
					>
						<img src="https://placehold.co/384x256" alt="icon" class="h-12" />
						<div class="w-full">
							<p>{project.name}</p>
							<p class="text-xs italic opacity-50">
								{project.path}
							</p>
						</div>
						<FluentOpen20Filled class="group-hover:text-mm-blue mr-2 size-10 text-gray-400" />
					</a>
				{/each}
			</div>
		</div>
		<div class="w-[300px]">
			<div class="flex justify-between border-b-[2px] border-b-gray-700 py-2">
				<h2 class="text-xl font-bold">What's New</h2>
			</div>
			<div class="my-4 space-y-2 rounded-lg bg-gray-700 p-4">
				<p class="text-xs font-bold">
					Patch Notes - v0.1.0<br /><span class="text-[0.6rem] font-light opacity-50"
						>01/01/1969</span
					>
				</p>
				<p class="text-xs">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
					sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
					est laborum...
				</p>
			</div>
			<ArrowLinkRight size="sm" class="w-full">Read Article</ArrowLinkRight>
		</div>
	</div>
</main>
