import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      alert(`Ошибка запроса: \n ${error.response?.status} \n ${error.message}`)
    } else {
      console.error('', error)
      alert(`Неизвестная ошибка:: \n ${error}`)
    }
    // Пробрасываем ошибку дальше, если нужно обработать в конкретном месте
    return Promise.reject(error)
  },
)

export { apiClient }
