import { computed, ref, type Ref } from 'vue'
import type { FileUploadSelectEvent } from 'primevue'
import { imageApi } from '@/shared/api/image'

export function useFieldImageUploadModel(
  imageUrl: Ref<string>,
  props: { disabled?: boolean; readonly?: boolean },
) {
  const pendingUploads = ref(0)
  const isUploading = computed(() => pendingUploads.value > 0)

  // @TODO: Move image upload logic and its loading state into an image api repository.
  const uploadImage = async (event: FileUploadSelectEvent) => {
    if (props.disabled || props.readonly) return
    pendingUploads.value++
    try {
      const { data: fileData } = await imageApi.upload(event.files[0])
      imageUrl.value = fileData?.url || ''
    } finally {
      pendingUploads.value--
    }
  }

  return { isUploading, uploadImage }
}
