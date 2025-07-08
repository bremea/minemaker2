<script>
	import { Link } from '@minemaker/ui';
	import { openUrl } from '@tauri-apps/plugin-opener';
</script>

<main class="flex h-screen w-full flex-col items-center justify-center space-y-4">
	<img src="/studiologo.png" alt="Minemaker Studio Logo" class="h-32 mb-12" />
	<h1 class="text-3xl font-bold">Uh oh! Account unverified</h1>
	<p>
		You need to link your Minemaker account with a Minecraft: Java Edition account before you can
		use Minemaker Studio.
	</p>
	<p>
		You can link you account by going to <Link
			onclick={() => openUrl('https://minemaker.net/link')}
		>
			https://minemaker.net/link
		</Link>
	</p>
</main>
