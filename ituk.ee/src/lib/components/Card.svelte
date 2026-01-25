<script lang="ts">
	interface Props {
		title: string;
		image: string;
		description?: string;
		type: "default" | "board" | "list" | "timeline";
		email?: string;
		listItems?: string[];
		link?: string;
	}

	let {
		title,
		image,
		description = "",
		type,
		email = "",
		listItems = [],
		link,
	}: Props = $props();

	const contentBg = $derived(
		type === "board" ? "bg-primary/50" : "bg-white/[0.03]",
	);

	// Use placeholder if image is empty or missing
	const imageSrc = $derived(image || "/ituk_placeholder.jpg");
</script>

{#if link}
	<a href={link} target="_blank" rel="noopener noreferrer">
		<div
			class="w-[192px] sm:w-[256px] rounded-lg overflow-hidden flex flex-col"
			class:h-[312px]={type !== "timeline"}
			class:sm:h-[416px]={type !== "timeline"}
		>
			<div class="size-[192px] sm:size-[256px] shrink-0">
				<img
					class="w-full h-full object-cover"
					src={imageSrc}
					alt={title}
				/>
			</div>

			{#if type === "timeline"}
				<div class="w-full p-4 flex flex-col {contentBg}">
					<span
						class="font-raleway font-bold text-sm sm:text-h4 h-[58px]"
						>{title}</span
					>
				</div>
			{:else if type === "list"}
				<div
					class="w-full h-30 sm:h-40 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 {contentBg}"
				>
					<span class="font-raleway font-bold text-sm sm:text-h4"
						>{title}</span
					>
					<ul class="text-xs sm:text-base">
						{#each listItems as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{:else}
				<div
					class="w-full h-30 sm:h-40 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 {contentBg}"
				>
					<span class="font-raleway font-bold text-sm sm:text-h4"
						>{title}</span
					>
					<span class="text-xs sm:text-base">{description}</span>
				</div>
			{/if}
		</div>
	</a>
{:else}
	<div
		class="w-[192px] sm:w-[256px] rounded-lg overflow-hidden flex flex-col"
		class:h-[312px]={type !== "timeline"}
		class:sm:h-[416px]={type !== "timeline"}
	>
		<div class="size-[192px] sm:size-[256px] shrink-0">
			<img
				class="w-full h-full object-cover"
				src={imageSrc}
				alt={title}
			/>
		</div>

		{#if type === "timeline"}
			<div class="w-full p-4 flex flex-col {contentBg}">
				<span class="font-raleway font-bold text-sm sm:text-h4 h-[58px]"
					>{title}</span
				>
			</div>
		{:else if type === "board"}
			<div
				class="w-full h-30 sm:h-40 p-3 sm:p-4 flex flex-col justify-between {contentBg}"
			>
				<div class="flex flex-col gap-1.5 sm:gap-2">
					<span class="font-raleway font-bold text-sm sm:text-h4"
						>{title}</span
					>
					<span class="text-xs sm:text-base">
						{description}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="material-symbols-outlined text-white"
						>mail</span
					>
					<a
						class="text-xs sm:text-base font-bold underline hover:decoration-primary"
						href="mailto:{email}"
					>
						{email}
					</a>
				</div>
			</div>
		{:else if type === "list"}
			<div
				class="w-full h-30 sm:h-40 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 {contentBg}"
			>
				<span class="font-raleway font-bold text-sm sm:text-h4"
					>{title}</span
				>
				<ul class="text-xs sm:text-base">
					{#each listItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div
				class="w-full h-30 sm:h-40 p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 {contentBg}"
			>
				<span class="font-raleway font-bold text-sm sm:text-h4"
					>{title}</span
				>
				<span class="text-xs sm:text-base">{description}</span>
			</div>
		{/if}
	</div>
{/if}
