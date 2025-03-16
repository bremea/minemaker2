<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let { children, class: className, ...others }: HTMLAnchorAttributes = $props();
</script>

<a class={`text-mm-blue underline hover:text-mm-blue-light transition-all cursor-pointer ${className}`} {...others}>
	{@render children?.()}
</a>
