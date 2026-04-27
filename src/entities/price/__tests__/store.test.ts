import { vi, describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePriceStore } from '@/entities/price/store'

vi.mock('@/entities/price/api', () => ({
  priceApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    updateBatch: vi.fn(),
    delete: vi.fn(),
  },
}))

import { priceApi } from '@/entities/price/api'

describe('Price Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchPrices загружает цены и сохраняет в стейт', async () => {
    const mockPrices = [
      {
        id: 3,
        name: '1231tgewr23',
        price: 231325,
      },
      {
        id: 4,
        name: '123`2154242',
        price: 3214152151,
      },
      {
        id: 5,
        name: '1231254',
        price: 124321,
      },
      {
        id: 6,
        name: 'Всякое разное',
        price: 4215261,
      },
    ]
    vi.mocked(priceApi.getAll).mockResolvedValue({
      status: 'success',
      code: 200,
      message: '',
      data: mockPrices,
    })

    const store = usePriceStore()
    await store.fetchPrices()

    expect(priceApi.getAll).toHaveBeenCalled()
    expect(store.prices).toEqual(mockPrices)
  })
})
