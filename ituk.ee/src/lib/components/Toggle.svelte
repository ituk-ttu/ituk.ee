<script lang="ts">
    interface Props {
        checked: boolean;
        onchange: (checked: boolean) => void;
        ariaLabel?: string;
        disabled?: boolean;
    }

    let {
        checked,
        onchange,
        ariaLabel = "Toggle",
        disabled = false,
    }: Props = $props();
</script>

<button
    onclick={() => !disabled && onchange(!checked)}
    class="w-10 h-5 rounded-full transition-all {checked
        ? 'bg-primary'
        : 'bg-gray/30'} {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
    aria-label={ariaLabel}
    role="switch"
    aria-checked={checked}
    {disabled}
>
    <div
        class="w-4 h-4 bg-white rounded-full transition-transform {checked
            ? 'translate-x-5'
            : 'translate-x-0.5'}"
    ></div>
</button>
