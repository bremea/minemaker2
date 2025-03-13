<script>
	import ArrowButtonLeft from '$lib/components/input/buttons/arrowButtonLeft.svelte';
	import ArrowButtonRight from '$lib/components/input/buttons/arrowButtonRight.svelte';
	import Button from '$lib/components/input/buttons/button.svelte';
	import ArrowLinkLeft from '$lib/components/navigation/links/arrowLinkLeft.svelte';
	import ArrowLinkRight from '$lib/components/navigation/links/arrowLinkRight.svelte';
</script>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Button Sizes</h1>
	<div class="flex space-x-8">
		<Button size="sm">Small</Button>
		<Button size="md">Medium</Button>
		<Button size="lg">Large</Button>
		<Button size="xl">Extra Large</Button>
	</div>
</section>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Button Colors</h1>
	<div class="flex space-x-8">
		<Button color="blue">Blue</Button>
		<Button color="purple">Purple</Button>
		<Button color="gray">Gray</Button>
	</div>
</section>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Button Variants</h1>
	<div class="flex space-x-8">
		<ArrowButtonLeft>Arrow Left</ArrowButtonLeft>
		<ArrowButtonRight>Arrow Right</ArrowButtonRight>
	</div>
</section>

<section class="mx-12 mt-8 space-y-4">
	<h1 class="font-bold">Link Button Variants</h1>
	<div class="flex space-x-8">
		<ArrowLinkLeft href="/">Arrow Left</ArrowLinkLeft>
		<ArrowLinkRight href="/">Arrow Right</ArrowLinkRight>
	</div>
</section>
