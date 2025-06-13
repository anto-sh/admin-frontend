<script setup lang="ts">
import ServiceCategoriesList from '@/features/services/service-categories-list/ui/ServiceCategoriesList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Категории услуг')
</script>
<template>
  <ServiceCategoriesList />
</template>

<style lang="scss" scoped></style>
