<script lang="ts">
	import { Button } from '@minemaker/ui';
	import FluentPlay20Filled from '~icons/fluent/play-20-filled';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';

	let { data } = $props();
</script>

<main class="flex w-full space-x-8 p-12">
	<img src="https://placehold.co/384x256" alt="icon" class="w-full" />
	<div class="flex w-[500px] flex-col justify-between">
		<div class="h-32">
			<h1 class="text-3xl font-bold">{data.game.name}</h1>
			<p class="text-lg">By {data.game.ownerId}</p>
		</div>
		<div class="flex w-full flex-col justify-center">
			<p class="mt-1 flex items-center space-x-1.5 text-lg text-gray-400">
				<FluentCircle20Filled class="size-4 text-green-400" />
				<span>
					<span class="text-white">{data.game.online}</span>
					{false ? 'player' : 'players'} online
				</span>
			</p>
		</div>
		<div class="flex h-32 flex-col justify-end">
			<Button size="xl" class="w-full justify-center font-bold">
				<FluentPlay20Filled /><span>Play</span>
			</Button>
		</div>
	</div>
</main>
