import ExerciseCategoriesPage from '@/pages/exercises/ExerciseCategoriesPage.vue'
import ExerciseEditorPage from '@/pages/exercises/ExerciseEditorPage.vue'
import ExercisesListPage from '@/pages/exercises/ExercisesListPage.vue'
import IndexPage from '@/pages/index/IndexPage.vue'
import TreatmentsPage from '@/pages/treatments/TreatmentsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage,
    },
    {
      path: '/treatments',
      name: 'treatments',
      component: TreatmentsPage,
    },
    {
      path: '/exercise-categories',
      name: 'exercise-categories',
      component: ExerciseCategoriesPage,
    },
    {
      path: '/exercises',
      name: 'exercises',
      component: ExercisesListPage,
    },
    {
      path: '/exercise-editor/:id?',
      name: 'exercise-editor',
      component: ExerciseEditorPage,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
