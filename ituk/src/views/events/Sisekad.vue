<script setup lang="ts">
import ImageButton from '@/components/buttons/ImageButton.vue';
</script>

<template>
    <div class="main main-height flex flex-col">
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('infoNights')"
                bg-image="src/assets/images/events/infoohtud.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('chills')"
                bg-image="src/assets/images/events/chillid.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('volleyball')"
                bg-image="src/assets/images/events/vorkpall.jpg" to="/:eventName" />
        </div>
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('tournaments')"
                bg-image="src/assets/images/events/sporditurniirid.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('summerDays')"
                bg-image="src/assets/images/events/suvepaevad.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('rectorsCup')"
                bg-image="src/assets/images/events/rektori_karikas.jpg" to="/:eventName" />
        </div>
    </div>
</template>