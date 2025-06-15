<script setup lang="ts">
import PricesList from '@/features/prices-list/ui/PricesList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Цены')
</script>
<template>
  <PricesList />
</template>

<style lang="scss" scoped></style>
