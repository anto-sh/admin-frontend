import { useExpertCategoryStore } from '@/entities/expert-category/store'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useConfirm, type FileUploadSelectEvent } from 'primevue'
import { useExpertStore } from '@/entities/expert/store'
import type { OutputData } from '@editorjs/editorjs'
import { useRoute, useRouter } from 'vue-router'
import type { EditorJsWrapperExposed } from '@/features/editorjs-wrapper/types'
import type { ComponentPublicInstance } from 'vue'
import { StringBoolean } from '@/shared/enums/common'
import { imageApi } from '@/shared/api/image'

export function useExpertEditorModel() {
  const expertCategoryStore = useExpertCategoryStore()
  const expertStore = useExpertStore()
  const confirmService = useConfirm()
  const router = useRouter()
  const route = useRoute()
  const editorjsRef = useTemplateRef<EditorJsWrapperExposed & ComponentPublicInstance>('editorjs')

  const expertId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === StringBoolean.True
  const formData = ref({
    fullName: '',
    description: '',
    imageUrl: '',
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
    contentJson: {} as OutputData | undefined,
  })
  const isShowEditorJs = ref(false)

  const categoriesSelectList = computed(() =>
    expertCategoryStore.expertCategories.map((ec) => ({
      id: ec.id,
      name: ec.name,
    })),
  )

  onMounted(async () => {
    await expertCategoryStore.fetchExpertCategories()
    if (expertId) {
      const { data } = await expertStore.fetchExpertById(expertId)
      if (data)
        formData.value = {
          fullName: data.fullName,
          description: data.description,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId,
          contentJson: data.contentJson,
        }
    }
    isShowEditorJs.value = true
  })

  const uploadExpertImage = async (event: FileUploadSelectEvent) => {
    const response = await imageApi.upload(event.files[0])
    formData.value.imageUrl = response.file.url
  }

  const saveExpert = async () => {
    const editorjsContent = await editorjsRef.value?.saveAndGetEditorJsContent()
    formData.value.contentJson = editorjsContent
    if (expertId) await expertStore.updateExpert(expertId, formData.value)
    else await expertStore.addExpert(formData.value)
    router.push({
      name: 'experts',
    })
  }

  const cancelEditor = () => {
    router.push({
      name: 'experts',
    })
  }

  const confirmDeleteExpert = (event: MouseEvent) => {
    confirmService.require({
      target: event.target as HTMLElement,
      message: `Вы уверены, что хотите удалить специалиста?`,
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
        await expertStore.deleteExpert(expertId)
        router.push({
          name: 'experts',
        })
      },
    })
  }

  return {
    expertId,
    readonly,
    formData,
    categoriesSelectList,
    isShowEditorJs,
    uploadExpertImage,
    saveExpert,
    cancelEditor,
    confirmDeleteExpert,
  }
}
