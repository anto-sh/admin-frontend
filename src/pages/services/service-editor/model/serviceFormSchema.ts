import type { z } from 'zod'
import { serviceSchema } from '@/entities/service/schema'

export const serviceFormSchema = serviceSchema.omit({ id: true })

export type ServiceFormInput = z.input<typeof serviceFormSchema>
