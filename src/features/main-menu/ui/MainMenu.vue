<script setup lang="ts">
import { PanelMenu } from 'primevue'
import { menuItems } from '../model/menuItems'
</script>

<template>
  <PanelMenu
    :model="menuItems"
    multiple
    :pt="{
      panel: '!p-2',
      item: 'my-1',
    }"
  >
    <template #item="{ item }">
      <router-link v-if="item.route" v-slot="{ href, navigate, isActive }" :to="item.route" custom>
        <a
          v-ripple
          class="flex items-center cursor-pointer px-4 py-2 rounded-md"
          :class="isActive ? 'bg-blue-300/20' : ''"
          :href="href"
          @click="navigate"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </router-link>
      <a
        v-else
        v-ripple
        class="flex items-center cursor-pointer px-4 py-2 rounded-md"
        :href="item.url"
        :target="item.target"
      >
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
      </a>
    </template>
  </PanelMenu>
</template>
