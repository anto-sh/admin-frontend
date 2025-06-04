<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import MainMenu from '@/features/main-menu/ui/MainMenu.vue'
import { useToastWatcher } from '@/shared/composables/useToastWatcher'
import Toast from 'primevue/toast'

const pageTitle = ref('Админ-панель')
provide('pageTitle', pageTitle)

useToastWatcher()
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <MainMenu />
    </aside>
    <main class="main-content">
      <Toast />
      <header class="bg-blue-200/20 p-2 mb-10">
        <h1 class="text-4xl font-bold">{{ pageTitle }}</h1>
      </header>
      <RouterView />
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
  position: sticky;
  top: 0;
  height: 100vh;
  min-width: 250px;
  max-width: 400px;
  z-index: 1;
  overflow-y: auto;
  background: var(--p-navigation-item-focus-background);
  padding: 1rem;
}

.main-content {
  overflow: auto;
  padding: 1rem 2rem;
}
</style>
