import { mapServerValidationErrors } from '@/shared/lib/validation'

const formFields = new Set(['name', 'imageUrl', 'price', 'categoryId', 'procedures'])

export function mapServiceValidationErrors(error: unknown, procedureCount: number) {
  return mapServerValidationErrors(error, (path) => {
    if (!Array.isArray(path)) return null
    if (path.length === 1 && typeof path[0] === 'string' && formFields.has(path[0])) {
      return path[0]
    }
    if (
      path.length === 2 &&
      path[0] === 'procedures' &&
      typeof path[1] === 'number' &&
      Number.isSafeInteger(path[1]) &&
      path[1] >= 0 &&
      path[1] < procedureCount
    ) {
      return `procedures[${path[1]}]`
    }
    return null
  })
}
