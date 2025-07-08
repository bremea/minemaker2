<script lang="ts">
	import { getLoggedIn, getUserState } from '$lib/state.svelte';
	import { LinkButton, NavLink } from '@minemaker/ui';

	import FluentTextAlignJustify20Filled from '~icons/fluent/text-align-justify-20-filled';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';

	let userState = getUserState();
	let loggedIn = getLoggedIn();

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
	class="relative z-50 flex w-full justify-end bg-gray-600 px-12 py-2 shadow-lg"
	bind:this={topNav}
>
	<a
		href="/"
		class="absolute left-12 flex transition-all hover:scale-105 focus:scale-105 active:scale-95"
	>
		<img src="/mmlogo.png" alt="Minemaker Logo" class="h-10" />
		<span class="text-mm-blue text-xs">beta</span>
	</a>

	<div class="flex items-center space-x-4">
		{#if loggedIn}
			<!--<div class="flex items-center mr-8">
				<img src="/gem.png" alt="Gem icon" class="h-10" />
				<span class="font-bold">{userState!.gems}</span>
			</div>-->
			<a href={`/profile/${userState!.id}`} class="flex h-10 items-center">
				<img
					src={userState!.verified ? `https://mc-heads.net/avatar/${userState!.id.replace(/-/g, '')}` : 'https://mc-heads.net/avatar/0b612337-6e77-4267-9c17-911dc3b3d1f3'}
					alt="Player head"
					title={userState!.verified ? userState!.minecraftAccount.username : userState!.email}
					class="h-8"
				/>
			</a>
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
			<FluentDismiss20Filled class="h-6 w-6" />
			<span>Home</span>
		</NavLink>
		<NavLink href="/studio/projects">
			<FluentDismiss20Filled class="h-6 w-6" />
			<span>Studio</span>
		</NavLink>
		<NavLink href="/profile">
			<FluentDismiss20Filled class="h-6 w-6" />
			<span>Profile</span>
		</NavLink>
	</nav>
{/if}
