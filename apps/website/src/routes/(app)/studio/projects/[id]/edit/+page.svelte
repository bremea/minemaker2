<script lang="ts">
	import { getApiClient } from '$lib/state.svelte.js';
	import { updateProject } from '@minemaker/caller';
	import { Button, ImageUpload, Input, Radio, Tags, Textarea } from '@minemaker/ui';

	let { data } = $props();

	let name = $state(data.project?.name);
	let description = $state(data.project?.description);
	let isPublic = $state(data.project?.public);
	let image: FileList | undefined = $state();

	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;

		const newData: { name?: string; description?: string; public?: boolean } = {};
		if (name !== data.project?.name) newData.name = name;
		if (description !== data.project?.description) newData.description = description;
		if (isPublic !== data.project?.public) newData.public = isPublic;

		const updatedData = await updateProject(getApiClient()!, data.id, newData);

		loading = false;
		data.project = updatedData;
	}
</script>

<div class="flex w-full flex-col space-y-8">
	<h1 class="text-3xl font-bold">Edit Project</h1>
	<form class="w-full max-w-[800px] space-y-4" {onsubmit}>
		<ImageUpload class="w-[400px]" bind:files={image}>
			<img
				src={image ? URL.createObjectURL(image[0]) : 'https://placehold.co/384x256'}
				class="w-full"
				alt="Project icon"
			/>
		</ImageUpload>

		<Input type="text" placeholder="My project" class="w-full" bind:value={name} maxlength={50}>
			Project name
		</Input>

		<Textarea placeholder="..." class="w-full" maxlength={1000} bind:value={description}>Description</Textarea>

		<Button type="submit" class="w-full justify-center text-center">Save Changes</Button>
	</form>
</div>
