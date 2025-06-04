import axios, { type AxiosInstance } from 'axios'
import type { ApiResponseDto } from './types'
import { useToastStore } from '../store/useToastStore'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => {
    const { addToast } = useToastStore()
    const data = response.data as ApiResponseDto
    if (data.message && data.status === 'success')
      addToast({
        severity: 'success',
        summary: 'Ура победа!',
        detail: data.message,
        life: 4e3,
      })
    return response
  },
  (error) => {
    const { addToast } = useToastStore()
    const errorRes: ApiResponseDto | undefined = error.response.data
    if (axios.isAxiosError(error)) {
      addToast({
        severity: 'error',
        summary: 'Ошибка запроса',
        detail: `Код: ${error.response?.status} \n Ошибка: ${error.message} \n Сообщение: ${errorRes?.message}`,
        life: 20e3,
      })
    } else {
      addToast({
        severity: 'error',
        summary: 'Неизвестная ошибка',
        detail: error,
        life: 20e3,
      })
    }
    // Пробрасываем ошибку дальше, если нужно обработать в конкретном месте
    return Promise.reject(error)
  },
)

export { apiClient }
