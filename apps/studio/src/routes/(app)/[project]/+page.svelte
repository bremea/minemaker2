<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.project.name}</title>
</svelte:head>

<h1>{data.project.saved}</h1>
<button
	onclick={() => {
		data.project.saved = false;
	}}>unsave</button
>
<button
	onclick={data.save}>save</button
>

{data.project.name}
