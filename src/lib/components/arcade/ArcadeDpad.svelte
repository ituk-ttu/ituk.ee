<script lang="ts">
    interface Props {
        onUp?: () => void;
        onDown?: () => void;
        onLeft?: () => void;
        onRight?: () => void;
    }

    let { onUp, onDown, onLeft, onRight }: Props = $props();

    const btnClass =
        "font-['ArcadeClassic',monospace] w-16 h-16 bg-black text-white border-4 border-white text-xl cursor-pointer flex items-center justify-center touch-manipulation active:bg-white active:text-black";
</script>

<div
    class="flex flex-col items-center sm:hidden touch-manipulation select-none"
>
    <button onclick={onUp} class={btnClass} aria-label="Up">^</button>
    <div class="flex">
        <button onclick={onLeft} class={btnClass} aria-label="Left">&lt;</button
        >
        <div class="w-16 h-16"></div>
        <button onclick={onRight} class={btnClass} aria-label="Right"
            >&gt;</button
        >
    </div>
    <button onclick={onDown} class={btnClass} aria-label="Down">v</button>
</div>
