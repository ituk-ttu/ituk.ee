<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        tag?: "p" | "span" | "h1" | "h2" | "h3" | "div";
        class?: string;
        onclick?: () => void;
        children: Snippet;
    }

    // Sizes based on tag
    const tagSizes: Record<string, string> = {
        h1: "text-2xl",
        h2: "text-xl",
        h3: "text-lg",
        p: "text-base",
        div: "text-base",
        span: "text-base",
    };

    let {
        tag = "span",
        class: className = "",
        onclick,
        children,
    }: Props = $props();

    const baseClass = `font-['ArcadeClassic',monospace] tracking-wider font-normal ${tagSizes[tag]}`;
</script>

{#if tag === "p"}
    <p class="{baseClass} {className}" {onclick}>
        {@render children()}
    </p>
{:else if tag === "h1"}
    <h1 class="{baseClass} {className}" {onclick}>
        {@render children()}
    </h1>
{:else if tag === "h2"}
    <h2 class="{baseClass} {className}" {onclick}>
        {@render children()}
    </h2>
{:else if tag === "h3"}
    <h3 class="{baseClass} {className}" {onclick}>
        {@render children()}
    </h3>
{:else if tag === "div"}
    <div class="{baseClass} {className}" {onclick}>
        {@render children()}
    </div>
{:else}
    <span class="{baseClass} {className}" {onclick}>
        {@render children()}
    </span>
{/if}
