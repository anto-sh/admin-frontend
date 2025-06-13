import type { ServiceDto } from '../service/types'

export interface ServiceCategoryDto {
  id: number
  name?: string
  url?: string
  services?: ServiceDto[]
}

export interface CreateServiceCategoryDto {
  name?: string
  url?: string
}

export interface UpdateServiceCategoryDto {
  name?: string
  url?: string
}
