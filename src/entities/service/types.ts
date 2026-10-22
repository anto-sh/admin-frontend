export interface Service {
  id: number
  name: string
  imageUrl: string
  price: number
  procedures: string[]
  categoryId: number
}

export interface CreateServiceDto {
  name: string
  imageUrl: string
  price: number
  procedures: string[]
  categoryId: number
}

export type UpdateServiceDto = Partial<CreateServiceDto>
