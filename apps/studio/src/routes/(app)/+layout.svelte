<script lang="ts">
	const { children, data } = $props();
</script>

{#await data.state}
	loading
{:then _}
	{@render children()}
{/await}
