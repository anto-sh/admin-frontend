import { apiClient } from './client'
import type { ApiResponseDto, FileDataDto } from './types'

export const videoApi = {
  async upload(video: File): Promise<ApiResponseDto<FileDataDto>> {
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
