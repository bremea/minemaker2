<script lang="ts">
	import type { PageProps } from './$types';
	import { setContext } from 'svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';

	let { data }: PageProps = $props();

	
</script>

<Navbar />

<a href={data.authLink} class="rounded underline">Login with Microsoft</a>
