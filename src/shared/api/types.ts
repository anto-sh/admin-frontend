// TODO: будто бы нам не нужны тут заголовки и статус-код
export interface ApiResponseDto<T = unknown> {
  status: 'success' | 'error'
  code: number // HTTP статус-код
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

/* ──────────────────── ENTITIES API FABRIC ─────────────────── */

export interface entityApiFabricOptions {
  type: 'entity' | 'category'
  url: string
}

export type EntityApi<TResponseDto, TCreateDto, TUpdateDto> = {
  //common
  getAll(): Promise<ApiResponseDto<TResponseDto[]>>
  add(dto: TCreateDto): Promise<ApiResponseDto<TResponseDto>>
  update(id: number, dto: TUpdateDto): Promise<ApiResponseDto<never>>
  delete(id: number): Promise<ApiResponseDto<never>>

  //specific
  getById?(id: number): Promise<ApiResponseDto<TResponseDto>>
  getAllWithEntities?(): Promise<ApiResponseDto<TResponseDto[]>>
}
