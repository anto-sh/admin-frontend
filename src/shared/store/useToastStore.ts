import { defineStore } from 'pinia'
import type { ToastMessageOptions } from 'primevue'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessageOptions[]>([])

  function addToast(toastOptions: ToastMessageOptions) {
    toasts.value.push(toastOptions)
  }
  function shiftToast() {
    return toasts.value.shift()
  }

  return {
    toasts,
    addToast,
    shiftToast,
  }
})
