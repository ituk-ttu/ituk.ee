<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    text: string;
    ariaLabel?: string;
    active?: boolean;
    to?: string; // Internal navigation path
    href?: string; // External link
}>();

const handleClick = () => {
    if (props.href) {
        window.location.href = props.href; // Redirect to external link
    } else if (props.to) {
        router.push(props.to); // Internal navigation
    }
};
</script>

<template>
    <button :class="[
        'min-w-32 h-12 bg-transparent box-border border-b-4 flex justify-center items-center transition-colors duration-150 button-text',
        active
            ? 'border-primary text-primary'
            : 'border-transparent text-white hover:border-white focus:border-white focus:text-white disabled:border-gray disabled:text-gray disabled:cursor-not-allowed'
    ]" :aria-label="props.ariaLabel || props.text" @click.prevent="handleClick">
        <p class="button-text">{{ props.text }}</p>
    </button>
</template>