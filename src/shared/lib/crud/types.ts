import type { ApiResponse } from '@anto-sh/admin-network-shared'
import type { Ref, UnwrapRef } from 'vue'
import type { usePendingRequestCounter } from '../network-utils/usePendingRequestCounter'

/* ──────────────────── CRUD API FACTORY ─────────────────── */
export interface CreateCrudApiOptions<T extends 'entity' | 'category' = 'entity' | 'category'> {
  type: T
  url: string
}

export interface BaseCrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  url: string
  getAll(abortSignal: AbortSignal): Promise<ApiResponse<TResponseDto[]>>
  add(dto: TCreateDto, abortSignal: AbortSignal): Promise<ApiResponse<TResponseDto>>
  update(id: number, dto: TUpdateDto, abortSignal: AbortSignal): Promise<ApiResponse<never>>
  delete(id: number, abortSignal: AbortSignal): Promise<ApiResponse<never>>
}

export interface EntityCrudApi<TResponseDto, TCreateDto, TUpdateDto>
  extends BaseCrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  getById(id: number, abortSignal: AbortSignal): Promise<ApiResponse<TResponseDto>>
}

export interface CategoryCrudApi<TResponseDto, TCreateDto, TUpdateDto>
  extends BaseCrudApi<TResponseDto, TCreateDto, TUpdateDto> {
  getAllWithEntities(abortSignal: AbortSignal): Promise<ApiResponse<TResponseDto[]>>
}

/* ───────────────── CRUD COMPOSABLE FACTORY ───────────────── */
export interface BaseCrud<TCreateDto, TUpdateDto> {
  isLoading: Ref<boolean>
  abortSignal: AbortSignal
  pendingRequestCounter: ReturnType<typeof usePendingRequestCounter>
  fetchAll(): Promise<void>
  add(dto: TCreateDto): Promise<void>
  update(id: number, dto: TUpdateDto): Promise<void>
  delete(id: number): Promise<void>
}

export type BaseCrudComposable<TCreateDto, TUpdateDto> = () => BaseCrud<TCreateDto, TUpdateDto>

export type EntityCrudComposable<TResponseDto, TCreateDto, TUpdateDto> = () => BaseCrud<
  TCreateDto,
  TUpdateDto
> & {
  entities: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  fetchById(id: number): Promise<TResponseDto | undefined>
}

export type CategoryCrudComposable<TResponseDto, TCreateDto, TUpdateDto> = () => BaseCrud<
  TCreateDto,
  TUpdateDto
> & {
  categories: Readonly<Ref<UnwrapRef<TResponseDto>[], TResponseDto[]>>
  fetchAllWithEntities(): Promise<void>
}
