import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useLoadingStateGlobalStore = defineStore('loading-state-global', () => {
  // async processes counter
  const pendingCount = ref(0)

  function start() {
    pendingCount.value++
  }

  function finish(num: number = 1) {
    const nextCount = Math.max(0, pendingCount.value - num)
    pendingCount.value = nextCount
  }

  let isLoadingUpdateTimeout: ReturnType<typeof setTimeout> | undefined
  const isLoading = ref(false)
  watch(pendingCount, (newVal) => {
    if (newVal === 0) {
      isLoadingUpdateTimeout = setTimeout(() => {
        isLoading.value = false
      }, 200)
    } else {
      clearTimeout(isLoadingUpdateTimeout)
      isLoading.value = true
    }
  })

  return {
    pendingCount,
    isLoading: computed(() => isLoading.value),
    start,
    finish,
  }
})
