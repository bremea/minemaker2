<script lang="ts">
	import { getApiClient } from '$lib/state.svelte.js';
	import RestClient, { getBuild, getBuildLog, updateGame } from '@minemaker/caller';
	import type { ApiBuild } from '@minemaker/types';
	import { ArrowLinkLeft, BuildInfo, Button, Link, LinkButton, Loader, Popup } from '@minemaker/ui';
	import FluentArrowDownload20Filled from '~icons/fluent/arrow-download-20-filled';
	import FluentWarning20Filled from '~icons/fluent/warning-20-filled';
	import FluentDocumentQuestionMark20Filled from '~icons/fluent/document-question-mark-20-filled';
	import { onMount } from 'svelte';

	let { data } = $props();
	let loading = $state(true);
	let loadingLog = $state(true);
	let apiClient = $derived(getApiClient());
	let build: ApiBuild | undefined = $state();
	let log = $state('');
	let logExists = $state(true);

	let setLivePopup = $state(false);
	let deletePopup = $state(false);

	const fetchBuild = async (client: RestClient) => {
		loading = true;
		loadingLog = true;

		build = await getBuild(client, data.id, data.buildId);
		loading = false;

		try {
			log = await getBuildLog(client, data.id, data.buildId);
			loadingLog = false;
		} catch (e) {
			logExists = false;
		}
	};

	const setLive = async () => {
		if (apiClient == undefined) return;
		await updateGame(apiClient, data.id, { liveBuild: data.buildId });
	};

	onMount(() => {
		if (apiClient == undefined) return;
		fetchBuild(apiClient);
	});
</script>

{#if loading}
	loading
{:else if build != undefined}
	<div class="flex h-full flex-wrap space-y-8 space-x-8">
		<div class="h-full w-full min-w-[600px] flex-1 space-y-8">
			<div class="flex items-end space-x-4">
				<ArrowLinkLeft color="gray" size="sm" href={`/studio/projects/${data.id}/builds`}>
					Back
				</ArrowLinkLeft>
				<h2 class="text-2xl font-bold">Build Info</h2>
			</div>
			<div>
				<p class="text-xl font-bold">Metadata</p>
				<BuildInfo label="Build ID" value={build.buildId} canCopy />
				<BuildInfo label="Description" value={build.description} canCopy />
				<BuildInfo label="Game ID" value={build.gameId} canCopy />
			</div>
			<div>
				<p class="text-xl font-bold">Status</p>
				<BuildInfo label="Status" value={build.status} canCopy />
				{#if build.success}
					<BuildInfo label="Success" value={build.success ? 'true' : 'false'} />
					<BuildInfo
						label="Live"
						value={data.project?.liveBuild == build.buildId ? 'true' : 'false'}
					/>
				{/if}
				{#if build.builderId}
					<BuildInfo label="Builder ID" value={build.builderId} canCopy />
				{/if}
				{#if build.time}
					<BuildInfo label="Build time" value={build.time + 's'} />
				{/if}
				{#if build.finishedAt}
					<BuildInfo label="Finished" value={new Date(build.finishedAt).toString()} canCopy />
				{/if}
			</div>
			<div>
				<p class="text-xl font-bold">Submission Info</p>
				<BuildInfo label="Submitter ID" value={build.userId} canCopy />
				<BuildInfo label="Submitter IP" value={build.submitterIp} canCopy />
				<BuildInfo label="Submitted" value={new Date(build.submittedAt).toString()} canCopy />
			</div>
			<div>
				<p class="mb-2 text-xl font-bold">Actions</p>
				<div class="w-42 space-y-4">
					<Button
						class="w-full justify-center text-center"
						size="sm"
						color="gray"
						onclick={() => (setLivePopup = true)}
					>
						Set Live
					</Button>
					<Button
						class="w-full justify-center text-center"
						size="sm"
						color="red"
						onclick={() => (deletePopup = true)}
					>
						Delete Build
					</Button>
				</div>
			</div>
		</div>
		<div class="w-[700px] flex-1 rounded-lg border-2 border-gray-900 bg-gray-900/50 p-4">
			<div class="flex w-full items-center border-b-2 border-b-gray-600 pb-2">
				<div class="w-full">
					<h2 class="font-bold">Build log</h2>
					<p class="text-sm text-gray-400 italic">Logs will automatically delete after 7 days.</p>
				</div>
				{#if !loadingLog}
					<LinkButton
						color="gray"
						size="sm"
						href={`/api/games/${data.id}/builds/${data.buildId}/log`}
						target="_blank"
					>
						<FluentArrowDownload20Filled class="mr-1" /><span>Download</span>
					</LinkButton>
				{/if}
			</div>
			{#if loadingLog}
				<div class="flex h-full w-full items-center justify-center">
					{#if logExists}
						<Loader />
					{:else}
						<div class="space-y-2">
							<div class="rounded-lg bg-gray-700/50 p-4">
								<FluentDocumentQuestionMark20Filled class="size-12 text-gray-600" />
							</div>
							<p class="text-sm text-gray-600 italic select-none">File not found</p>
						</div>
					{/if}
				</div>
			{:else}
				<div class="h-[700px] w-full overflow-auto">
					<code class="inline-flex h-full w-max flex-col space-x-4 text-left text-sm text-white">
						{#each log.split('\n') as txt, i}
							<span>{txt}</span>
						{/each}
					</code>
				</div>
			{/if}
		</div>
	</div>
{/if}

<Popup bind:open={setLivePopup} class="w-[600px]">
	<div class="flex items-end space-x-2 text-yellow-400">
		<FluentWarning20Filled class="size-6" />
		<h2 class="text-xl font-bold">Set Build Live</h2>
	</div>
	<p class="text-sm">
		<span class="font-bold">You're about to set this build live for your game.</span> Existing game instances
		will not be shut down, but they will stop accepting new players. All new players will be sent to
		new game instances running the new live build.
	</p>
	<p class="text-sm">
		Refer to the <Link href="https://docs.minemaker.net/" target="_blank">documentation</Link> for more
		info.
	</p>
	<div class="mt-8 flex justify-end space-x-4">
		<Button color="gray" onclick={() => (setLivePopup = false)}>Cancel</Button>
		<Button onclick={setLive}>Set Live</Button>
	</div>
</Popup>

<Popup bind:open={deletePopup} class="w-[600px]">
	<div class="flex items-end space-x-2 text-yellow-400">
		<FluentWarning20Filled class="size-6" />
		<h2 class="text-xl font-bold">Delete Build</h2>
	</div>
	<p class="text-sm">
		<span class="font-bold">You're about to delete this build.</span> You will no longer be able to set
		this build as live for your game. It's contents will be lost if you do not have a backup in Minemaker
		Studio.
	</p>
	<p class="text-sm">
		Refer to the <Link href="https://docs.minemaker.net/" target="_blank">documentation</Link> for more
		info.
	</p>
	<div class="mt-8 flex justify-end space-x-4">
		<Button color="gray" onclick={() => (deletePopup = false)}>Cancel</Button>
		<Button color="red">Delete</Button>
	</div>
</Popup>
