<script lang="ts">
    interface Props {
        text?: string;
        variant?: "primary" | "secondary" | "tertiary";
        size?: "sm" | "md" | "lg";
        disabled?: boolean;
        to?: string;
        href?: string;
        ariaLabel?: string;
        class?: string;
        type?: "button" | "submit" | "reset";
        onclick?: (event: MouseEvent) => void;
    }

    let {
        text,
        variant = "primary",
        size = "md",
        disabled = false,
        to,
        href,
        ariaLabel,
        class: className = "",
        type = "button",
        onclick,
        children,
    }: Props & { children?: import("svelte").Snippet } = $props();

    const sizeClasses: Record<string, string> = {
        sm: "min-w-24 px-3 py-1.5 btn-sm",
        md: "min-w-24 px-4 py-2 btn-md",
        lg: "min-w-24 px-6 py-3 btn-lg",
    };

    const variantClasses: Record<string, string> = {
        primary:
            "bg-primary text-white hover:brightness-[1.2] active:brightness-[0.7]",
        secondary:
            "bg-transparent border-4 border-primary text-white hover:bg-primary/20 active:bg-primary/30",
        tertiary:
            "bg-transparent text-white hover:bg-primary/20 active:bg-primary/30",
    };

    const baseClasses = $derived(`
		flex justify-center items-center
		button-text uppercase
		rounded overflow-hidden
		transition-all duration-150 ease-in-out
		${sizeClasses[size]}
		${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
		${className}
	`);

    const combinedClasses = $derived(
        `${baseClasses} ${disabled ? "opacity-30" : variantClasses[variant]}`,
    );

    const isExternal = $derived(
        to?.startsWith("http://") || to?.startsWith("https://"),
    );
</script>

{#if to}
    {#if isExternal}
        <a
            class={combinedClasses}
            aria-label={ariaLabel || text}
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            onclick={disabled ? (e) => e.preventDefault() : onclick}
        >
            {#if children}{@render children()}{:else}{text}{/if}
        </a>
    {:else}
        <a
            class={combinedClasses}
            aria-label={ariaLabel || text}
            href={to}
            onclick={disabled ? (e) => e.preventDefault() : onclick}
        >
            {#if children}{@render children()}{:else}{text}{/if}
        </a>
    {/if}
{:else if href}
    <a
        class={combinedClasses}
        aria-label={ariaLabel || text}
        {href}
        download
        onclick={disabled ? (e) => e.preventDefault() : onclick}
    >
        {#if children}{@render children()}{:else}{text}{/if}
    </a>
{:else}
    <button
        class={combinedClasses}
        aria-label={ariaLabel || text}
        {onclick}
        {type}
        {disabled}
    >
        {#if children}{@render children()}{:else}{text}{/if}
    </button>
{/if}
