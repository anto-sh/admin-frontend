<script setup lang="ts">
import ServicesList from '@/features/services/services-list/ui/ServicesList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Услуги')
</script>
<template>
  <ServicesList />
</template>

<style lang="scss" scoped></style>
