import { apiClient } from './client'
import type { FileDataDto } from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const imageApi = {
  async upload(image: File): Promise<ApiResponse<FileDataDto>> {
    const formData = new FormData()
    formData.append('image', image)

    const { data: response } = await apiClient.post(
      import.meta.env.VITE_API_IMAGE_UPLOAD_ENDPOINT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  },
}
