<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    text: string; // Button text
    bgImage: string; // Background image URL
    to: string; // Link to a new page
}>();

const handleClick = () => {
    let route = props.to;

    if (props.text && route.includes(':eventName')) {
        const eventName = props.text
            .toLowerCase()
            .replace(/[õäöüÕÄÖÜ]/g, match => {
                // Replace special characters with their ASCII equivalents
                const replacements: { [key: string]: string } = {
                    'õ': 'o',
                    'ä': 'a',
                    'ö': 'o',
                    'ü': 'u',
                    'Õ': 'O',
                    'Ä': 'A',
                    'Ö': 'O',
                    'Ü': 'U'
                };
                return replacements[match] || match;
            })
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/[\/]/g, '-') // Replace slashes with dashes
            .replace(/[^\w-]/g, '') // Remove any non-word characters (except dashes)
            .replace(/-+/g, '-') // Replace consecutive dashes with a single dash
            .replace(/^-+/, '') // Remove leading dash if any
            .replace(/-+$/, ''); // Remove trailing dash if any
        route = route.replace(':eventName', eventName); // Replace the placeholder with the event name
    }

    if (route) {
        router.push(route); // Navigate to the new page
    }
};
</script>

<template>
    <button @click.prevent="handleClick" :aria-label="text"
        class="w-full px-8 flex-col justify-center items-center flex relative group">
        <div :style="{ backgroundImage: `url(${bgImage})` }" class="absolute inset-0 bg-cover bg-center"></div>

        <div class="absolute inset-0 bg-black/50 group-hover:bg-primary/50 transition-colors duration-150"></div>

        <h1 class="relative text-white z-10">
            {{ props.text }}
        </h1>
    </button>
</template>