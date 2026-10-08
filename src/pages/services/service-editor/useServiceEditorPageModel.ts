import { useServiceCategoryModel } from '@/entities/service-category/model'
import { useServiceModel } from '@/entities/service/model'
import { computed, onMounted, ref } from 'vue'
import { type FileUploadSelectEvent } from 'primevue'
import { useRoute, useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'
import { imageApi } from '@/shared/api/image'

export function useServiceEditorPageModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const serviceModel = useServiceModel()
  const router = useRouter()
  const route = useRoute()

  const serviceId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === STRING_BOOLEAN.True
  const formData = ref({
    name: '',
    imageUrl: '',
    price: undefined as number | undefined,
    procedures: [] as string[],
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
  })

  const categoriesSelectOptions = computed(() =>
    serviceCategoryModel.categories.value.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })),
  )

  onMounted(async () => {
    await serviceCategoryModel.fetchAll()
    if (serviceId) {
      const data = await serviceModel.fetchById(serviceId)
      if (data)
        formData.value = {
          name: data.name,
          imageUrl: data.imageUrl,
          price: data.price,
          procedures: data.procedures,
          categoryId: data.categoryId,
        }
    }
  })

  const addNewProcedure = () => formData.value.procedures.push('')

  const removeProcedure = (index: number) =>
    (formData.value.procedures = formData.value.procedures.filter((p, i) => i !== index))

  const uploadServiceImage = async (event: FileUploadSelectEvent) => {
    const { data: fileData } = await imageApi.upload(event.files[0])
    formData.value.imageUrl = fileData?.url || ''
  }

  const saveService = async () => {
    if (serviceId) await serviceModel.update(serviceId, formData.value)
    else await serviceModel.add(formData.value)
    cancelEditor()
  }

  const deleteService = async () => {
    await serviceModel.delete(serviceId)
    cancelEditor()
  }

  const cancelEditor = () => {
    router.push({
      name: 'services',
    })
  }

  return {
    serviceId,
    readonly,
    formData,
    categoriesSelectOptions,
    addNewProcedure,
    removeProcedure,
    uploadServiceImage,
    saveService,
    deleteService,
    cancelEditor,
  }
}
