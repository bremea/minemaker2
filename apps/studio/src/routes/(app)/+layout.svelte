<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { getUserState } from '$lib/state.svelte';
	import { TabContainer, type OpenTabList } from '@minemaker/ui';

	let userState = getUserState();

	const { children } = $props();

	let openTabs = $state<OpenTabList>([]);

	let openTab = $state(async (label: string, href: string, switchIndex: boolean = true) => {
		if (!openTabs.some((e) => e.href === href)) {
			const openTabsClone: OpenTabList = Array.from(openTabs);
			openTabsClone.push({ label, href });
			openTabs = openTabsClone;
		}

		/*if (switchIndex) {
			await goto(href, { replaceState: true, invalidateAll: true });
		}*/
	});

	let closeTab = $state(async (index: number, switchIndex: boolean = true) => {
		const openTabsClone: OpenTabList = Array.from(openTabs);
		openTabsClone.splice(index, 1);
		openTabs = openTabsClone;

		if (switchIndex) {
			if (openTabsClone.length == 0) {
				await goto('/', { replaceState: true, invalidateAll: true });
			} else {
				await goto(openTabs[index - 1].href);
			}
		}
	});

	afterNavigate(({ type, to }) => {
		if (to?.url.pathname === '/' || type !== "link") return;
		openTab(document.title, to?.url.pathname!);
	});
</script>

<header class="flex h-10 w-full bg-gray-700">
	<div class="w-full overflow-scroll">
		<TabContainer withHomeTab bind:openTab bind:closeTab bind:openTabs />
	</div>
	<div class="flex h-full w-10 items-center justify-center">
		<img
			src={userState!.verified
				? `https://mc-heads.net/avatar/${userState!.player.uuid.replace(/-/g, '')}`
				: 'https://mc-heads.net/avatar/MHF_Steve'}
			alt="Player head"
			title={userState!.verified ? userState!.player.username : userState!.email}
			class="h-8"
		/>
	</div>
</header>

<main class="flex w-full flex-col items-center space-y-8 py-8">
	{@render children()}
</main>
