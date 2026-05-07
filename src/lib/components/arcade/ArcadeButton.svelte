<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        onclick?: () => void;
        active?: boolean;
        class?: string;
        disabled?: boolean;
        children: Snippet;
    }

    let {
        onclick,
        active = false,
        class: className = "",
        disabled = false,
        children,
    }: Props = $props();
</script>

<button
    type="button"
    {onclick}
    {disabled}
    class="font-['ArcadeClassic',monospace] tracking-wider border-2 border-white pt-3 pb-4.5 pl-3 pr-1.5 text-xs font-normal cursor-pointer transition-none uppercase disabled:opacity-50 disabled:cursor-not-allowed {active
        ? 'bg-white text-black'
        : 'bg-black text-white hover:bg-white hover:text-black'} {className}"
>
    {@render children()}
</button>
