<script setup lang="ts">
import { ref } from 'vue';
import HamburgerMenu from './buttons/HamburgerMenu.vue';
import JoinButton from './buttons/PrimaryButton.vue';
import NiceButton from './buttons/SecondaryButton.vue';
import PageButton from './buttons/TertiaryButton.vue';
import router from '@/router';

const isMenuOpen = ref(false);

const isActive = (path) => {
    return router.currentRoute.value.path == path;
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
    setupScrollLock();
};

const setupScrollLock = () => {
    document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};
</script>

<template>
    <div class="w-screen min-h-[72px] px-[10%] py-1 bg-dark shadow-main justify-between items-center inline-flex">
        <router-link to="/" class="flex sm:hidden items-center cursor-pointer">
            <img src="@/assets/logos/ituk_navbar_symbol.svg" alt="ITÜK | IT-teaduskonna üliõpilaskogu">
        </router-link>
        <router-link to="/" class="hidden sm:flex items-center cursor-pointer">
            <img src="@/assets/logos/ituk_navbar_logo.svg" alt="ITÜK | IT-teaduskonna üliõpilaskogu">
        </router-link>
        <div class="justify-start items-center gap-16 flex">
            <PageButton class="hidden 2xl:flex" to='/meist' :active="isActive('/meist')" :text="$t('about')" />
            <PageButton class="hidden 2xl:flex" to='/uritused' :active="isActive('/uritused')" :text="$t('events')" />
            <PageButton class="hidden 2xl:flex" to='/kontakt' :active="isActive('/kontakt')" :text="$t('contact')" />
            <JoinButton class="hidden 2xl:flex" href='https://liitu.ituk.ee/' :text="$t('join')" />
            <NiceButton class="hidden 2xl:flex" href='https://hub.ituk.ee/' :text="$t('hub')" />
            <HamburgerMenu class="block 2xl:hidden" :isOpen="isMenuOpen" @click.prevent="toggleMenu" />
        </div>
        <div @click.prevent="toggleMenu" v-if="isMenuOpen"
            class="fixed inset-0 top-[72px] bg-dark/90 z-30 flex flex-col items-center justify-center gap-4">
            <PageButton to='/meist' :active="isActive('/meist')" :text="$t('about')" />
            <PageButton to='/uritused' :active="isActive('/uritused')" :text="$t('events')" />
            <PageButton to='/kontakt' :active="isActive('/kontakt')" :text="$t('contact')" />
            <JoinButton href='https://liitu.ituk.ee/' :text="$t('join')" />
            <NiceButton href='https://hub.ituk.ee/' :text="$t('hub')" />
        </div>
    </div>
</template>