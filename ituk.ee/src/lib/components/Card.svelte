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
</script>

{#if link}
	<a href={link} target="_blank" rel="noopener noreferrer">
		<div
			class="w-[256px] rounded-lg overflow-hidden flex flex-col hover:scale-[1.02] transition-transform"
			class:h-[416px]={type !== "timeline"}
		>
			<div class="size-[256px] shrink-0">
				<img
					class="w-full h-full object-cover"
					src={image}
					alt={title}
				/>
			</div>
			{#if type === "timeline"}
				<div class="w-full p-3 flex flex-col {contentBg}">
					<h4 class="h-[56px]">{title}</h4>
				</div>
			{:else}
				<div class="w-full h-40 p-3 flex flex-col gap-3 {contentBg}">
					<h4>{title}</h4>
					<p class="text-card">{description}</p>
				</div>
			{/if}
		</div>
	</a>
{:else}
	<div
		class="w-[256px] rounded-lg overflow-hidden flex flex-col"
		class:h-[416px]={type !== "timeline"}
	>
		<div class="size-[256px] shrink-0">
			<img class="w-full h-full object-cover" src={image} alt={title} />
		</div>

		{#if type === "timeline"}
			<div class="w-full p-3 flex flex-col {contentBg}">
				<h4 class="h-[56px]">{title}</h4>
			</div>
		{:else if type === "board"}
			<div
				class="w-full h-40 p-3 flex flex-col justify-between {contentBg}"
			>
				<div class="flex flex-col gap-3">
					<h4>{title}</h4>
					<p class="text-card">{description}</p>
				</div>
				<div class="flex items-center gap-4">
					<span class="material-symbols-outlined text-white text-base"
						>mail</span
					>
					<a
						class="font-bold underline hover:decoration-primary"
						href="mailto:{email}"
					>
						{email}
					</a>
				</div>
			</div>
		{:else if type === "list"}
			<div class="w-full h-40 p-3 flex flex-col gap-3 {contentBg}">
				<h4>{title}</h4>
				<ul class="text-card">
					{#each listItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="w-full h-40 p-3 flex flex-col gap-3 {contentBg}">
				<h4>{title}</h4>
				<p class="text-card">{description}</p>
			</div>
		{/if}
	</div>
{/if}
