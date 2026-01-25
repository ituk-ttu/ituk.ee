<script lang="ts">
    interface Props {
        label?: string;
        placeholder?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        error?: string;
        rows?: number;
        oninput?: (e: Event) => void;
    }

    let {
        label = "",
        placeholder = "",
        value = $bindable(""),
        required = false,
        disabled = false,
        error = "",
        rows = 4,
        oninput,
    }: Props = $props();
</script>

<label class="flex flex-col gap-2 w-full">
    {#if label}
        <span class="text-sm font-medium text-white">
            {#if required}<span class="text-red">* </span>{/if}{label}
        </span>
    {/if}
    <textarea
        {placeholder}
        {required}
        {disabled}
        {rows}
        bind:value
        {oninput}
        class="w-full px-4 py-3 bg-white/5 font-noto text-white rounded-lg placeholder:text-white/40
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200 resize-y min-h-[100px]"
        class:border-red-500={error}
    ></textarea>
    {#if error}
        <span class="text-xs text-red-500">{error}</span>
    {/if}
</label>
