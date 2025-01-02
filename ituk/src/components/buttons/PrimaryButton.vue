<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    text: string;
    ariaLabel?: string;
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
    <button class="min-w-32 h-12 px-8 bg-primary rounded shadow-filled text-white 
        flex justify-center items-center transition-colors duration-150 hover:bg-secondary 
        active:bg-white active:text-primary disabled:bg-gray disabled:text-white disabled:cursor-not-allowed"
        :aria-label="props.ariaLabel || props.text" @click.prevent="handleClick">
        <p class="button-text">{{ props.text }}</p>
    </button>

</template>