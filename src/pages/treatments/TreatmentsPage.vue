<script setup lang="ts">
import TreatmentsList from '@/features/treatments-list/ui/TreatmentsList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Список "Что лечим"')
</script>
<template>
  <TreatmentsList />
</template>

<style lang="scss" scoped></style>
