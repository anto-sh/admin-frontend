import { useExpertCategoryModel } from '@/entities/expert-category/model'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useConfirm, type FileUploadSelectEvent } from 'primevue'
import { useExpertModel } from '@/entities/expert/model'
import type { OutputData } from '@editorjs/editorjs'
import { useRoute, useRouter } from 'vue-router'
import type { EditorJsWrapperExposed } from '@/features/editorjs-wrapper/types'
import type { ComponentPublicInstance } from 'vue'
import { STRING_BOOLEAN } from '@/shared/enums/common'
import { imageApi } from '@/shared/api/image'

export function useExpertEditorModel() {
  const expertCategoryModel = useExpertCategoryModel()
  const expertModel = useExpertModel()
  const confirmService = useConfirm()
  const router = useRouter()
  const route = useRoute()
  const editorjsRef = useTemplateRef<EditorJsWrapperExposed & ComponentPublicInstance>('editorjs')

  const expertId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === STRING_BOOLEAN.True
  const formData = ref({
    fullName: '',
    description: '',
    imageUrl: '',
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
    contentJson: {} as OutputData | undefined,
  })
  const isShowEditorJs = ref(false)

  const categoriesSelectOptions = computed(() =>
    expertCategoryModel.categories.value.map((ec) => ({
      id: ec.id,
      name: ec.name,
    })),
  )

  onMounted(async () => {
    await expertCategoryModel.fetchAll()

    if (expertId) {
      const data = await expertModel.fetchById(expertId)

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
    const { data: fileData } = await imageApi.upload(event.files[0])

    formData.value.imageUrl = fileData?.url || ''
  }

  const saveExpert = async () => {
    const editorjsContent = await editorjsRef.value?.saveAndGetEditorJsContent()
    formData.value.contentJson = editorjsContent

    if (expertId) await expertModel.update(expertId, formData.value)
    else await expertModel.add(formData.value)

    cancelEditor()
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
        await expertModel.delete(expertId)
        cancelEditor()
      },
    })
  }

  return {
    expertId,
    readonly,
    formData,
    categoriesSelectOptions,
    isShowEditorJs,

    uploadExpertImage,
    saveExpert,
    cancelEditor,
    confirmDeleteExpert,
  }
}
