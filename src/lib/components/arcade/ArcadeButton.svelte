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
    class="font-['ArcadeClassic',monospace] tracking-wider border-2 border-white py-3 px-6 text-lg font-normal cursor-pointer transition-none uppercase disabled:opacity-50 disabled:cursor-not-allowed {active
        ? 'bg-white text-black'
        : 'bg-black text-white hover:bg-white hover:text-black'} {className}"
>
    {@render children()}
</button>
