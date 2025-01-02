<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ImageButton from '@/components/buttons/ImageButton.vue';
import eventData from '@/data/eventData.js';

const { t } = useI18n();
</script>

<template>
    <div class="main main-height">
        <div class="grid grid-cols-[repeat(auto-fit,minmax(33.33vw,1fr))] items-start">
            <ImageButton v-for="(event, index) in eventData" :key="index"
                :text="t(`events.${event.translations[$i18n.locale].title}`)" :bg-image="event.bannerImage"
                :to="`/${event.path}`" class="img-button main-height" />
        </div>
    </div>
</template>