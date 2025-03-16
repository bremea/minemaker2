<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import FluentSpinnerIos16Filled from '~icons/fluent/spinner-ios-16-filled';

	interface Props {
		color: 'blue' | 'purple' | 'gray' | 'darkgray' | 'red';
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface ButtonProps extends HTMLButtonAttributes {
		color?: Props['color'];
		size?: Props['size'];
		class?: string;
		loading?: boolean;
	}

	const colorClasses: { [K in Props['color']]: string } = {
		blue: 'bg-mm-blue hover:bg-mm-blue-light outline-mm-blue text-black',
		purple: 'bg-mm-purple hover:bg-mm-purple-light outline-mm-purple text-black',
		red: 'bg-red-500 hover:bg-red-400 outline-red-500 text-black',
		gray: 'bg-gray-600 hover:bg-gray-500 outline-gray-600 text-white',
		darkgray: 'bg-gray-800 hover:bg-gray-700 outline-gray-800 text-white'
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
		loading,
		...others
	}: ButtonProps = $props();
</script>

<button
	class={`${colorClasses[color]} group relative flex h-min w-min cursor-pointer items-center space-x-2 rounded-full ${sizeClasses[size]} text-nowrap outline-0 transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95 ${className}`}
	{...others}
>
	{#if loading}
		<div class="flex w-full h-full justify-center items-center left-0 top-0 absolute z-10">
			<FluentSpinnerIos16Filled class={`animate-spin`} />
		</div>
	{/if}
	<div class={`${loading ? 'opacity-0' : 'opacity-100'} flex items-center text-nowrap space-x-2`}>
		{@render children?.()}
	</div>
</button>
