<script lang="ts">
	import * as m from "$lib/paraglide/messages";

	const currentYear = new Date().getFullYear();
</script>

<footer
	class="z-50 w-full py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,4vw,4rem)] bg-background shadow-filled flex flex-col sm:flex-row flex-wrap justify-between items-center gap-8 sm:gap-16"
>
	<!-- Contact Info -->
	<div class="flex flex-col gap-4 items-start">
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>mail</span
			>
			<a
				href="mailto:kontakt@ituk.ee"
				class="font-bold underline hover:decoration-primary"
			>
				kontakt@ituk.ee
			</a>
		</div>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>call</span
			>
			<a
				href="tel:+37258517633"
				class="font-bold underline hover:decoration-primary"
			>
				+372 5851 7633
			</a>
		</div>
		<div class="flex items-center gap-2">
			<span class="material-symbols-outlined text-white text-xl"
				>location_on</span
			>
			<a
				href="https://www.google.com/maps/place/TalTech+IT+College/@59.3954482,24.6617187,17z"
				class="font-bold underline hover:decoration-primary"
			>
				ICO-210, Raja 4c, Tallinn
			</a>
		</div>
	</div>

	<!-- Organization Data -->
	<div class="flex flex-col gap-4 items-center text-center">
		<p class="font-bold">MTÜ FOR Tsükkel</p>
		<p class="font-bold">Registrikood: 80391807</p>
		<p class="font-bold">LHV EE617700771002582855</p>
	</div>

	<!-- Social Media & Links -->
	<div class="flex flex-col gap-4 items-end">
		<div class="flex items-center gap-6">
			<a
				href="https://www.facebook.com/ituk.taltech/"
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
				href="https://www.instagram.com/ituk.taltech/"
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
				href="https://www.github.com/ituk-ttu/"
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
		</div>
		<div class="flex items-center justify-between w-full gap-6">
			<a
				href="https://hub.ituk.ee/"
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
