<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import MainMenu from '@/features/main-menu/ui/MainMenu.vue'
import { useToastWatcher } from '@/shared/composables/useToastWatcher'
import Toast from 'primevue/toast'
import AppSpinner from '@/shared/ui/app-spinner/AppSpinner.vue'
import { useLoadingStateGlobalStore } from '@/shared/store/useLoadingStateGlobalStore'
import { storeToRefs } from 'pinia'

const pageTitle = ref('Админ-панель')
provide('pageTitle', pageTitle)

useToastWatcher()

const { isLoading } = storeToRefs(useLoadingStateGlobalStore())
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <MainMenu />
    </aside>
    <main>
      <AppSpinner :is-show="isLoading" />
      <div class="main-content" :inert="isLoading">
        <Toast />
        <header class="bg-blue-200/20 p-2 mb-10">
          <h1 class="text-4xl font-bold">{{ pageTitle }}</h1>
        </header>
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 4fr;
  height: 100vh;
}

.sidebar {
  min-width: 250px;
  z-index: 1;
  overflow-y: auto;
  background: var(--p-navigation-item-focus-background);
  padding: 1rem;
}

main {
  position: relative;
  overflow: hidden;

  .main-content {
    height: 100%;
    overflow: auto;
    padding: 1rem 2rem;
  }
}
</style>
