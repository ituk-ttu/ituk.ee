import './assets/main.css';
import translations from '@/locales';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';

const i18n = createI18n({
    locale: 'et',
    fallbackLocale: 'et',
    messages: translations,
});

const app = createApp(App);

app.use(router).use(i18n).mount('#app');