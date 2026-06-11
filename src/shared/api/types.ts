export interface ApiResponseDto<T = unknown> {
  status: 'success' | 'error'
  message: string
  data?: T // Основные данные ответа
  timestamp: string // Дата формирования ответа
}

export interface FileDataDto {
  url: string
  originalname: string
  mimetype: string
  size: number
  extension: string
}

