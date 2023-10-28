import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UserDetailsPage.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/UserDetailsPage.vue'),
  },
];

export default routes;
