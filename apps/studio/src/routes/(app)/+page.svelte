<script lang="ts">
	import { getUserState } from '$lib/state.svelte';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import FluentArrowRight20Filled from '~icons/fluent/arrow-right-20-filled';
	import FluentCloudArrowDown20Filled from '~icons/fluent/cloud-arrow-down-20-filled';
	import { ArrowLinkRight } from '@minemaker/ui';

	let userState = getUserState();
</script>

<header class="flex h-10 w-full bg-gray-700">
	<div class="w-full overflow-scroll">
		<div class="flex h-10 w-max">
			<div
				class="group text-mm-blue relative flex items-center bg-gray-600 px-4 shadow-[inset_0_-2px_0_0_var(--color-mm-blue)]"
			>
				<FluentHome20Filled class="size-6 h-6 w-6 text-white" />
			</div>
			<div class="group relative flex items-center space-x-4 px-4 hover:bg-gray-600/50">
				<FluentHome20Filled class="size-6 h-6 w-6 text-white" />
			</div>
			<div
				class="group text-mm-blue relative flex items-center bg-gray-600 px-4 pr-8 shadow-[inset_0_-2px_0_0_var(--color-mm-blue)]"
			>
				<p>tab 1</p>
				<div class="absolute right-1 rounded-full p-1 hover:bg-gray-500">
					<FluentDismiss20Filled class="size-4 h-4 w-4 text-white" />
				</div>
			</div>
			<div class="group relative flex items-center space-x-4 px-4 hover:bg-gray-600/50">
				<p>tab 1</p>
				<div class="absolute right-1 rounded-full p-1 hover:bg-gray-500">
					<FluentDismiss20Filled class="size-4 h-4 w-4 text-white" />
				</div>
			</div>
		</div>
	</div>
	<div class="flex h-full w-10 items-center justify-center">
		<img
			src={userState!.verified
				? `https://mc-heads.net/avatar/${userState!.minecraftAccount.uuid.replace(/-/g, '')}`
				: 'https://mc-heads.net/avatar/MHF_Steve'}
			alt="Player head"
			title={userState!.verified ? userState!.minecraftAccount.username : userState!.email}
			class="h-8"
		/>
	</div>
</header>

<main class="flex w-full flex-col items-center space-y-8 py-8">
	<img src="/studiologo.png" alt="Minemaker studio logo" class="h-24" />
	<div class="flex w-full justify-center space-x-8">
		<div class="w-[500px]">
			<h2 class="mb-4 text-xl font-bold">Your Projects</h2>
			<div class="group flex w-full items-center space-x-2 p-2 hover:bg-gray-700 rounded">
				<img src="https://placehold.co/384x256" alt="icon" class="h-12" />
				<div class="w-full">
					<p>My Project</p>
					<p class="text-xs italic opacity-50">/home/jade/minemaker/project</p>
				</div>
				<FluentArrowRight20Filled class="group-hover:text-mm-blue mr-2 size-10 text-gray-400" />
			</div>
			<div class="group flex w-full items-center space-x-2 p-2 hover:bg-gray-700 rounded">
				<img src="https://placehold.co/384x256" alt="icon" class="h-12" />
				<div class="w-full">
					<p>My Project 2</p>
					<p class="text-xs italic opacity-50">Not downloaded</p>
				</div>
				<FluentCloudArrowDown20Filled class="group-hover:text-mm-blue mr-2 size-10 text-gray-400" />
			</div>
		</div>
		<div class="w-[300px]">
			<h2 class="text-xl font-bold">What's New</h2>
			<div class="space-y-2 my-4 bg-gray-700 p-4 rounded-lg">
				<p class="text-xs font-bold">Patch Notes - v0.1.0<br /><span class="opacity-50 font-light text-[0.6rem]">01/01/1969</span></p>
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
