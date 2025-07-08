<script lang="ts">
	import { Link } from '@minemaker/ui';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<main class="flex w-full justify-center p-12">
	<h1>Unlock all of Minemaker</h1>
	<Link href={data.authLink}>Login with Xbox Live</Link>
</main>
