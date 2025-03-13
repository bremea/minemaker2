<script lang="ts">
	import FluentChevronRight24Filled from '~icons/fluent/chevron-right-24-filled';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let props: HTMLAnchorAttributes = $props();
</script>

<a
	class="bg-mm-blue hover:bg-mm-blue-light focus:outline-mm-blue group relative flex w-min cursor-pointer items-end space-x-2 rounded-full px-8 py-2 text-xl text-nowrap text-black transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95"
	{...props}
>
	<span class="mr-6">{@render props.children?.()}</span>
	<FluentChevronRight24Filled
		class="absolute right-6 bottom-[9px] transition-all group-hover:right-4"
	/>
</a>
