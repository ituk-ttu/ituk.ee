<script lang="ts">
    interface Props {
        title: string;
        subtitle?: string;
        image?: string;
        selected?: boolean;
        onclick?: () => void;
    }

    let {
        title,
        subtitle = "",
        image = "/ituk_placeholder.jpg",
        selected = false,
        onclick,
    }: Props = $props();
</script>

<button
    type="button"
    class="w-full text-left rounded-lg overflow-hidden transition-all duration-200"
    {onclick}
>
    <div
        class="flex items-center gap-3 p-2 {selected
            ? 'bg-primary'
            : 'bg-white/5 hover:bg-white/10'}"
    >
        <img
            src={image || "/ituk_placeholder.jpg"}
            alt={title}
            class="w-12 h-12 rounded object-cover shrink-0"
        />
        <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">{title || "Nimeta"}</p>
            {#if subtitle}
                <p class="text-xs text-white/60 truncate">{subtitle}</p>
            {/if}
        </div>
    </div>
</button>
