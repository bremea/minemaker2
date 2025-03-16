<script lang="ts">
	import { Button } from '@minemaker/ui';

	let { data } = $props();
</script>

<div class="flex flex-col space-y-4">
	<h1 class="text-3xl font-bold">{data.project?.name}</h1>
	<p>{data.project?.id}</p>
	<img src="https://placehold.co/384x256" class="" alt="Project icon" />

	<Button color="red">Delete project</Button>
</div>
