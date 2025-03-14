<script lang="ts">
	import { getLoggedIn, getUserState } from '$lib/state.svelte';
	import { LinkButton } from '@minemaker/ui';

	let userState = getUserState();
	let loggedIn = getLoggedIn();
</script>

<nav class="relative flex w-full justify-end bg-gray-600 px-12 py-2 shadow-lg">
	<a
		href="/"
		class="absolute left-12 flex transition-all hover:scale-105 focus:scale-105 active:scale-95"
	>
		<img src="/mmlogo.png" alt="Minemaker Logo" class="h-10" />
		<span class="text-mm-blue text-xs">beta</span>
	</a>

	{#if loggedIn}
		<div class="flex items-center space-x-8">
			<!--<div class="flex items-center">
				<img src="/gem.png" alt="Gem icon" class="h-10" />
				<span class="font-bold">{userState.gems}</span>
			</div>-->
			<a href={`/profile/${userState!.uuid}`} class="flex h-10 items-center">
				<img
					src={`https://mc-heads.net/avatar/${userState!.uuid.replace(/-/g, '')}`}
					alt="Player head"
					title={userState!.username}
					class="h-8"
				/>
			</a>
		</div>
	{:else}
		<div class="flex items-center space-x-8">
			<LinkButton color="darkgray" size="md" href="/login">Login</LinkButton>
		</div>
	{/if}
</nav>
