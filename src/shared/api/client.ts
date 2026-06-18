import axios, { AxiosError } from 'axios'
import type { ApiResponseDto, ValidationError } from './types'
import { useToastStore } from '../store/useToastStore'

const apiClient = axios.create({
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
        detail: data.message || 'Операция успешно выполнена',
        life: 4e3,
      })

    return response
  },
  (error: AxiosError<ApiResponseDto<{ errors: ValidationError[] } | undefined>>) => {
    const { addToast } = useToastStore()

    const errorRes = error.response
    const statusCode = errorRes?.status
    const resData = errorRes?.data

    addToast({
      severity: 'error',
      summary: 'Ошибка запроса',
      detail: `Сообщение: ${resData?.message || ''} \n Код: ${errorRes?.status} \n Ошибка: ${errorRes?.statusText}`,
      life: 20e3,
    })

    switch (statusCode) {
      case 401:
        // заглушка пока нет авторизации
        break
      case 422:
        // заглушка пока нет валидации
        // const validationErrors = errorRes?.data?.data?.errors
        break
    }
    addToast({
      severity: 'error',
      summary: 'Неизвестная ошибка',
      detail: error,
      life: 20e3,
    })

    // Пробрасываем ошибку дальше, на случай, если нужно обработать в конкретном месте
    return Promise.reject(error)
  },
)

export { apiClient }
