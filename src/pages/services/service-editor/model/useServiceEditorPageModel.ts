import { useServiceCategoryModel } from '@/entities/service-category/model'
import { useServiceModel } from '@/entities/service/model'
import type { CreateServiceDto } from '@/entities/service/types'
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFieldArray, useForm } from 'vee-validate'
import { STRING_BOOLEAN } from '@/shared/enums/common'
import { useToastStore } from '@/shared/store/useToastStore'
import { toTypedSchema } from '@/shared/lib/vee-validate-zod'
import { serviceFormSchema, type ServiceFormInput } from './serviceFormSchema'
import { mapServiceValidationErrors } from './serviceValidationErrors'

export function useServiceEditorPageModel() {
  const serviceCategoryModel = useServiceCategoryModel()
  const serviceModel = useServiceModel()
  const router = useRouter()
  const route = useRoute()
  const { addToast } = useToastStore()

  const serviceId = Number(route.params.id) || null
  const readonly = route.query.readonly === STRING_BOOLEAN.True
  const form = reactive(
    useForm<ServiceFormInput, CreateServiceDto>({
      validationSchema: toTypedSchema(serviceFormSchema),
      initialValues: {
        name: '',
        imageUrl: '',
        price: null,
        procedures: [],
        categoryId: Number(route.query.categoryId) || null,
      },
    }),
  )
  const fieldOptions = () => ({
    validateOnModelUpdate: form.submitCount > 0,
    validateOnBlur: form.submitCount > 0,
    validateOnChange: false,
    validateOnInput: false,
  })
  const defineFormField = <TName extends keyof ServiceFormInput>(name: TName) => {
    const [field, attrs] = form.defineField(name, fieldOptions)
    return { field, attrs }
  }
  const formFields = reactive({
    name: defineFormField('name'),
    categoryId: defineFormField('categoryId'),
    price: defineFormField('price'),
    imageUrl: defineFormField('imageUrl'),
    procedures: useFieldArray<string>('procedures'),
  })
  const editorDisabled = computed(() => readonly || form.isSubmitting)

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
        form.resetForm({
          values: {
            name: data.name,
            imageUrl: data.imageUrl,
            price: data.price,
            procedures: [...data.procedures],
            categoryId: data.categoryId,
          },
        })
    }
  })

  const addNewProcedure = () => formFields.procedures.push('')

  const removeProcedure = (index: number) => formFields.procedures.remove(index)

  const submitService = form.handleSubmit(async (dto) => {
    try {
      if (serviceId) await serviceModel.update(serviceId, dto)
      else await serviceModel.add(dto)
      cancelEditor()
    } catch (error) {
      const validation = mapServiceValidationErrors(error, form.values.procedures.length)
      if (validation) {
        form.setErrors(validation.fieldErrors)
        if (validation.generalErrors.length) {
          addToast({
            severity: 'error',
            summary: 'Не удалось сохранить услугу',
            detail: validation.generalErrors.join('\n'),
            life: 20e3,
          })
        }
      } else throw error
    }
  })

  const saveService = (event?: Event) => {
    if (editorDisabled.value) return
    return submitService(event)
  }

  const deleteService = async () => {
    if (!serviceId) return
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
    form,
    formFields,
    editorDisabled,
    categoriesSelectOptions,
    addNewProcedure,
    removeProcedure,
    saveService,
    deleteService,
    cancelEditor,
  }
}
