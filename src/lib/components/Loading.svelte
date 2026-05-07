<script lang="ts">
    import * as m from "$lib/paraglide/messages";

    interface Props {
        size?: "sm" | "md" | "lg";
        fullHeight?: boolean;
    }

    let { size = "md", fullHeight = false }: Props = $props();

    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-12 h-12 border-4",
        lg: "w-16 h-16 border-4",
    };
</script>

{#if fullHeight}
    <div
        class="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-80px)]"
    >
        <h2>{m.common_loading()}</h2>
        <div
            class="animate-spin rounded-full border-gray/30 border-t-primary {sizeClasses[
                size
            ]}"
        ></div>
    </div>
{:else}
    <div class="flex flex-col items-center justify-center gap-4 py-8">
        <p class="text-white/60">{m.common_loading()}</p>
        <div
            class="animate-spin rounded-full border-gray/30 border-t-primary {sizeClasses[
                size
            ]}"
        ></div>
    </div>
{/if}
