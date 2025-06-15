<script setup lang="ts">
import ExpertsList from '@/features/experts/experts-list/ui/ExpertsList.vue'
import { usePageTitle } from '@/shared/composables/usePageTitle'
usePageTitle('Специалисты')
</script>

<template>
  <ExpertsList />
</template>

<style lang="scss" scoped></style>
