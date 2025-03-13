<script lang="ts">
	import FluentChevronLeft24Filled from '~icons/fluent/chevron-left-24-filled';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let props: HTMLAnchorAttributes = $props();
</script>

<a
	class="bg-mm-blue hover:bg-mm-blue-light focus:outline-mm-blue group relative flex w-min cursor-pointer items-end space-x-2 rounded-full px-8 py-2 text-xl text-nowrap text-black transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95"
	{...props}
>
	<FluentChevronLeft24Filled
		class="absolute bottom-[9px] left-6 transition-all group-hover:left-4"
	/>
	<span class="ml-6">{@render props.children?.()}</span>
</a>
