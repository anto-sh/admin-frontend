import type { ComputedRef } from 'vue'

export const useUiStateUtilsByDirtyCheck = (dirtyIds: ComputedRef<number[]>) => {
  const isEntityChanged = (id: number) => {
    return dirtyIds.value.includes(id)
  }

  const isUpdateBtnDisabled = (id: number) => {
    return !isEntityChanged(id) || dirtyIds.value.length >= 2
  }

  const isDeleteBtnDisabled = (id: number) => {
    return (!isEntityChanged(id) && dirtyIds.value.length == 1) || dirtyIds.value.length >= 2
  }

  const isBatchBtnDisabled = () => {
    return dirtyIds.value.length < 2
  }

  const isAddBtnDisabled = () => {
    return dirtyIds.value.length > 0
  }

  return {
    isEntityChanged,
    isUpdateBtnDisabled,
    isDeleteBtnDisabled,
    isBatchBtnDisabled,
    isAddBtnDisabled,
  }
}
