<script lang="ts">
    import type { ToastVariant } from "$lib/stores/toast";

    interface Props {
        variant: ToastVariant;
        title: string;
        message: string;
        onDismiss?: () => void;
    }

    let { variant, title, message, onDismiss }: Props = $props();

    const variantStyles: Record<ToastVariant, string> = {
        success: "bg-[#00C853]",
        error: "bg-[#FF4444]",
        warning: "bg-[#FFAB00]",
        info: "bg-[#00A3E0]",
    };

    let bgClass = $derived(variantStyles[variant]);
</script>

<div
    class="w-full max-w-[512px] {bgClass} rounded-lg p-4 flex gap-4 items-start text-[#131313]"
>
    <span class="material-symbols-outlined text-4xl leading-none shrink-0">
        {#if variant === "success"}
            check_circle
        {:else if variant === "error"}
            cancel
        {:else if variant === "warning"}
            error
        {:else}
            info
        {/if}
    </span>
    <div class="flex-1 min-w-0 flex flex-col gap-2">
        <p class="font-heading font-bold text-xl leading-none">{title}</p>
        <p class="text-base leading-tight">{message}</p>
    </div>
    {#if onDismiss}
        <button
            type="button"
            class="shrink-0 hover:opacity-70 transition-opacity"
            onclick={onDismiss}
            aria-label="Dismiss"
        >
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    {/if}
</div>
