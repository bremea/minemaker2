<script lang="ts">
	import LandingHeader from '$lib/components/navigation/landingHeader.svelte';
	import { getApiClient } from '$lib/state.svelte';
	import { getPlaylog } from '@minemaker/caller';
	import type { ApiPlaylog } from '@minemaker/types';
	import { onMount } from 'svelte';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';

	let recentlyPlayed: ApiPlaylog = $state([]);

	onMount(async () => {
		recentlyPlayed = await getPlaylog(getApiClient()!);
	});
</script>

<LandingHeader />

<main class="flex w-full flex-col p-12">
	<section class="space-y-4">
		<h2 class="text-2xl font-bold">Recently Played</h2>
		<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
			{#each recentlyPlayed as playlogEntry}
				<a
					class="group basis-64 rounded-lg p-2 transition-all hover:bg-gray-700 active:scale-95 active:bg-gray-600"
					href={`game/${playlogEntry.game.id}`}
				>
					<img src="https://placehold.co/384x256" alt="icon" class="w-full rounded" />
					<p class="mt-1 text-lg font-bold">${playlogEntry.game.name}</p>
					<p class="mt-2 flex items-center space-x-2 text-xs text-gray-400">
						<FluentCircle20Filled class="size-2.5 text-green-400" /><span
							><span class="text-white">1328</span> players online</span
						>
					</p>
				</a>
			{/each}
		</div>
	</section>
</main>
