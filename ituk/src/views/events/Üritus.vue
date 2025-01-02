<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import eventData from '@/data/eventData.js';

const { t, locale } = useI18n();
const route = useRoute();

const event = eventData.find((e) => e.path === route.params.eventName);

if (!event) {
    throw new Error(`Event not found: ${route.params.eventName}`);
}
</script>

<template>
    <div class="w-full px-8 flex-col img-button justify-center items-center flex relative group">
        <div :style="{ backgroundImage: `url(${event.bannerImage})` }" class="absolute inset-0 bg-cover bg-center">
        </div>
        <div class="absolute inset-0 bg-black/50"></div>
        <h1 class="relative text-white text-center z-10">
            {{ t(`events.${event.translations[locale].title}`) }}
        </h1>
    </div>

    <div class="main-container main-padding">
        <div class="self-stretch h-full flex-col justify-start items-start gap-16 flex">
            <div class="self-stretch h-full flex-col justify-start items-start gap-8 flex">
                <h2>{{ t('eventDate') }}: {{ event.date || t('noDate') }}</h2>
                <p>{{ t(`events.${event.translations[locale].description}`) || t('noDescription') }}</p>

                <h2>{{ t('pastEvents') }}</h2>
                <div v-if="event.links && event.links.length > 0">
                    <LinkButton v-for="link in event.links" :key="link.year" :text="link.year" :href="link.content" />
                </div>
                <p v-else>{{ t('noLinks') }}</p>

                <h2>{{ t('gallery') }}</h2>
                <div v-if="event.images && event.images.length > 0">
                    <GalleryCard v-for="(image, index) in event.images" :key="index" :image-src="image.path" />
                </div>
                <p v-else>{{ t('noImages') }}</p>
            </div>
        </div>
    </div>
</template>