<script setup lang="ts">
import ExerciseCategoriesList from '@/features/exercise-categories-list/ui/ExerciseCategoriesList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Категории упражнений')
</script>
<template>
  <ExerciseCategoriesList />
</template>

<style lang="scss" scoped></style>
