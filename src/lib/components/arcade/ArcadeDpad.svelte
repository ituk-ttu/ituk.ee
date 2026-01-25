<script lang="ts">
    interface Props {
        onUp?: () => void;
        onDown?: () => void;
        onLeft?: () => void;
        onRight?: () => void;
    }

    let { onUp, onDown, onLeft, onRight }: Props = $props();

    const btnClass =
        "font-['ArcadeClassic',monospace] w-12 h-12 bg-black text-white border-2 border-white text-xl cursor-pointer flex items-center justify-center touch-manipulation active:bg-white active:text-black";
</script>

<div
    class="flex flex-col items-center gap-1 sm:hidden touch-manipulation select-none"
>
    <button onclick={onUp} class={btnClass} aria-label="Up">▲</button>
    <div class="flex gap-1">
        <button onclick={onLeft} class={btnClass} aria-label="Left">◀</button>
        <div class="w-12 h-12"></div>
        <button onclick={onRight} class={btnClass} aria-label="Right">▶</button
        >
    </div>
    <button onclick={onDown} class={btnClass} aria-label="Down">▼</button>
</div>
