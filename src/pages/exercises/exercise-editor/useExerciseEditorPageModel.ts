import { useExerciseCategoryModel } from '@/entities/exercise-category/model'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useExerciseModel } from '@/entities/exercise/model'
import type { OutputData } from '@editorjs/editorjs'
import { useRoute, useRouter } from 'vue-router'
import type { EditorJsWrapperExposed } from '@/features/editorjs-wrapper/types'
import type { ComponentPublicInstance } from 'vue'
import { STRING_BOOLEAN } from '@/shared/enums/common'

export function useExerciseEditorPageModel() {
  const exerciseCategoryModel = useExerciseCategoryModel()
  const exerciseModel = useExerciseModel()
  const router = useRouter()
  const route = useRoute()
  // template ref to editorJsWrapper component
  const editorjsRef = useTemplateRef<EditorJsWrapperExposed & ComponentPublicInstance>('editorjs')

  const exerciseId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === STRING_BOOLEAN.True
  const formData = ref({
    name: '',
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
    contentJson: {} as OutputData | undefined,
  })
  const isShowEditorJs = ref(false)

  const categoriesSelectOptions = computed(() =>
    exerciseCategoryModel.categories.value.map((ec) => ({
      id: ec.id,
      name: ec.name,
    })),
  )

  onMounted(async () => {
    await exerciseCategoryModel.fetchAll()

    if (exerciseId) {
      const data = await exerciseModel.fetchById(exerciseId)

      if (data)
        formData.value = {
          name: data.name,
          categoryId: data.categoryId,
          contentJson: data.contentJson,
        }
    }
    isShowEditorJs.value = true
  })

  const saveExercise = async () => {
    const editorjsContent = await editorjsRef.value?.saveAndGetEditorJsContent()
    formData.value.contentJson = editorjsContent

    if (exerciseId) await exerciseModel.update(exerciseId, formData.value)
    else await exerciseModel.add(formData.value)

    cancelEditor()
  }

  const deleteExercise = async () => {
    await exerciseModel.delete(exerciseId)
    cancelEditor()
  }

  const cancelEditor = () => {
    router.push({
      name: 'exercises',
    })
  }

  return {
    exerciseId,
    readonly,
    formData,
    categoriesSelectOptions,
    isShowEditorJs,
    saveExercise,
    deleteExercise,
    cancelEditor
  }
}
