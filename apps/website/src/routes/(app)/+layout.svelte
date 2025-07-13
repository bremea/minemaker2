<script lang="ts">
	import Footer from '$lib/components/navigation/footer.svelte';
	import Navbar from '$lib/components/navigation/navbar.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
</script>

<Navbar />
<div class="grow h-full">
	{@render children()}
</div>
<Footer />
