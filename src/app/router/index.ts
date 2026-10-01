import ExerciseCategoriesPage from '@/pages/exercises/exercise-categories/ExerciseCategoriesPage.vue'
import ExerciseEditorPage from '@/pages/exercises/exercise-editor/ExerciseEditorPage.vue'
import ExercisesListPage from '@/pages/exercises/exercises-list/ExercisesListPage.vue'
import ExpertEditorPage from '@/pages/experts/expert-editor/ExpertEditorPage.vue'
import ExpertsListPage from '@/pages/experts/experts-list/ExpertsListPage.vue'
import IndexPage from '@/pages/index/IndexPage.vue'
import PricesListPage from '@/pages/prices/prices-list/PricesListPage.vue'
import ServiceCategoriesPage from '@/pages/services/service-categories/ServiceCategoriesPage.vue'
import ServiceEditorPage from '@/pages/services/service-editor/ServiceEditorPage.vue'
import ServicesListPage from '@/pages/services/services-list/ServicesListPage.vue'
import TreatmentsListPage from '@/pages/treatments/treatments-list/TreatmentsListPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
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
      component: TreatmentsListPage,
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
