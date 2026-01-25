<script lang="ts">
    interface Props {
        value: number;
        min?: number;
        max?: number;
        step?: number;
        onchange?: (value: number) => void;
        ariaLabel?: string;
        disabled?: boolean;
    }

    let {
        value = $bindable(),
        min = 0,
        max = 100,
        step = 1,
        onchange,
        ariaLabel = "Slider",
        disabled = false,
    }: Props = $props();

    function handleChange(e: Event) {
        const target = e.target as HTMLInputElement;
        value = Number(target.value);
        onchange?.(value);
    }
</script>

<input
    type="range"
    {min}
    {max}
    {step}
    {value}
    onchange={handleChange}
    oninput={handleChange}
    class="w-full accent-primary h-2 {disabled
        ? 'opacity-50 cursor-not-allowed'
        : ''}"
    aria-label={ariaLabel}
    {disabled}
/>
