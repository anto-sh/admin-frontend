import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { ValidationError } from './types'
import { useToastStore } from '../store/useToastStore'
import type { ApiResponse } from '@anto-sh/admin-network-shared'
import i18n from '@/shared/lib/i18n'
import { isAbortRequestError } from '../lib/network-utils/isAbortRequestError'

const $t = i18n.global.t

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const i18nDictPrefix = 'networkMessages.'

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { addToast } = useToastStore()
    const resData = response.data

    if (resData.message && resData.status === 'success') {
      const resMessageCompiled = $t(i18nDictPrefix + (resData?.message?.code || 'common.success'), {
        ...resData.message?.params,
      })
      addToast({
        severity: 'success',
        summary: $t('networkMessages.common.successSummary'),
        detail: resMessageCompiled,
        life: 4e3,
      })
    }

    return response
  },
  (error: AxiosError<ApiResponse<{ errors: ValidationError[] } | undefined>>) => {
    if (isAbortRequestError(error)) return Promise.reject(error)

    const { addToast } = useToastStore()

    const errorRes = error.response
    const statusCode = errorRes?.status
    const resData = errorRes?.data

    const resMessageCompiled = $t(
      i18nDictPrefix + (resData?.message?.code || 'commonErrors.unknown'),
      { ...resData?.message?.params },
    )
    addToast({
      severity: 'error',
      summary: $t('networkMessages.commonErrors.summary'),
      detail: $t('networkMessages.complexErrorMessage', {
        message: resMessageCompiled,
        statusCode,
        statusText: errorRes?.statusText,
      }),
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

    // Пробрасываем ошибку дальше, на случай, если нужно обработать в конкретном месте
    return Promise.reject(error)
  },
)

export { apiClient }
