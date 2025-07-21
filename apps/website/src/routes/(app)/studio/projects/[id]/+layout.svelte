<script lang="ts">
	import { NavLink, Loader } from '@minemaker/ui';

	import FluentGrid20Filled from '~icons/fluent/grid-20-filled';
	import FluentEdit20Filled from '~icons/fluent/edit-20-filled';
	import FluentDataHistogram20Filled from '~icons/fluent/data-histogram-20-filled';
	import FluentCart20Filled from '~icons/fluent/cart-20-filled';
	import FluentPersonLock20Filled from '~icons/fluent/person-lock-20-filled';
	import FluentKey20Filled from '~icons/fluent/key-20-filled';
	import FluentGavel20Filled from '~icons/fluent/gavel-20-filled';
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';
	import FluentEyeShow20Filled from '~icons/fluent/eye-show-20-filled';
	import FluentDatabase20Filled from '~icons/fluent/database-20-filled'
	import FluentWrenchSettings20Filled from '~icons/fluent/wrench-settings-20-filled';

	let { children, data } = $props();
</script>

{#await data.project}
	<Loader />
{:then}
	<div class="relative flex h-full min-h-screen">
		<nav class="sticky top-0 h-full min-h-screen w-[300px] border-r-1 border-r-gray-600 shadow-lg">
			<div class="flex flex-col items-center space-y-2 pt-4">
				<NavLink href="/studio/projects">
					<FluentGrid20Filled class="h-6 w-6" />
					<span>All Projects</span>
				</NavLink>
				<div class="mt-4 w-full p-2">
					<p class="text-xl font-bold">{data.project?.name}</p>
				</div>
				<NavLink href={`/studio/projects/${data.project?.id}`}>
					<FluentEyeShow20Filled class="h-6 w-6" />
					<span>Overview</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/edit`}>
					<FluentEdit20Filled class="h-6 w-6" />
					<span>Edit</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/builds`}>
					<FluentWrenchSettings20Filled class="h-6 w-6" />
					<span>Builds</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/analytics`}>
					<FluentDataHistogram20Filled class="h-6 w-6" />
					<span>Analytics</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/store`}>
					<FluentCart20Filled class="h-6 w-6" />
					<span>Store</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/db`}>
					<FluentDatabase20Filled class="h-6 w-6" />
					<span>K/V Database</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/access`}>
					<FluentPersonLock20Filled class="h-6 w-6" />
					<span>Access</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/secrets`}>
					<FluentKey20Filled class="h-6 w-6" />
					<span>Secrets</span>
				</NavLink>
				<NavLink href={`/studio/projects/${data.project?.id}/moderation`}>
					<FluentGavel20Filled class="h-6 w-6" />
					<span>Moderation</span>
				</NavLink>
				<NavLink>
					<FluentOpen20Filled class="h-6 w-6" />
					<span>Open in Studio</span>
				</NavLink>
			</div>
		</nav>

		<main class="h-full w-full p-12">
			{@render children?.()}
		</main>
	</div>
{/await}
