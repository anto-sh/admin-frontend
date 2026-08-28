import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLoadingGlobalStore = defineStore('active-request-counter-global', () => {
  const pendingCount = ref(0)

  function start() {
    pendingCount.value++
  }

  function finish(num: number = 1) {
    pendingCount.value = Math.max(0, pendingCount.value - num)
  }

  const isLoading = computed(() => !!pendingCount.value)

  return {
    pendingCount,
    isLoading,
    start,
    finish,
  }
})
