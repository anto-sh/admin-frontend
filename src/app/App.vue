<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainMenu from '@/features/main-menu/ui/MainMenu.vue'
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <MainMenu />
    </aside>
    <main class="main-content">
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
