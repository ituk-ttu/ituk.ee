<script lang="ts">
	import "../app.css";
	import Navbar from "$lib/components/Navbar.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import ToastContainer from "$lib/components/ToastContainer.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicons/favicon.ico" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
	/>
	<title>ITÜK | TalTechi IT-teaduskonna üliõpilaskogu</title>
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Navbar />
	<ToastContainer />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
