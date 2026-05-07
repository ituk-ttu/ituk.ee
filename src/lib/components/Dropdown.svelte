<script lang="ts">
    interface Option {
        value: string;
        label: string;
    }

    interface Props {
        label?: string;
        value?: string;
        options: Option[];
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        error?: string;
        onchange?: (value: string) => void;
    }

    let {
        label = "",
        value = $bindable(""),
        options,
        placeholder = "Vali...",
        required = false,
        disabled = false,
        error = "",
        onchange,
    }: Props = $props();

    let isOpen = $state(false);
    let dropdownRef: HTMLDivElement;

    const selectedLabel = $derived(
        options.find((opt) => opt.value === value)?.label || placeholder,
    );

    function handleSelect(optionValue: string) {
        value = optionValue;
        isOpen = false;
        onchange?.(optionValue);
    }

    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            isOpen = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="flex flex-col gap-2 w-full" bind:this={dropdownRef}>
    {#if label}
        <span class="text-sm font-medium text-white">
            {#if required}<span class="text-primary">* </span>{/if}{label}
        </span>
    {/if}
    <div class="relative">
        <button
            type="button"
            {disabled}
            onclick={() => (isOpen = !isOpen)}
            class="w-full px-4 py-3 bg-white/5 font-noto text-white rounded-lg
                flex items-center justify-between gap-2
                focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200
                {error ? 'border-red-500' : ''}
                {isOpen ? 'border-primary ring-1 ring-primary' : ''}"
        >
            <span class={value ? "text-white" : "text-white/40"}>
                {selectedLabel}
            </span>
            <svg
                class="w-4 h-4 text-white/60 transition-transform duration-200 {isOpen
                    ? 'rotate-180'
                    : ''}"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>

        {#if isOpen}
            <div
                class="absolute z-50 w-full mt-1 bg-background border border-white/20 rounded-lg overflow-hidden"
            >
                <div class="max-h-60 overflow-y-auto">
                    {#each options as option}
                        <button
                            type="button"
                            onclick={() => handleSelect(option.value)}
                            class="w-full px-4 py-3 bg-white/5 font-noto text-white text-left hover:bg-white/10 transition-colors
                                {option.value === value
                                ? 'bg-primary/20 text-primary'
                                : ''}"
                        >
                            {option.label}
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
    {#if error}
        <span class="text-xs text-red-500">{error}</span>
    {/if}
</div>
