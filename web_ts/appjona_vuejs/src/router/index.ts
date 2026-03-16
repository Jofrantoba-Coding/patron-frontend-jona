// router/index.ts — Definición de rutas
// Solo los View Orchestrators se registran aquí
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/uihome/UiHomeView.vue'),
    },
    {
      path: '/homesesion',
      component: () => import('../views/uihomesesion/UiHomeSessionView.vue'),
      beforeEnter: () => {
        const isAuthenticated = localStorage.getItem('jona_authenticated') === 'true'
        if (!isAuthenticated) return '/login'
      },
    },
    { path: '/', redirect: '/login' },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

export default router
