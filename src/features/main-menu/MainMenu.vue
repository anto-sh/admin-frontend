<script setup lang="ts">
import { PanelMenu } from 'primevue'
import { menuItems } from './menuItems'
</script>

<template>
  <PanelMenu
    :model="menuItems"
    :pt="{
      panel: '!p-2',
      item: 'my-1',
    }"
    multiple
  >
    <template #item="{ item }">
      <router-link
        v-if="item.route"
        v-slot="{ href, navigate, isActive }"
        :to="item.route"
        custom
      >
        <a
          v-ripple
          @click="navigate"
          :class="isActive ? 'bg-blue-300/20' : ''"
          :href="href"
          class="flex items-center cursor-pointer px-4 py-2 rounded-md"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a
        v-else
        v-ripple
        :href="item.url"
        :target="item.target"
        class="flex items-center cursor-pointer px-4 py-2 rounded-md"
      >
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span
          v-if="item.items"
          class="pi pi-angle-down text-primary ml-auto"
        />
      </a>
    </template>
  </PanelMenu>
</template>
