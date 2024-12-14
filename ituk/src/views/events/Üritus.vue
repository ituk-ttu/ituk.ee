<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useRoute } from 'vue-router';
import { eventData } from '@/data/eventData.js';
import LinkButton from '@/components/buttons/PrimaryButton.vue';
import GalleryCard from '@/components/cards/GalleryCard.vue';
import GalleryOverlay from '@/components/cards/GalleryOverlay.vue';

const route = useRoute();
const eventName = route.params.eventName;
const event = eventData.find(e => e.path === eventName);

if (!event) {
    throw new Error(`Event not found: ${eventName}`);
}

const galleryStates = ref<Record<string, { isOpen: boolean; currentIndex: number }>>({
    mainGallery: { isOpen: false, currentIndex: 0 },
});

const setupScrollLock = (lock: boolean) => {
    document.body.style.overflow = lock ? 'hidden' : '';
};

const openOverlay = (galleryKey: string, index: number) => {
    galleryStates.value[galleryKey].isOpen = true;
    galleryStates.value[galleryKey].currentIndex = index;
    setupScrollLock(true);
};

const closeOverlay = (galleryKey: string) => {
    galleryStates.value[galleryKey].isOpen = false;
    setupScrollLock(false);
};

const updateIndex = (galleryKey: string, index: number) => {
    galleryStates.value[galleryKey].currentIndex = index;
};
</script>

<template>
    <div class="w-full px-8 flex-col img-button justify-center items-center flex relative group">
        <div :style="{ backgroundImage: `url(${event.bannerImage})` }" class="absolute inset-0 bg-cover bg-center">
        </div>
        <div class="absolute inset-0 bg-black/50"></div>
        <h1 class="relative text-white text-center z-10">{{ event.title }}</h1>
    </div>

    <div class="main-container main-padding">
        <div class="self-stretch h-full flex-col justify-start items-start gap-16 flex">
            <div class="self-stretch h-full flex-col justify-start items-start gap-8 flex">
                <!-- Date -->
                <h2>Toimub: {{ event.date || 'No date provided.' }}</h2>

                <!-- Description -->
                <p>{{ event.description || 'No description provided.' }}</p>

                <!-- Links -->
                <h2>Varasemad üritused</h2>
                <div v-if="event.links && event.links.length > 0"
                    class="self-stretch justify-start items-start gap-8 inline-flex">
                    <LinkButton v-for="link in event.links" :key="link.year" :text="link.year" :href="link.link" />
                </div>
                <p v-else>No links provided.</p>

                <!-- Gallery -->
                <h2>Galerii</h2>
                <div v-if="event.galleryImages && event.galleryImages.length > 0"
                    class="grid min-w-full grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] items-start gap-16">
                    <GalleryCard v-for="(image, index) in event.galleryImages" :key="`mainGallery-${index}`"
                        :index="index" :image-src="image.src" :card-name="image.name"
                        @open-overlay="() => openOverlay('mainGallery', index)" />
                </div>
                <p v-else>No images provided.</p>

                <GalleryOverlay v-if="galleryStates['mainGallery'].isOpen" :photos="event.galleryImages"
                    :currentIndex="galleryStates['mainGallery'].currentIndex"
                    :isOpen="galleryStates['mainGallery'].isOpen" @close-overlay="() => closeOverlay('mainGallery')"
                    @update-index="(index) => updateIndex('mainGallery', index)" />
            </div>
        </div>
    </div>
</template>