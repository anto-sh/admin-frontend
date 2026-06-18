import type { ApiResponseDto } from '@/shared/api/types'
import type { Ref, UnwrapRef } from 'vue'

/* ──────────────────── CRUD API FACTORY ─────────────────── */
export interface CreateCrudApiOptions<T = 'entity' | 'category'> {
  type: T
  url: string
}

// TODO: Тип мусорный, если не использовать его для создания других
export interface CrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  //base
  url: string
  getAll(): Promise<ApiResponseDto<TResponseDto[]>>
  add(dto: TCreateDto): Promise<ApiResponseDto<TResponseDto>>
  update(id: number, dto: TUpdateDto): Promise<ApiResponseDto<never>>
  delete(id: number): Promise<ApiResponseDto<never>>

  //specific
  getById?(id: number): Promise<ApiResponseDto<TResponseDto>>
  getAllWithEntities?(): Promise<ApiResponseDto<TResponseDto[]>>
}

export interface EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  //base
  url: string
  getAll(): Promise<ApiResponseDto<TResponseDto[]>>
  add(dto: TCreateDto): Promise<ApiResponseDto<TResponseDto>>
  update(id: number, dto: TUpdateDto): Promise<ApiResponseDto<never>>
  delete(id: number): Promise<ApiResponseDto<never>>
  //specific
  getById(id: number): Promise<ApiResponseDto<TResponseDto>>
}

export interface CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  //base
  url: string
  getAll(): Promise<ApiResponseDto<TResponseDto[]>>
  add(dto: TCreateDto): Promise<ApiResponseDto<TResponseDto>>
  update(id: number, dto: TUpdateDto): Promise<ApiResponseDto<never>>
  delete(id: number): Promise<ApiResponseDto<never>>
  //specific
  getAllWithEntities(): Promise<ApiResponseDto<TResponseDto[]>>
}

/* ───────────────── CRUD COMPOSABLE FACTORY ───────────────── */
// TODO: Тип мусорный, если не использовать его для создания других
export type CrudComposable<TResponseDto, TCreateDto, TUpdateDto> = () => {
  //base
  isLoading: Ref<boolean>
  fetchAll(): Promise<void>
  add(dto: TCreateDto): Promise<void>
  update(id: number, dto: TUpdateDto): Promise<void>
  delete(id: number): Promise<void>

  //specific
  entities?: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  categories?: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  fetchById?(id: number): Promise<TResponseDto | undefined>
  fetchAllWithEntities?(): Promise<void>
}

export type EntityCrudComposable<TResponseDto, TCreateDto, TUpdateDto> = () => {
  //base
  isLoading: Ref<boolean>
  fetchAll(): Promise<void>
  add(dto: TCreateDto): Promise<void>
  update(id: number, dto: TUpdateDto): Promise<void>
  delete(id: number): Promise<void>
  //specific
  entities: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  fetchById(id: number): Promise<TResponseDto | undefined>
}

export type CategoryCrudComposable<TResponseDto, TCreateDto, TUpdateDto> = () => {
  //base
  isLoading: Ref<boolean>
  fetchAll(): Promise<void>
  add(dto: TCreateDto): Promise<void>
  update(id: number, dto: TUpdateDto): Promise<void>
  delete(id: number): Promise<void>
  //specific
  categories: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  fetchAllWithEntities(): Promise<void>
}
