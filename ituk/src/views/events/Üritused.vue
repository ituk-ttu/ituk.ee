<script setup lang="ts">
import ImageButton from '@/components/buttons/ImageButton.vue';
</script>

<template>
    <div class="main-height flex flex-col 2xl:flex-row">
        <ImageButton class="img-button 2xl:main-height" :text="$t('entertainment')"
            bg-image="src/assets/images/events/meelelahutus.jpg" to="/meelelahutus" />
        <ImageButton class="img-button 2xl:main-height" :text="$t('education')"
            bg-image="src/assets/images/events/haridus.jpg" to="/haridus" />
        <ImageButton class="img-button 2xl:main-height" :text="$t('other')"
            bg-image="src/assets/images/events/sisekad.jpg" to="/muud-uritused" />
        <RouterView />
    </div>
</template>