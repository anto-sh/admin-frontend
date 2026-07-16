import { apiClient } from './client'
import type {  FileDataDto } from './types'
import type { ApiResponse } from '@anto-sh/admin-network-shared'

export const videoApi = {
  async upload(video: File): Promise<ApiResponse<FileDataDto>> {
    const formData = new FormData()
    formData.append('video', video)

    const { data: response } = await apiClient.post(
      import.meta.env.VITE_API_VIDEO_UPLOAD_ENDPOINT,
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
