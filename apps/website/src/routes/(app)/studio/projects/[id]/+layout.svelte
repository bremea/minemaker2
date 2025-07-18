<script lang="ts">
	import { NavLink, Loader } from '@minemaker/ui';

	import FluentChevronLeft24Filled from '~icons/fluent/chevron-left-24-filled';
	import FluentEdit16Filled from '~icons/fluent/edit-16-filled';
	import FluentDataHistogram16Filled from '~icons/fluent/data-histogram-16-filled';
	import FluentCart16Filled from '~icons/fluent/cart-16-filled';
	import FluentPersonLock16Filled from '~icons/fluent/person-lock-16-filled';
	import FluentKey16Filled from '~icons/fluent/key-16-filled';
	import FluentGavel16Filled from '~icons/fluent/gavel-16-filled';
	import FluentOpen16Filled from '~icons/fluent/open-16-filled';
	import FluentEyeShow16Filled from '~icons/fluent/eye-show-16-filled';
	import FluentWrenchSettings20Filled from '~icons/fluent/wrench-settings-20-filled'

	let { children, data } = $props();
</script>

{#await data.project}
	<Loader />
{:then}
	<div class="relative flex h-full min-h-screen">
		<nav class="sticky top-0 h-full min-h-screen w-[300px] border-r-1 border-r-gray-600 shadow-lg">
			<div class="flex flex-col items-center space-y-2 pt-4">
				<NavLink href="/studio/projects">
					<FluentChevronLeft24Filled class="h-6 w-6" />
					<span>Back</span>
				</NavLink>
				<div class="mt-4 w-full p-2">
					<p class="text-xl font-bold">{data.project?.name}</p>
				</div>
				<NavLink href={`/studio/projects/${data.project?.id}`}>
					<FluentEyeShow16Filled class="h-6 w-6" />
					<span>Overview</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/edit`}>
					<FluentEdit16Filled class="h-6 w-6" />
					<span>Edit</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/builds`}>
					<FluentWrenchSettings20Filled class="h-6 w-6" />
					<span>Builds</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/analytics`}>
					<FluentDataHistogram16Filled class="h-6 w-6" />
					<span>Analytics</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/store`}>
					<FluentCart16Filled class="h-6 w-6" />
					<span>Store</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/access`}>
					<FluentPersonLock16Filled class="h-6 w-6" />
					<span>Access</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/secrets`}>
					<FluentKey16Filled class="h-6 w-6" />
					<span>Secrets</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/moderation`}>
					<FluentGavel16Filled class="h-6 w-6" />
					<span>Moderation</span>
				</NavLink>
				<NavLink>
					<FluentOpen16Filled class="h-6 w-6" />
					<span>Open in Studio</span>
				</NavLink>
			</div>
		</nav>

		<main class="h-full w-full p-12">
			{@render children?.()}
		</main>
	</div>
{/await}
