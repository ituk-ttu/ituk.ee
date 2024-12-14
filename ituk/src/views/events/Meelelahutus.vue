<script setup lang="ts">
import ImageButton from '@/components/buttons/ImageButton.vue';
</script>

<template>
    <div class="main main-height flex flex-col">
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('hazing')"
                bg-image="src/assets/images/events/ristimine.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('ddit')"
                bg-image="src/assets/images/events/ddit.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('studentBar')"
                bg-image="src/assets/images/events/tudengibaar.jpg" to="/:eventName" />
        </div>
        <div class="flex flex-col 2xl:flex-row">
            <ImageButton class="img-button 2xl:main-height" :text="$t('elves')"
                bg-image="src/assets/images/events/pakapikud.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('eSport')"
                bg-image="src/assets/images/events/esport.jpg" to="/:eventName" />
            <ImageButton class="img-button 2xl:main-height" :text="$t('springSport')"
                bg-image="src/assets/images/events/kevadsport.jpg" to="/:eventName" />
        </div>
    </div>
</template>