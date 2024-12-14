<script setup lang="ts">
import ImageButton from '@/components/buttons/ImageButton.vue';
</script>

<template>
    <div class="main main-height flex flex-col">
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('itap')"
                bg-image="src/assets/images/events/itap.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('gameCamp')"
                bg-image="src/assets/images/events/gamecamp.jpg" to="/:eventName" />
        </div>
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('studyNights')"
                bg-image="src/assets/images/events/opiohtud.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('workshops')"
                bg-image="src/assets/images/events/koolitused.jpg" to="/:eventName" />
        </div>
        <RouterView />
    </div>
</template>