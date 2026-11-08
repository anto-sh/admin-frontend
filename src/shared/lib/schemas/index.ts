import { z } from 'zod'
import { VALIDATION_CODES as VC } from '@anto-sh/admin-network-shared'
import { getValidationMessage } from '@/shared/lib/validation'

export function requiredText(max: number) {
  return z
    .string({
      error: (issue) =>
        getValidationMessage({ code: issue.input == null ? VC.REQUIRED : VC.STRING }),
    })
    .trim()
    .min(1, { error: () => getValidationMessage({ code: VC.REQUIRED }) })
    .refine(
      (value) => {
        // Match class-validator/validator's Unicode length, including presentation selectors.
        const pairs = value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)?.length ?? 0
        const presentations = value.match(/[^\uFE0F\uFE0E][\uFE0F\uFE0E]/g)?.length ?? 0
        return value.length - pairs - presentations <= max
      },
      { error: () => getValidationMessage({ code: VC.MAX_LENGTH, params: { max } }) },
    )
}

export function requiredInteger(min: number, max?: number) {
  let numberSchema = z
    .number({
      error: (issue) =>
        getValidationMessage({ code: issue.input == null ? VC.REQUIRED : VC.NUMBER }),
    })
    // Unlike .int(), this check retains range errors for fractional numbers.
    .refine(Number.isInteger, { error: () => getValidationMessage({ code: VC.INTEGER }) })
    .min(min, { error: () => getValidationMessage({ code: VC.MIN, params: { min } }) })

  if (max !== undefined) {
    numberSchema = numberSchema.max(max, {
      error: () => getValidationMessage({ code: VC.MAX, params: { max } }),
    })
  }

  return numberSchema.nullable().transform((value, ctx) => {
    if (value === null) {
      ctx.addIssue({ code: 'custom', message: getValidationMessage({ code: VC.REQUIRED }) })
      return z.NEVER
    }
    return value
  })
}

export function requiredImagePath(max: number) {
  return requiredText(max).refine(
    (value) => value === '' || /^\/img\/[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/.test(value),
    { error: () => getValidationMessage({ code: VC.IMAGE_PATH }) },
  )
}
