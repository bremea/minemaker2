<script lang="ts">
	import { linkRequestOauth } from '@minemaker/caller';
	import { onMount } from 'svelte';
	import { getApiClient, getLoggedIn, getUserState } from '$lib/state.svelte';
	import FluentArrowBidirectionalUpDown20Filled from '~icons/fluent/arrow-bidirectional-up-down-20-filled';
	import type { PageProps } from './$types';
	import type { ApiPlayer } from '@minemaker/types';
	import { goto } from '$app/navigation';
	import { Button, Loader, Warning } from '@minemaker/ui';

	let { data }: PageProps = $props();

	let loading = $state(true);
	let error = $state('');
	let player = $state<ApiPlayer | undefined>();
	let me = getUserState();

	onMount(async () => {
		if (!getLoggedIn()) {
			goto('/login');
		}

		const apiClient = getApiClient()!;

		try {
			const playerData = await linkRequestOauth(apiClient, data.code!);
			player = playerData;
			loading = false;
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	});
</script>

<main class="flex min-h-screen w-full justify-center p-12">
	<div
		class="flex min-h-[600px] h-min w-[800px] flex-col items-center justify-center space-y-8 rounded-lg bg-gray-700 p-12"
	>
		{#if loading}
			<Loader />
		{:else if error != '' || !player || !me || me.guest}
			{error}
		{:else}
			<h2 class="text-2xl font-bold">Link Accounts</h2>

			<div class="flex w-full flex-col items-center">
				<div class="flex w-full flex-col overflow-hidden rounded bg-gray-600">
					<div
						class="relative z-10 flex h-12 w-full items-center justify-center overflow-hidden bg-black/50"
					>
						<img src="/minecraft.svg" alt="Minecraft logo" class="z-20 h-8" />
						<div
							class="crisp-bg absolute top-0 left-0 z-0 h-full w-full bg-[url(/minecraftbg.png)] [background-size:72px] bg-center"
						></div>
					</div>
					<div class="m-4 mx-8 flex h-12 w-full space-x-4">
						<img
							src={`https://mc-heads.net/avatar/${player.uuid}`}
							alt="Player head"
							title={player.username}
							class="h-12"
						/>
						<div class="space-y-1">
							<p class="text-xl font-bold">{player.username}</p>
							<p class="text-xs opacity-50">{player.uuid}</p>
						</div>
					</div>
				</div>

				<FluentArrowBidirectionalUpDown20Filled class="my-2 size-12 text-gray-400" />

				<div class="flex w-full flex-col overflow-hidden rounded bg-gray-600">
					<div class="bg-mm-blue flex h-12 w-full items-center justify-center overflow-hidden">
						<img src="/mmlogo.png" alt="Minemaker logo" class="h-8" />
					</div>
					<div class="m-4 mx-8 flex h-12 w-full space-x-4">
						<img src="/favicon.png" alt="Minemaker logo" title={me.email} class="h-12" />
						<div class="space-y-1">
							<p class="text-xl font-bold">{me.email}</p>
							<p class="text-xs opacity-50">{me.id}</p>
						</div>
					</div>
				</div>
			</div>
			<div>
				<p class="text-center">
					You are about to link your Minecraft account
					<span class="font-bold">
						{player.username}
					</span> with your Minemaker account.
				</p>
				<p class="text-xs opacity-50 text-center">
					You can unlink your Minecraft account at any time in your account settings.
				</p>
			</div>
			<div class="flex flex-col space-y-4 w-full items-center">
				<Button class="w-[400px] flex justify-center font-bold">Link</Button>
				<Button class="w-[400px] flex justify-center" color="darkgray">Cancel</Button>
			</div>
		{/if}
	</div>
</main>
