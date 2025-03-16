<script lang="ts">
	import { getLoggedIn } from '$lib/state.svelte';
	import { Loader } from '@minemaker/ui';

	let { children } = $props();

	let loggedIn = getLoggedIn();
</script>

{#if loggedIn}
	{@render children()}
{:else}
	<Loader />
{/if}
