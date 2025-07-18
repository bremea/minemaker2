<script lang="ts">
	import { Button, GameTile } from '@minemaker/ui';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';
	import FluentPersonAdd20Filled from '~icons/fluent/person-add-20-filled';
	import FluentPersonClock20Filled from '~icons/fluent/person-clock-20-filled';
	import FluentPersonAvailable20Filled from '~icons/fluent/person-available-20-filled';

	let { data } = $props();
</script>

<main class="flex w-full flex-col items-center justify-center p-12">
	<div class="w-full rounded-lg bg-gray-600 px-8">
		<div class="relative flex h-32 w-full space-x-8">
			<div class="relative h-full w-32">
				<div class="absolute -top-10 flex h-42 w-36 justify-center overflow-hidden">
					<img
						src={`https://mc-heads.net/body/${data.profile.playerData.uuid}`}
						alt={`Skin for player ${data.profile.playerData.username}`}
						class="absolute w-full p-4 drop-shadow-[0_0_8px_rgba(0,0,0,1)] drop-shadow-black/75"
					/>
				</div>
			</div>
			<div class="flex flex-col justify-center space-y-2">
				<h1 class="text-4xl font-bold">{data.profile.playerData.username}</h1>
				<p class="mt-1 flex items-center space-x-1.5 text-gray-400">
					{#if data.profile.presence}
						<FluentCircle20Filled class="size-4 text-green-400" />
						<span>
							Playing
							<span class="font-bold text-white">{data.profile.presence.game.name}</span>
						</span>
					{:else}
						<FluentCircle20Filled class="size-4 text-gray-400" />
						<span>Offline</span>
					{/if}
				</p>
			</div>
			<div class="absolute right-0 flex h-full items-center">
				<Button color="darkgray" size="sm"
					><FluentPersonAdd20Filled /><span class="text-base">Add Friend</span></Button
				>
				<!-- 
				<div class="space-x-2 flex items-center text-gray-400"><FluentPersonClock20Filled /><span>Request Pending</span></div>
				<div class="space-x-2 flex items-center"><FluentPersonAvailable20Filled /><span>Friends</span></div>
				 -->
			</div>
		</div>
	</div>
	<div class="w-full bg-gray-800 p-8">
		{#if data.profile.creations}
			<section class="space-y-4">
				<h2 class="text-2xl font-bold">My Creations</h2>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
					{#each data.profile.creations as game}
						<GameTile {game} />
					{/each}
				</div>
			</section>
		{/if}
	</div>
</main>
