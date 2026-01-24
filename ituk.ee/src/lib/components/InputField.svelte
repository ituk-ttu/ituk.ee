<script lang="ts">
    interface Props {
        label?: string;
        placeholder?: string;
        value?: string;
        type?: "text" | "email" | "password" | "number" | "url";
        required?: boolean;
        disabled?: boolean;
        error?: string;
        oninput?: (e: Event) => void;
    }

    let {
        label = "",
        placeholder = "",
        value = $bindable(""),
        type = "text",
        required = false,
        disabled = false,
        error = "",
        oninput,
    }: Props = $props();
</script>

<label class="flex flex-col gap-1 w-full">
    {#if label}
        <span class="text-sm font-medium text-white">
            {#if required}<span class="text-primary">* </span>{/if}{label}
        </span>
    {/if}
    <input
        {type}
        {placeholder}
        {required}
        {disabled}
        bind:value
        {oninput}
        class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40
			focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
			disabled:opacity-50 disabled:cursor-not-allowed
			transition-colors duration-200"
        class:border-red-500={error}
    />
    {#if error}
        <span class="text-xs text-red-500">{error}</span>
    {/if}
</label>
