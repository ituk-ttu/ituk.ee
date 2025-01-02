<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue';
import SecondaryButton from '@/components/buttons/SecondaryButton.vue';
</script>

<template>
    <div class="w-screen main-height bg-dark px-[10%] justify-between items-end flex">
        <div class="main-height w-full 2xl:w-1/2 pb-16 flex-col justify-center items-start gap-16 inline-flex">
            <div class="bg-primary shadow-filled px-2 justify-center items-center inline-flex">
                <h1 class="big">>itük_</h1>
            </div>
            <h3>{{ $t('welcome') }}</h3>
            <div class="justify-start items-start gap-8 inline-flex">
                <PrimaryButton href="https://liitu.ituk.ee/" :text="$t('joinFromHome')" />
                <SecondaryButton to="/about" :text="$t('aboutFromHome')" />
            </div>
        </div>
        <div class="main-height w-1/2 justify-end items-end hidden 2xl:flex">
            <img src="@/assets/images/tux_cover.png" alt="Maskott Tux" />
        </div>
    </div>
</template>