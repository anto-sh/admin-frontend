import { apiClient } from './client'
import type { VideoUploadResponseDto } from './types'

export const videoApi = {
  async upload(video: File): Promise<VideoUploadResponseDto> {
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
