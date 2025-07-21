<script lang="ts">
	import { getLoggedIn, getUserState } from '$lib/state.svelte';
	import { Button, Input, LinkButton, NavLink } from '@minemaker/ui';

	import FluentTextAlignJustify20Filled from '~icons/fluent/text-align-justify-20-filled';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import FluentPaintBrush20Filled from '~icons/fluent/paint-brush-20-filled';
	import FluentSettings20Filled from '~icons/fluent/settings-20-filled';
	import FluentSearch20Filled from '~icons/fluent/search-20-filled';

	let userState = $derived(getUserState());
	let loggedIn = $derived(getLoggedIn());

	let sideNavOpen = $state(false);
	let topNav: HTMLElement;

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node) && sideNavOpen && event.target != topNav) {
				sideNavOpen = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<nav
	class="relative z-50 flex h-14 w-screen justify-end bg-gray-600 px-12 py-2 shadow-lg"
	bind:this={topNav}
>
	<a
		href="/"
		class="absolute left-12 flex transition-all hover:scale-105 focus:scale-105 active:scale-95"
	>
		<img src="/mmlogo.png" alt="Minemaker Logo" class="h-10" />
		<span class="text-mm-blue text-xs">beta</span>
	</a>

	<div class="pointer-events-none flex h-10 w-full flex-1 items-center justify-center pl-62">
		<div class="pointer-events-auto flex h-full w-full items-center justify-center space-x-2">
			<Input
				class="h-full! w-64! border-gray-800 bg-gray-800! text-white outline-gray-800 hover:bg-gray-700"
				componentSize="sm"
				stretchHeight={true}
				placeholder="Search..."
			/>
			<LinkButton size="sm" color="darkgray" class="h-full!">
				<FluentSearch20Filled class="h-full" />
			</LinkButton>
		</div>
	</div>

	<div class="flex w-max items-center space-x-4">
		{#if loggedIn}
			<div class="flex space-x-4">
				{#if userState!.guest || userState?.verified}
					<a href={`/profile/${userState!.player.username}`} class="flex h-10 items-center">
						<img
							src={`https://mc-heads.net/avatar/${userState!.player.uuid.replace(/-/g, '')}`}
							alt="Player head"
							title={userState!.player.username}
							class="aspect-square size-8 select-none"
						/>
					</a>
				{:else}
					<a href={`/link`} class="flex h-10 items-center">
						<img
							src="https://mc-heads.net/avatar/MHF_Steve"
							alt="Player head"
							title={userState!.email}
							class="aspect-square size-8 select-none"
						/>
					</a>
				{/if}
				<div class="flex items-center">
					<img src="/gem.png" alt="Gem icon" class="h-10" />
					<span class="text-xl font-bold">
						{!userState?.guest && userState?.verified ? userState.gems : 0}
					</span>
				</div>
			</div>
		{:else}
			<LinkButton color="darkgray" size="md" href="/login">Login</LinkButton>
		{/if}
		{#if !sideNavOpen}
			<button
				class="cursor-pointer"
				onclick={() => {
					sideNavOpen = true;
				}}
			>
				<FluentTextAlignJustify20Filled class="mt-0.5 size-6" />
			</button>
		{:else}
			<button
				class="cursor-pointer"
				onclick={() => {
					sideNavOpen = false;
				}}
			>
				<FluentDismiss20Filled class="mt-0.5 size-6" />
			</button>
		{/if}
	</div>
</nav>

{#if sideNavOpen}
	<nav
		class="absolute right-0 z-40 flex h-full w-64 flex-col items-end space-y-2 bg-gray-700 pt-16 shadow-2xl"
		use:clickOutside
	>
		<NavLink href="/">
			<FluentHome20Filled class="h-6 w-6" />
			<span>Home</span>
		</NavLink>
		<NavLink href="/studio/projects">
			<FluentPaintBrush20Filled class="h-6 w-6" />
			<span>Studio</span>
		</NavLink>
		<NavLink href="/profile">
			{#if userState!.guest}
				<img
					src={`https://mc-heads.net/avatar/${userState!.player.uuid.replace(/-/g, '')}`}
					alt="Player head"
					title={userState!.player.username}
					class="h-6"
				/>
			{:else}
				<img
					src={userState!.verified
						? `https://mc-heads.net/avatar/${userState!.player.uuid.replace(/-/g, '')}`
						: 'https://mc-heads.net/avatar/MHF_Steve'}
					alt="Player head"
					title={userState!.verified ? userState!.player.username : userState!.email}
					class="h-6"
				/>
			{/if}
			<span>Profile</span>
		</NavLink>
		<NavLink href="/settings">
			<FluentSettings20Filled class="h-6 w-6" />
			<span>Settings</span>
		</NavLink>
	</nav>
{/if}
