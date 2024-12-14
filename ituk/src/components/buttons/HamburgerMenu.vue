<template>
    <button aria-label="Hamburger Menu" class="w-8 h-8 flex flex-col justify-between items-center relative">
        <div :class="[
            'w-8 h-1 bg-white transition-all duration-300 ease-in-out',
            isOpen ? 'rotate-45 translate-y-[15.8px] w-[40px]' : ''
        ]"></div>
        <div :class="[
            'w-8 h-1 bg-white transition-all duration-300 ease-in-out',
            isOpen ? 'opacity-0' : ''
        ]"></div>
        <div :class="[
            'w-8 h-1 bg-white transition-all duration-300 ease-in-out',
            isOpen ? '-rotate-45 -translate-y-[15.8px] w-[40px]' : ''
        ]"></div>
    </button>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    }
};
</script>