<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Photo {
    src: string;
    name: string;
}

const props = defineProps({
    photos: {
        type: Array as () => Photo[],
        required: true,
    },
    currentIndex: {
        type: Number,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['close-overlay', 'update-index']);

const handleClose = () => {
    emit('close-overlay');
};

const showNextImage = () => {
    if (props.currentIndex < props.photos.length - 1) {
        emit('update-index', props.currentIndex + 1);
    }
};

const showPreviousImage = () => {
    if (props.currentIndex > 0) {
        emit('update-index', props.currentIndex - 1);
    }
};

// Handle Keydown Events
const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
        case 'Escape':
            handleClose();
            // console.log('Escape');
            break;
        case 'ArrowRight':
            showNextImage();
            // console.log('ArrowRight');
            break;
        case 'ArrowLeft':
            showPreviousImage();
            // console.log('ArrowLeft');
            break;
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>


<template>
    <div v-if="isOpen"
        class="p-0 2xl:py-24 2xl:px-8 fixed inset-0 bg-dark/90 z-20 flex flex-row items-center justify-center">
        <!-- Close Button -->
        <button @click.prevent="handleClose" class="pt-8 pr-8 px-4 absolute top-0 right-0">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#EEEEEE" stroke-width="4">
                    <line x1="5" y1="5" x2="27" y2="27" />
                    <line x1="5" y1="27" x2="27" y2="5" />
                </g>
            </svg>
        </button>

        <!-- Left Arrow -->
        <button @click.prevent="showPreviousImage" :disabled="currentIndex === 0" class="m-4 z-30 disabled:opacity-0">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5L10 16L21 27" stroke="#EEEEEE" stroke-width="4" />
            </svg>
        </button>

        <!-- Image and Description -->
        <div class="w-full items-center justify-center gap-8 flex-col flex">
            <img class="w-full h-auto max-w-[100%] max-h-[80vh] object-contain" :src="photos[currentIndex].src"
                :alt="photos[currentIndex].name" />
            <h3 class="text-center">{{ photos[currentIndex].name }}</h3>
        </div>

        <!-- Right Arrow -->
        <button @click.prevent="showNextImage" :disabled="currentIndex === photos.length - 1"
            class="m-4 z-30 disabled:opacity-0">
            <svg class="w-8 xl:w-16 h-8 xl:h-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 27L21 16L10 5" stroke="#EEEEEE" stroke-width="4" />
            </svg>
        </button>
    </div>
</template>