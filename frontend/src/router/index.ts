import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/host',
      name: 'host',
      component: () => import('../views/HostView.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/PlayView.vue')
    },
    {
      path: '/join/:id',
      name: 'join',
      component: () => import('../views/JoinView.vue')
    }
  ]
})

export default router
