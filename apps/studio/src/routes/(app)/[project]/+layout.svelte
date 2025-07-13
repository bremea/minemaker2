<script lang="ts">
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import FluentSave20Filled from '~icons/fluent/save-20-filled';
	import FluentPlay20Filled from '~icons/fluent/play-20-filled';
	import FluentWrenchSettings20Filled from '~icons/fluent/wrench-settings-20-filled';
	import FluentTextAlignJustify20Filled from '~icons/fluent/text-align-justify-20-filled';

	const { children, data } = $props();
	let project = $derived(data.project);
</script>

<header
	class="relative flex h-10 max-w-screen cursor-pointer overflow-hidden bg-gray-700 px-2 select-none"
>
	<div class="flex flex-1 items-center space-x-2">
		<button
			class="group flex aspect-square h-full items-center justify-center rounded-full transition-all hover:bg-gray-600 active:scale-95 active:bg-gray-500"
		>
			<FluentTextAlignJustify20Filled
				class="size-6 h-6 w-6 text-gray-400 transition-all group-hover:text-white"
			/>
		</button>
	</div>
	<div
		class="pointer-events-none absolute flex h-full w-full items-center justify-center space-x-2"
	>
		<button
			class="group pointer-events-auto flex aspect-square h-full items-center justify-center rounded-full transition-all hover:bg-gray-600 active:scale-95 active:bg-gray-500"
		>
			{#if project.saved}
				<FluentSave20Filled
					class="size-6 h-6 w-6 text-gray-400 transition-all group-hover:text-white"
				/>
			{:else}
				<FluentSave20Filled
					class="size-6 h-6 w-6 text-yellow-500 transition-all group-hover:text-yellow-300"
				/>
			{/if}
		</button>
		<button
			onclick={data.save}
			class="group pointer-events-auto flex aspect-square h-full items-center justify-center rounded-full transition-all hover:bg-gray-600 active:scale-95 active:bg-gray-500"
		>
			<FluentPlay20Filled
				class="size-6 h-6 w-6 text-gray-400 transition-all group-hover:text-white"
			/>
		</button>
		<button
			class="group pointer-events-auto flex aspect-square h-full items-center justify-center rounded-full transition-all hover:bg-gray-600 active:scale-95 active:bg-gray-500"
		>
			<FluentWrenchSettings20Filled
				class="size-6 h-6 w-6 text-gray-400 transition-all group-hover:text-white"
			/>
		</button>
	</div>
	<div class="flex flex-1 items-center justify-end space-x-2">
		<a
			href="/"
			class="group flex aspect-square h-full items-center justify-center rounded-full transition-all hover:bg-gray-600 active:scale-95 active:bg-gray-500"
		>
			<FluentHome20Filled
				class="size-6 h-6 w-6 text-gray-400 transition-all group-hover:text-white"
			/>
		</a>
	</div>
</header>

<main class="flex w-full flex-col items-center justify-center space-y-8 py-8">
	{@render children()}
</main>
