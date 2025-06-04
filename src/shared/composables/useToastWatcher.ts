import { useToast } from 'primevue/usetoast'
import { watch } from 'vue'
import { useToastStore } from '../store/useToastStore'

// инициализация системы уведомлений и наблюдателя для этой системы
// использовать только в script setup
export const useToastWatcher = () => {
  const toastService = useToast()
  const toastStore = useToastStore()

  watch(toastStore.toasts, () => {
    if (toastStore.toasts.length) {
      const toastToShow = toastStore.shiftToast()
      if (toastToShow) toastService.add(toastToShow)
    }
  })
}
