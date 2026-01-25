<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { toasts } from "$lib/stores/toast";
    import Toast from "./Toast.svelte";
</script>

<div
    class="fixed top-20 right-4 z-50 flex flex-col gap-3 w-full max-w-[512px] pointer-events-none sm:right-6"
    aria-live="polite"
    aria-label="Notifications"
>
    {#each $toasts as toast, index (toast.id)}
        <div
            class="pointer-events-auto"
            in:fly={{ x: 100, duration: 300 }}
            out:fly={{ x: 100, duration: 200 }}
            animate:flip={{ duration: 300 }}
            style:opacity={index === 3 ? 0.5 : 1}
        >
            <Toast
                variant={toast.variant}
                title={toast.title}
                message={toast.message}
                onDismiss={() => toasts.remove(toast.id)}
            />
        </div>
    {/each}
</div>

<style>
    div[aria-label="Notifications"] {
        padding-right: env(safe-area-inset-right);
    }

    @media (max-width: 540px) {
        div[aria-label="Notifications"] {
            left: 1rem;
            right: 1rem;
            max-width: none;
        }
    }
</style>
