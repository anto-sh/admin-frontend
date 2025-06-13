export interface ServiceDto {
  id: number
  name: string
  imageUrl: string
  price: number
  procedures: string[]
  categoryId: number
}

export interface CreateServiceDto {
  name?: string
  imageUrl?: string
  price?: number
  procedures?: string[]
  categoryId?: number
}

export interface UpdateServiceDto {
  name?: string
  imageUrl?: string
  price?: number
  procedures?: string[]
  categoryId?: number
}
