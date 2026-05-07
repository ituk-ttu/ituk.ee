<script lang="ts">
	import * as m from "$lib/paraglide/messages";
	import Button from "./Button.svelte";
	import LanguageSwitcher from "./LanguageSwitcher.svelte";

	let isMenuOpen = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (typeof document !== "undefined") {
			document.body.style.overflow = isMenuOpen ? "hidden" : "";
		}
	}
</script>

<header
	class="sticky top-0 z-50 w-full px-[clamp(1rem,4vw,4rem)] py-4 bg-background shadow-filled flex justify-between items-center"
>
	<!-- Logo - small on mobile, large on sm+ -->
	<a
		class="flex sm:hidden items-center cursor-pointer"
		href="/"
		aria-label="Avaleht"
	>
		<img
			src="/logos/ituk_navbar_symbol.svg"
			alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu"
			height="56"
			width="56"
		/>
	</a>
	<a
		class="hidden sm:flex items-center cursor-pointer"
		href="/"
		aria-label="Avaleht"
	>
		<img
			src="/logos/ituk_navbar_logo.svg"
			alt="ITÜK | TalTechi IT-teaduskonna üliõpilaskogu"
			height="56"
			width="225"
		/>
	</a>

	<!-- Desktop nav (≥1280px / xl): All buttons -->
	<div class="items-center gap-8 hidden xl:flex">
		<Button
			variant="tertiary"
			size="lg"
			text={m.navbar_aboutus()}
			to="/meist"
		/>
		<Button
			variant="tertiary"
			size="lg"
			text={m.navbar_events()}
			to="/uritused"
		/>
		<Button
			variant="tertiary"
			size="lg"
			text={m.navbar_partners()}
			to="/partnerlus"
		/>
		<Button
			variant="tertiary"
			size="lg"
			text={m.navbar_rent()}
			to="/rent"
		/>
		<Button
			variant="primary"
			size="lg"
			text={m.navbar_join()}
			to="https://liitu.ituk.ee/"
		/>
		<LanguageSwitcher />
	</div>

	<!-- Tablet/Mobile nav (<1280px): Join (md+), Language, Hamburger -->
	<div class="items-center gap-8 flex xl:hidden">
		<Button
			variant="primary"
			size="lg"
			text={m.navbar_join()}
			to="https://liitu.ituk.ee/"
			class="hidden md:flex"
		/>
		<LanguageSwitcher />
		<!-- Hamburger Menu -->
		<button
			class="flex flex-col justify-center items-center w-10 h-10 cursor-pointer"
			onclick={toggleMenu}
			aria-label={isMenuOpen ? "Sulge menüü" : "Ava menüü"}
		>
			<span
				class="block w-6 h-0.5 bg-white transition-all duration-300 {isMenuOpen
					? 'rotate-45 translate-y-1.5'
					: ''}"
			></span>
			<span
				class="block w-6 h-0.5 bg-white my-1 transition-all duration-300 {isMenuOpen
					? 'opacity-0'
					: ''}"
			></span>
			<span
				class="block w-6 h-0.5 bg-white transition-all duration-300 {isMenuOpen
					? '-rotate-45 -translate-y-1.5'
					: ''}"
			></span>
		</button>
	</div>

	<!-- Mobile menu overlay -->
	{#if isMenuOpen}
		<div
			class="fixed inset-0 top-[88px] bg-background/95 z-[60] flex flex-col items-center justify-center gap-8"
			onclick={toggleMenu}
			onkeydown={(e) => e.key === "Escape" && toggleMenu()}
			role="button"
			tabindex="0"
		>
			<Button
				variant="tertiary"
				size="lg"
				text={m.navbar_aboutus()}
				to="/meist"
			/>
			<Button
				variant="tertiary"
				size="lg"
				text={m.navbar_events()}
				to="/uritused"
			/>
			<Button
				variant="tertiary"
				size="lg"
				text={m.navbar_partners()}
				to="/partnerlus"
			/>
			<Button
				variant="tertiary"
				size="lg"
				text={m.navbar_rent()}
				to="/rent"
			/>
			<Button
				variant="primary"
				size="lg"
				text={m.navbar_join()}
				to="https://liitu.ituk.ee/"
				class="md:hidden"
			/>
		</div>
	{/if}
</header>
