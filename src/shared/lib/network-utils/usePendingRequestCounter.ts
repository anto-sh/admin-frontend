import { useLoadingStateGlobalStore } from '@/shared/store/useLoadingStateGlobalStore'
import { ref } from 'vue'

export function usePendingRequestCounter(
  setIsLoading: (val: boolean) => void,
  isAffectingLoadingGlobalState: boolean,
) {
  const pendingCount = ref(0)

  let loadingGlobalStore: ReturnType<typeof useLoadingStateGlobalStore>
  if (isAffectingLoadingGlobalState) {
    loadingGlobalStore = useLoadingStateGlobalStore()
  }

  function start() {
    pendingCount.value++
    if (pendingCount.value === 1) setIsLoading(true)
    if (isAffectingLoadingGlobalState) loadingGlobalStore.start()
  }

  function finish(num: number = 1) {
    if (pendingCount.value) {
      pendingCount.value = Math.max(0, pendingCount.value - num)
      if (pendingCount.value === 0) setIsLoading(false)
      if (isAffectingLoadingGlobalState) loadingGlobalStore.finish()
    }
  }

  function finishAll() {
    if (pendingCount.value) {
      const countBefore = pendingCount.value
      pendingCount.value = 0
      setIsLoading(false)
      if (isAffectingLoadingGlobalState) loadingGlobalStore.finish(countBefore)
    }
  }

  return {
    pendingCount,
    start,
    finish,
    finishAll,
  }
}
