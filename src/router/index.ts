import { createRouter, createWebHistory } from 'vue-router'
import CoachesList from '@/views/coaches/CoachesList.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/coaches'
    },
    {
      path: '/coaches',
      name: 'coaches',
      component: CoachesList
    },
    {
      path: '/coaches/:id',
      name: 'coach-detail',
      component: () => import('../views/coaches/CoachDetail.vue'),
      props: true,
      children: [
        {
          path: 'contact',
          name: 'contact-coach',
          component: () => import('../views/requests/ContactCoach.vue')
        }
      ]
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/coaches/CoachRegistration.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/requests/RequestsReceived.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/UserAuth.vue'),
      meta: { requiresUnauth: true }
    },
    {
      path: '/:notFound(.*)',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router
