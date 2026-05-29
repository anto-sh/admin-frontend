// TODO: будто бы нам не нужны тут заголовки и статус-код
export interface ApiResponseDto<T = unknown> {
  status: 'success' | 'error'
  code: number // HTTP статус-код
  headers?: Record<string, string> // Дополнительные заголовки
  message: string
  data?: T // Основные данные ответа
  timestamp?: string // Дата формирования ответа
}

export interface FileDataDto {
  url: string
  originalname: string
  mimetype: string
  size: number
  extension: string
}
