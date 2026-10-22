import { useServiceCategoryModel } from '@/entities/service-category/model'
import { useServiceModel } from '@/entities/service/model'
import type { CreateServiceDto } from '@/entities/service/types'
import { computed, onMounted, ref } from 'vue'
import { type FileUploadSelectEvent } from 'primevue'
import { useRoute, useRouter } from 'vue-router'
import { STRING_BOOLEAN } from '@/shared/enums/common'
import { imageApi } from '@/shared/api/image'
import { useToastStore } from '@/shared/store/useToastStore'

type ServiceFormData = Omit<CreateServiceDto, 'price' | 'categoryId'> & {
  price: number | null
  categoryId: number | null
}

export function useServiceEditorPageModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const serviceModel = useServiceModel()
  const router = useRouter()
  const route = useRoute()
  const { addToast } = useToastStore()

  const serviceId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === STRING_BOOLEAN.True
  const formData = ref<ServiceFormData>({
    name: '',
    imageUrl: '',
    price: null,
    procedures: [],
    categoryId: Number(route.query.categoryId) || null,
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
    const { price, categoryId } = formData.value
    if (price == null || categoryId == null) {
      addToast({
        severity: 'warn',
        summary: 'Недостаточно данных',
        detail: 'Укажите стоимость и выберите категорию услуги.',
        life: 4e3,
      })
      return
    }

    const dto: CreateServiceDto = { ...formData.value, price, categoryId }
    if (serviceId) await serviceModel.update(serviceId, dto)
    else await serviceModel.add(dto)
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
