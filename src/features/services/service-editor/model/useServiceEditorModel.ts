import { useServiceCategoryStore } from '@/entities/service-category/store'
import { useServiceStore } from '@/entities/service/store'
import { computed, onMounted, ref } from 'vue'
import { useConfirm, type FileUploadSelectEvent } from 'primevue'
import { useRoute, useRouter } from 'vue-router'
import { StringBoolean } from '@/shared/enums/common'
import { imageApi } from '@/shared/api/image'

export function useServiceEditorModel() {
  const serviceCategoryStore = useServiceCategoryStore()
  const serviceStore = useServiceStore()
  const confirmService = useConfirm()
  const router = useRouter()
  const route = useRoute()

  const serviceId = parseInt(route.params.id as string)
  const readonly = route.query.readonly === StringBoolean.True
  const formData = ref({
    name: '',
    imageUrl: '',
    price: undefined as number | undefined,
    procedures: [] as string[],
    categoryId: parseInt(route.query.categoryId as string) as number | undefined,
  })

  const categoriesSelectList = computed(() =>
    serviceCategoryStore.serviceCategories.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })),
  )

  onMounted(async () => {
    await serviceCategoryStore.fetchServiceCategories()
    if (serviceId) {
      const { data } = await serviceStore.fetchServiceById(serviceId)
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
    const response = await imageApi.upload(event.files[0])
    formData.value.imageUrl = response.file.url
  }

  const saveService = async () => {
    if (serviceId) await serviceStore.updateService(serviceId, formData.value)
    else await serviceStore.addService(formData.value)
    router.push({
      name: 'services',
    })
  }

  const cancelEditor = () => {
    router.push({
      name: 'services',
    })
  }

  const confirmDeleteService = (event: MouseEvent) => {
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
        await serviceStore.deleteService(serviceId)
        router.push({
          name: 'services',
        })
      },
    })
  }

  return {
    serviceId,
    readonly,
    formData,
    categoriesSelectList,
    addNewProcedure,
    removeProcedure,
    uploadServiceImage,
    saveService,
    cancelEditor,
    confirmDeleteService,
  }
}
