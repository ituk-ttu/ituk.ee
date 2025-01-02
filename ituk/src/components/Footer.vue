<script setup lang="ts">
import { useI18n } from 'vue-i18n';  // Import useI18n to access the i18n instance
import Facebook from './buttons/social/Facebook.vue';
import GitHub from './buttons/social/GitHub.vue';
import Instagram from './buttons/social/Instagram.vue';
import PageButton from './buttons/TertiaryButton.vue';
import router from '@/router';

const { t, locale } = useI18n(); // Destructure `t` for translation and `locale` to set language

// Check if the route is active
const isActive = (path: string) => {
    return router.currentRoute.value.path == path;
};

// Change the language when clicking a link
const changeLanguage = (lang: string) => {
    locale.value = lang; // Change the current language locale
};
</script>

<template>
    <div
        class="w-screen min-h-72 h-full px-32 py-16 bg-dark shadow-filled flex-col justify-between items-center gap-16 flex">
        <div class="justify-start items-center gap-8 flex">
            <Facebook link="https://www.facebook.com/ituk.taltech/" />
            <img src="@/assets/icons/separator.svg" alt="/">
            <Instagram link="https://www.instagram.com/ituk.taltech" />
            <img src="@/assets/icons/separator.svg" alt="/">
            <GitHub link="https://github.com/ituk-ttu/" />
        </div>
        <div class="flex-col sm:flex-row justify-center items-center gap-12 flex">
            <p>
                <a class="underline cursor-pointer" to="#" @click.prevent="changeLanguage('en')">{{ $t('english')
                    }}</a>&nbsp;/&nbsp;<a class="underline cursor-pointer" to="#"
                    @click.prevent="changeLanguage('et')">{{
                        $t('estonian') }}</a>
            </p>
            <p class="button-text">©&nbsp;ITÜK&nbsp;2016-2024</p>
            <PageButton to='/style' :active="isActive('/style')" :text="$t('style')" />
        </div>
    </div>
</template>