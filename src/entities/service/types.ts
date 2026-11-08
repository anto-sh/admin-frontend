import type { z } from 'zod'
import type { serviceSchema } from './schema'

export type Service = z.output<typeof serviceSchema>

export type CreateServiceDto = Omit<Service, 'id'>

export type UpdateServiceDto = Partial<CreateServiceDto>
