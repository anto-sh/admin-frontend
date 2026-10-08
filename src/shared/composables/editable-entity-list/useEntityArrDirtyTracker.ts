import { assignPropByKey } from '@/shared/utils/assignPropByKey'
import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export const useEntityArrDirtyTracker = <
  TEntity extends { id: number },
  TEditableFields extends keyof TEntity,
>(
  targetArr: Ref<TEntity[]>,
  originalArr: MaybeRefOrGetter<TEntity[]>,
  editableFields: TEditableFields[],
) => {
  const findOriginalById = (id: number) => {
    return toValue(originalArr).find((i) => i.id == id)
  }

  const isEntityDirty = (entity: TEntity, original: TEntity | undefined) => {
    if (!original) return true
    let dirty = false
    for (const key of editableFields) {
      if (entity[key] !== original?.[key]) {
        dirty = true
        break
      }
    }
    return dirty
  }

  const dirtyIds = computed(() => {
    return targetArr.value
      .filter((ta) => {
        const original = findOriginalById(ta.id)
        return isEntityDirty(ta, original)
      })
      .map((ta) => ta.id)
  })

  const cancelChange = (id: number) => {
    const local = targetArr.value.find((pe) => pe.id == id)
    const original = findOriginalById(id)
    if (!local || !original) return
    for (const key of editableFields) {
      assignPropByKey(local, original, key)
    }
  }

  return { dirtyIds, cancelChange }
}
