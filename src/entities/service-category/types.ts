import type { Service } from '../service/types'

export interface ServiceCategoryDto {
  id: number
  name?: string
  url?: string
  services?: Service[]
}

export interface CreateServiceCategoryDto {
  name?: string
  url?: string
}

export interface UpdateServiceCategoryDto {
  name?: string
  url?: string
}
