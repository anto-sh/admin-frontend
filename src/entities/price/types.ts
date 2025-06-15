// Цены
export interface PriceDto {
  id: number
  name: string
  price: number
}

export interface CreatePriceDto {
  name: string
  price: number
}

export interface UpdatePriceDto {
  name?: string
  price?: number
}

export interface UpdatePriceBatchDto {
  id: number
  name?: string
  price?: number
}
