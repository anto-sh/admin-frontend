import { useExerciseCategoryStore } from '@/entities/exercise-category/store'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useConfirm } from 'primevue'
import { useExerciseStore } from '@/entities/exercise/store'
import type { OutputData } from '@editorjs/editorjs'
import { useRoute, useRouter } from 'vue-router'
import type { EditorJsWrapperExposed } from '@/features/editorjs-wrapper/types'
import type { ComponentPublicInstance } from 'vue'
import { StringBoolean } from '@/shared/enums/common'

export function useExerciseEditorModel() {
  const exerciseCategoryStore = useExerciseCategoryStore()
  const exerciseStore = useExerciseStore()
  const confirmService = useConfirm()
  const router = useRouter()
  const route = useRoute()
  // template ref to editorJsWrapper component
  const editorjsRef = useTemplateRef<EditorJsWrapperExposed & ComponentPublicInstance>('editorjs')

  const exerciseId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === StringBoolean.True
  const formData = ref({
    name: '',
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
    contentJson: {} as OutputData | undefined,
  })
  const isShowEditorJs = ref(false)

  const categoriesSelectList = computed(() =>
    exerciseCategoryStore.exerciseCategories.map((ec) => ({
      id: ec.id,
      name: ec.name,
    })),
  )

  onMounted(async () => {
    await exerciseCategoryStore.fetchExerciseCategories()
    if (exerciseId) {
      const { data } = await exerciseStore.fetchExerciseById(exerciseId)
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
    if (exerciseId) await exerciseStore.updateExercise(exerciseId, formData.value)
    else await exerciseStore.addExercise(formData.value)
    router.push({
      name: 'exercises',
    })
  }

  const cancelEditor = () => {
    router.push({
      name: 'exercises',
    })
  }

  const confirmDeleteExercise = (event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: `Вы уверены?`,
      icon: 'pi pi-exclamation-triangle',
      rejectProps: {
        label: 'Нет',
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: 'Да',
        severity: 'danger',
      },
      accept: async () => {
        await exerciseStore.deleteExercise(exerciseId)
        router.push({
          name: 'exercises',
        })
      },
    })
  }

  return {
    exerciseId,
    readonly,
    formData,
    categoriesSelectList,
    isShowEditorJs,
    saveExercise,
    cancelEditor,
    confirmDeleteExercise,
  }
}
