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

<label class="flex flex-col gap-2 w-full">
    {#if label}
        <span class="text-sm font-medium text-white">
            {#if required}<span class="text-red-500">*&nbsp;</span>{/if}{label}
        </span>
    {/if}
    <input
        {type}
        {placeholder}
        {required}
        {disabled}
        bind:value
        {oninput}
        class="w-full px-4 py-3 bg-white/5 font-noto text-white rounded-lg placeholder:text-white/40
            focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200"
        class:border-red-500={error}
    />
    {#if error}
        <span class="text-xs text-red-500">{error}</span>
    {/if}
</label>
