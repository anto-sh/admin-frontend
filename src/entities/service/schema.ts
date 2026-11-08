import { z } from 'zod'
import { VALIDATION_CODES as VC } from '@anto-sh/admin-network-shared'
import { requiredImagePath, requiredInteger, requiredText } from '@/shared/lib/schemas'
import { getValidationMessage } from '@/shared/lib/validation'

export const serviceSchema = z.object({
  id: requiredInteger(1),
  name: requiredText(200),
  imageUrl: requiredImagePath(2048),
  price: requiredInteger(0, 10_000_000),
  categoryId: requiredInteger(1),
  procedures: z
    .array(requiredText(500), {
      error: (issue) =>
        getValidationMessage({ code: issue.input == null ? VC.REQUIRED : VC.ARRAY }),
    })
    .max(100, {
      error: () => getValidationMessage({ code: VC.ARRAY_MAX_SIZE, params: { max: 100 } }),
    }),
})
