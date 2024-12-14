<script setup lang="ts">
const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
    cardName: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['open-overlay']);

const handleClick = () => {
    emit('open-overlay', props.index);
};
</script>

<template>
    <button @click="handleClick"
        class="w-full h-full max-h-56 flex-col justify-center items-center flex relative shadow-card">
        <img class="w-full h-full aspect-video object-cover" :src="imageSrc" :alt="cardName" />
    </button>
</template>