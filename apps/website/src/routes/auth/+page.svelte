<script lang="ts">
		import type { PageProps } from './$types';
	import Navbar from '$lib/components/navigation/navbar.svelte';

	let { data }: PageProps = $props();
</script>

<Navbar />

<a href={data.authLink} class="underline rounded">Login with Microsoft</a>
