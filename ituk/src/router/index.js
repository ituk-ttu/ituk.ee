import { createRouter, createWebHistory } from 'vue-router';
import { eventData } from '@/data/eventData.js';

import Avaleht from '@/views/Avaleht.vue';
import Meist from '@/views/Meist.vue';
import Üritused from '@/views/events/Üritused.vue';
import Kontakt from '@/views/Kontakt.vue';
import Liitu from '@/views/Liitu.vue';
import Stiiliraamat from '@/views/Stiiliraamat.vue';
import Meelelahutus from '@/views/events/Meelelahutus.vue';
import Haridus from '@/views/events/Haridus.vue';
import Sisekad from '@/views/events/Sisekad.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      component: Avaleht,
      meta: { title: 'ITÜK | TalTechi IT-teaduskonna üliõpilaskogu' },
    },
    {
      path: '/meist',
      component: Meist,
      meta: { title: 'Meist | ITÜK' },
    },
    {
      path: '/uritused',
      component: Üritused,
      meta: { title: 'Üritused | ITÜK' },
    },
    {
      path: '/meelelahutus',
      component: Meelelahutus,
      meta: { title: 'Meelelahutuslikud üritused | ITÜK' },
    },
    {
      path: '/haridus',
      component: Haridus,
      meta: { title: 'Hariduslikud üritused | ITÜK' },
    },
    {
      path: '/muud-uritused',
      component: Sisekad,
      meta: { title: 'Sise- ja muud üritused | ITÜK' },
    },
    {
      path: '/:eventName',
      component: () => import('@/views/events/Üritus.vue'),
      meta: { title: ':eventName | ITÜK' },
    },
    {
      path: '/kontakt',
      component: Kontakt,
      meta: { title: 'Kontakt | ITÜK' },
    },
    {
      path: '/liitu',
      component: Liitu,
      meta: { title: 'Liitu | ITÜK' },
    },
    {
      path: '/stiil',
      component: Stiiliraamat,
      meta: { title: 'Stiiliraamat | ITÜK' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  let title = to.meta.title || 'ITÜK';

  if (to.params.eventName) {
    const event = eventData.find(e => e.path === to.params.eventName);

    if (event) {
      title = title.replace(':eventName', event.title);
    } else {
      title = title.replace(':eventName', 'Üritus');
    }
  }

  document.title = title;
  next();
});

export default router;