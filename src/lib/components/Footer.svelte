<script lang="ts">
	import { onMount } from "svelte";
	import * as m from "$lib/paraglide/messages";
	import { getSetting } from "$lib/firebase";

	const currentYear = new Date().getFullYear();

	// Footer settings with defaults
	let contactEmail = $state("kontakt@ituk.ee");
	let contactPhone = $state("+372 5851 7633");
	let contactAddress = $state("ICO-210, Raja 4c, Tallinn");
	let contactAddressLink = $state(
		"https://www.google.com/maps/place/TalTech+IT+College/@59.3954482,24.6617187,17z",
	);
	let orgName = $state("MTÜ FOR Tsükkel");
	let orgRegCode = $state("80391807");
	let orgBankAccount = $state("LHV EE617700771002582855");
	let socialFacebook = $state("https://www.facebook.com/ituk.taltech/");
	let socialInstagram = $state("https://www.instagram.com/ituk.taltech/");
	let socialGithub = $state("https://www.github.com/ituk-ttu/");
	let socialTikTok = $state("https://tiktok.com/@ituk_taltech");
	let hubLink = $state("https://hub3.ituk.ee/");

	onMount(async () => {
		try {
			const [
				savedEmail,
				savedPhone,
				savedAddress,
				savedAddressLink,
				savedOrgName,
				savedOrgRegCode,
				savedOrgBankAccount,
				savedFacebook,
				savedInstagram,
				savedGithub,
				savedTikTok,
				savedHub,
			] = await Promise.all([
				getSetting("contactEmail"),
				getSetting("contactPhone"),
				getSetting("contactAddress"),
				getSetting("contactAddressLink"),
				getSetting("orgName"),
				getSetting("orgRegCode"),
				getSetting("orgBankAccount"),
				getSetting("socialFacebook"),
				getSetting("socialInstagram"),
				getSetting("socialGithub"),
				getSetting("socialTikTok"),
				getSetting("hubLink"),
			]);
			if (savedEmail) contactEmail = savedEmail;
			if (savedPhone) contactPhone = savedPhone;
			if (savedAddress) contactAddress = savedAddress;
			if (savedAddressLink) contactAddressLink = savedAddressLink;
			if (savedOrgName) orgName = savedOrgName;
			if (savedOrgRegCode) orgRegCode = savedOrgRegCode;
			if (savedOrgBankAccount) orgBankAccount = savedOrgBankAccount;
			if (savedFacebook) socialFacebook = savedFacebook;
			if (savedInstagram) socialInstagram = savedInstagram;
			if (savedGithub) socialGithub = savedGithub;
			if (savedTikTok) socialTikTok = savedTikTok;
			if (savedHub) hubLink = savedHub;
		} catch (e) {
			console.error("Error loading footer settings:", e);
		}
	});
</script>

<footer
	class="z-40 w-full py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,4vw,4rem)] bg-background shadow-filled flex flex-col sm:flex-row flex-wrap justify-between items-center gap-8 sm:gap-16"
>
	<!-- Contact Info -->
	<div class="flex flex-col gap-4 items-start">
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>mail</span
			>
			<a
				href="mailto:{contactEmail}"
				class="font-bold underline hover:decoration-primary"
			>
				{contactEmail}
			</a>
		</div>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>call</span
			>
			<a
				href="tel:{contactPhone.replace(/\s/g, '')}"
				class="font-bold underline hover:decoration-primary"
			>
				{contactPhone}
			</a>
		</div>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>location_on</span
			>
			<a
				href={contactAddressLink}
				class="font-bold underline hover:decoration-primary"
			>
				{contactAddress}
			</a>
		</div>
	</div>

	<!-- Organization Data -->
	<div class="flex flex-col gap-4 items-center text-center">
		<p class="font-bold">{orgName}</p>
		<p class="font-bold">Registrikood: {orgRegCode}</p>
		<p class="font-bold">{orgBankAccount}</p>
	</div>

	<!-- Social Media & Links -->
	<div class="flex flex-col gap-4 items-end">
		<div class="flex items-center gap-6">
			<a
				href={socialFacebook}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Facebook"
			>
				<img
					src="/icons/facebook.svg"
					alt="Facebook"
					class="w-6 h-6 hover:opacity-80 transition-opacity"
				/>
			</a>
			<div class="w-[2px] h-6 bg-white"></div>
			<a
				href={socialInstagram}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"
			>
				<img
					src="/icons/instagram.svg"
					alt="Instagram"
					class="w-6 h-6 hover:opacity-80 transition-opacity"
				/>
			</a>
			<div class="w-[2px] h-6 bg-white"></div>
			<a
				href={socialGithub}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
			>
				<img
					src="/icons/github.svg"
					alt="GitHub"
					class="w-6 h-6 hover:opacity-80 transition-opacity"
				/>
			</a>
			<div class="w-[2px] h-6 bg-white"></div>
			<a
					href={socialTikTok}
					target="_blank"
					rel="noopener noreferrer"
					aria-label="TikTok"
			>
				<img
						src="/icons/tiktok.svg"
						alt="TikTok"
						class="w-6 h-6 hover:opacity-80 transition-opacity"
				/>
			</a>

		</div>
		<div class="flex items-center gap-6">
			<a
				href={hubLink}
				target="_blank"
				rel="noopener noreferrer"
				class="font-bold underline hover:decoration-primary"
			>
				HUB
			</a>
			<a
				href="/stiil"
				class="font-bold underline hover:decoration-primary"
			>
				{m.footer_style()}
			</a>
		</div>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-base"
				>copyright</span
			>
			<p class="font-bold">ITÜK 2017-{currentYear}</p>
		</div>
	</div>
</footer>
