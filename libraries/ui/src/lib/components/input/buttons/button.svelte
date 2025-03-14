<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props {
		color: 'blue' | 'purple' | 'gray';
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface ButtonProps extends HTMLButtonAttributes {
		color?: Props['color'];
		size?: Props['size'];
		class?: string;
	}

	const colorClasses: { [K in Props['color']]: string } = {
		blue: 'bg-mm-blue hover:bg-mm-blue-light focus:outline-mm-blue text-black',
		purple: 'bg-mm-purple hover:bg-mm-purple-light focus:outline-mm-purple text-black',
		gray: 'bg-gray-600 hover:bg-gray-500 focus:outline-gray-600 text-white'
	};

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	let {
		children,
		color = 'blue',
		size = 'md',
		class: className,
		...others
	}: ButtonProps = $props();
</script>

<button
	class={`${colorClasses[color]} group relative flex h-min w-min cursor-pointer items-center space-x-2 rounded-full ${sizeClasses[size]} text-nowrap transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95 ${className}`}
	{...others}
>
	{@render children?.()}
</button>
