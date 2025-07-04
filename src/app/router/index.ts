import ExerciseCategoriesPage from '@/pages/exercises/ExerciseCategoriesPage.vue'
import ExerciseEditorPage from '@/pages/exercises/ExerciseEditorPage.vue'
import ExercisesListPage from '@/pages/exercises/ExercisesListPage.vue'
import ExpertEditorPage from '@/pages/experts/ExpertEditorPage.vue'
import ExpertsListPage from '@/pages/experts/ExpertsListPage.vue'
import IndexPage from '@/pages/index/IndexPage.vue'
import PricesListPage from '@/pages/prices/PricesListPage.vue'
import ServiceCategoriesPage from '@/pages/services/ServiceCategoriesPage.vue'
import ServiceEditorPage from '@/pages/services/ServiceEditorPage.vue'
import ServicesListPage from '@/pages/services/ServicesListPage.vue'
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

    {
      path: '/service-categories',
      name: 'service-categories',
      component: ServiceCategoriesPage,
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesListPage,
    },
    {
      path: '/service-editor/:id?',
      name: 'service-editor',
      component: ServiceEditorPage,
    },
    {
      path: '/experts',
      name: 'experts',
      component: ExpertsListPage,
    },
    {
      path: '/expert-editor/:id?',
      name: 'expert-editor',
      component: ExpertEditorPage,
    },
    {
      path: '/prices',
      name: 'prices',
      component: PricesListPage,
    },
  ],
})

export default router
