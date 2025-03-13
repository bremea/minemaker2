<script>
	import ArrowButtonLeft from '$lib/components/input/buttons/arrowButtonLeft.svelte';
	import ArrowButtonRight from '$lib/components/input/buttons/arrowButtonRight.svelte';
	import ArrowLinkLeft from '$lib/components/navigation/links/arrowLinkLeft.svelte';
	import ArrowLinkRight from '$lib/components/navigation/links/arrowLinkRight.svelte';
</script>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Buttons</h1>
	<div class="flex space-x-8">
		<div>
			<p>ArrowButtonLeft</p>
			<ArrowButtonLeft>Hello World</ArrowButtonLeft>
		</div>

		<div>
			<p>ArrowButtonRight</p>
			<ArrowButtonRight>Hello World</ArrowButtonRight>
		</div>
	</div>
</section>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Links</h1>
	<div class="flex space-x-8">
		<div>
			<p>ArrowButtonLeft</p>
			<ArrowLinkLeft href="/">Hello World</ArrowLinkLeft>
		</div>

		<div>
			<p>ArrowButtonLeft</p>
			<ArrowLinkRight>Hello World</ArrowLinkRight>
		</div>
	</div>
</section>
