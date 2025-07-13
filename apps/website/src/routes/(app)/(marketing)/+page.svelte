<script lang="ts">
	import LandingHeader from '$lib/components/navigation/landingHeader.svelte';
	import { getApiClient } from '$lib/state.svelte';
	import { getMostPopular, getPlaylog } from '@minemaker/caller';
	import type { ApiGame, ApiPlaylog } from '@minemaker/types';
	import { GameTile } from '@minemaker/ui';
	import { onMount } from 'svelte';

	let apiClient = $derived(getApiClient());

	let { data } = $props();
</script>

<LandingHeader />

<main class="flex w-full flex-col space-y-12 p-12">
	{#if data.recentlyPlayed}
		<section class="space-y-4">
			<h2 class="text-2xl font-bold">Recently Played</h2>
			<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
				{#each data.recentlyPlayed as playlogEntry}
					<GameTile game={playlogEntry.game} />
				{/each}
			</div>
		</section>
	{/if}
	{#if data.mostPopular}
		<section class="space-y-4">
			<h2 class="text-2xl font-bold">Popular Now</h2>
			<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
				{#each data.mostPopular as game}
					<GameTile {game} />
				{/each}
			</div>
		</section>
	{/if}
</main>
