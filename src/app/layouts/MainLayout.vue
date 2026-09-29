<script setup lang="ts">
import { ref, provide, watch, nextTick } from 'vue'
import { RouterView } from 'vue-router'
import MainMenu from '@/features/main-menu/ui/MainMenu.vue'
import { useToastWatcher } from '@/shared/composables/useToastWatcher'
import Toast from 'primevue/toast'
import { useLoadingStateGlobalStore } from '@/shared/store/useLoadingStateGlobalStore'
import { storeToRefs } from 'pinia'
import AppLoadingIndicator from '@/shared/ui/app-loading-indicator/AppLoadingIndicator.vue'

const pageTitle = ref('Админ-панель')
provide('pageTitle', pageTitle)

useToastWatcher()

const { isLoading } = storeToRefs(useLoadingStateGlobalStore())

let prevFocusedEl: HTMLElement | null = null
watch(isLoading, async (newVal) => {
  if (newVal) {
    prevFocusedEl = document.activeElement as HTMLElement
  } else {
    // wait dom update to guarantee that inert attr is disabled
    await nextTick()
    if (!prevFocusedEl?.isConnected) return
    prevFocusedEl?.focus()
    prevFocusedEl = null
  }
})
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <MainMenu />
    </aside>
    <main>
      <AppLoadingIndicator :is-show="isLoading" />
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
