<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<a href={data.authLink} class="rounded underline">Login with Microsoft</a>
