<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let props: HTMLButtonAttributes = $props();
</script>

<button
	class="bg-mm-blue hover:bg-mm-blue-light focus:outline-mm-blue group relative flex w-min cursor-pointer items-end space-x-2 rounded-full px-8 py-2 text-xl text-nowrap text-black transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95"
	{...props}
>
	{@render props.children?.()}
</button>
