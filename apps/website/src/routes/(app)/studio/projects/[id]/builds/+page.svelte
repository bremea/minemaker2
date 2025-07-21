<script lang="ts">
	import { getApiClient } from '$lib/state.svelte.js';
	import RestClient, { getBuilds } from '@minemaker/caller';
	import type { ApiBuild } from '@minemaker/types';
	import { Button, CopyCode, Link, Loader } from '@minemaker/ui';
	import { onMount } from 'svelte';
	import FluentSpinnerIos20Filled from '~icons/fluent/spinner-ios-20-filled';
	import FluentCheckmarkCircle12Filled from '~icons/fluent/checkmark-circle-12-filled';
	import FluentChevronRight20Filled from '~icons/fluent/chevron-right-20-filled';
	import FluentErrorCircle12Filled from '~icons/fluent/error-circle-12-filled';
	import FluentArrowSync20Filled from '~icons/fluent/arrow-sync-20-filled';
	import { getRelativeTime } from '$lib/utils.js';
	let { data } = $props();
	let loading = $state(true);
	let apiClient = $derived(getApiClient());
	let builds: ApiBuild[] = $state([]);

	const fetchBuilds = async (client: RestClient) => {
		loading = true;
		builds = await getBuilds(client, data.id);
		loading = false;
	};

	onMount(() => {
		if (apiClient != undefined) {
			fetchBuilds(apiClient);
		}
	});
</script>

<div class="flex flex-col space-y-4">
	<div class="flex items-end justify-between space-x-4">
		<h1 class="text-3xl font-bold">Builds</h1>
		<Button
			color="gray"
			size="sm"
			{loading}
			disabled={loading}
			onclick={() => fetchBuilds(apiClient!)}
		>
			<FluentArrowSync20Filled />
			<span>Refresh</span>
		</Button>
	</div>

	<div class="rounded-lg border-2 border-gray-900 bg-gray-900/50 p-4 min-h-[557px]">
		<table class="w-full">
			<thead class="border-b-2 border-gray-600">
				<tr class="text-left">
					<th class="pb-4 w-1/4">Build ID</th>
					<th class="w-1/4">Description</th>
					<th class="w-1/8">Status</th>
					<th class="w-1/8">Submitted</th>
					<th class="w-1/8">Finished</th>
					<th class="w-1/8"></th>
				</tr>
			</thead>
			<tbody>
				{#if loading}
					{#each Array(10) as _, i}
						<tr class="group h-12 border-b-2 border-gray-600/25 relative">
							<td class="h-12">
								<div class="absolute top-2 left-0 h-8 w-full bg-gray-700/50 animate-pulse rounded"></div>
							</td>
						</tr>
					{/each}
				{:else}
					{#each builds as build}
						<tr class="group h-12 border-b-2 border-gray-600/25 transition-all hover:bg-gray-700">
							<td class="flex h-12 items-center space-x-2 pl-4">
								{#if build.success != undefined}
									{#if build.success}
										<FluentCheckmarkCircle12Filled class="size-6 text-green-400" />
									{:else}
										<FluentErrorCircle12Filled class="size-6 text-red-400" />
									{/if}
								{:else}
									<FluentSpinnerIos20Filled class="size-6 animate-spin text-gray-400" />
								{/if}
								<CopyCode value={build.buildId} canCopy />
							</td>
							<td>
								{#if build.description}
									{build.description}
								{:else}
									<span class="text-gray-500 select-none">&mdash;</span>
								{/if}
							</td>
							<td>
								{#if build.success != undefined}
									{#if build.success}
										{#if data.project?.liveBuild == build.buildId}
											<span class="text-mm-blue font-bold">LIVE</span>
										{:else}
											<span>{build.status}</span>
										{/if}
									{:else}
										<span class="text-red-400">{build.status}</span>
									{/if}
								{:else}
									<span class="text-gray-400 italic">{build.status}</span>
								{/if}
							</td>
							<td>{getRelativeTime(new Date(build.submittedAt))}</td>
							<td class="pr-4">
								{#if build.finishedAt}
									{getRelativeTime(new Date(build.finishedAt))}
								{:else}
									<span class="text-gray-500 select-none">&mdash;</span>
								{/if}
							</td>
							<td class="h-12 w-42">
								<a
									class="group/link flex h-12 w-42 items-center justify-end transition-all"
									href={`builds/${build.buildId}`}
								>
									<span class="group-hover/link:text-mm-blue text-nowrap text-gray-400 italic"
										>View details</span
									>
									<div class="relative mr-4 flex h-12 w-8 items-center justify-start">
										<FluentChevronRight20Filled
											class="group-hover:text-mm-blue absolute right-0 size-6 text-gray-400 transition-all group-hover/link:-right-2"
										/>
									</div>
								</a>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
