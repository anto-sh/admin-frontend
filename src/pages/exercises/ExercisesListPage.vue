<script setup lang="ts">
import ExercisesList from '@/features/exercises/exercises-list/ui/ExercisesList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Упражнения')
</script>
<template>
  <ExercisesList/>
</template>

<style lang="scss" scoped></style>
