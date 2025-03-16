<script lang="ts">
	import { Button, Input, Radio, Tags, Textarea } from '@minemaker/ui';

	let { data } = $props();

	let name = $state(data.project?.name);
	let description = $state(data.project?.description);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<div class="flex w-full flex-col space-y-8">
	<h1 class="text-3xl font-bold">Edit Project</h1>
	<form class="w-full max-w-[800px] space-y-4" {onsubmit}>
		<div class="flex w-full justify-center">
			<img src="https://placehold.co/384x256" alt="Project icon" />
		</div>

		<Input type="text" placeholder="My project" class="w-full" bind:value={name} maxlength={50}>
			Project name
		</Input>

		<Textarea placeholder="..." class="w-full" maxlength={1000}>Description</Textarea>

		<Button type="submit" class="w-full justify-center text-center">Save Changes</Button>
	</form>
</div>
