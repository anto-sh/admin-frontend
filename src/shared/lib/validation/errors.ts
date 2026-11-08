import {
  VALIDATION_CODES as VC,
  type ValidationCode,
  type ValidationIssueDetails,
} from '@anto-sh/admin-network-shared'
import { isAxiosError } from 'axios'
import i18n from '@/shared/lib/i18n'

const validationCodes = new Set<string>(Object.values(VC))
const generalCodes = new Set<unknown>([
  VC.UNKNOWN_FIELD,
  VC.INVALID_REQUEST,
  VC.EMPTY_UPDATE,
  VC.INVALID_ID,
  VC.INVALID_JSON,
  VC.REQUEST_TOO_LARGE,
])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const isValidationCode = (code: unknown): code is ValidationCode =>
  typeof code === 'string' && validationCodes.has(code)

function readNumber(params: unknown, name: string): number | null {
  if (!isRecord(params)) return null
  const value = params[name]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function getValidationMessage(issue: ValidationIssueDetails): string {
  return i18n.global.t(issue.code, { ...issue.params })
}

function translateValidationIssue(issue: Record<string, unknown>): string | null {
  if (!isValidationCode(issue.code)) return null

  const code = issue.code
  switch (code) {
    case VC.MAX_LENGTH:
    case VC.MAX:
    case VC.ARRAY_MAX_SIZE: {
      const max = readNumber(issue.params, 'max')
      return max === null ? null : getValidationMessage({ code, params: { max } })
    }
    case VC.MIN: {
      const min = readNumber(issue.params, 'min')
      return min === null ? null : getValidationMessage({ code, params: { min } })
    }
    case VC.REQUEST_TOO_LARGE: {
      const maxBytes = readNumber(issue.params, 'maxBytes')
      return maxBytes === null ? null : getValidationMessage({ code, params: { maxBytes } })
    }
    default:
      return getValidationMessage({ code })
  }
}

export function mapServerValidationErrors(
  error: unknown,
  resolveFieldPath: (path: unknown) => string | null,
) {
  if (!isAxiosError<unknown>(error) || error.response?.status !== 422) return null

  const fieldErrors = new Map<string, string[]>()
  const generalErrors = new Set<string>()
  const fallbackMessage = getValidationMessage({ code: VC.INVALID_VALUE })
  const response = error.response.data
  const issues =
    isRecord(response) && isRecord(response.data) ? response.data.validationErrors : undefined

  if (!Array.isArray(issues) || issues.length === 0) {
    generalErrors.add(fallbackMessage)
  } else {
    for (const value of issues) {
      const issue = isRecord(value) ? value : null
      const message = issue && translateValidationIssue(issue)
      if (!issue || !message) {
        generalErrors.add(fallbackMessage)
        continue
      }
      const fieldPath = resolveFieldPath(issue.path)
      if (!fieldPath || generalCodes.has(issue.code)) {
        generalErrors.add(message)
        continue
      }
      const messages = fieldErrors.get(fieldPath) ?? []
      if (!messages.includes(message)) messages.push(message)
      fieldErrors.set(fieldPath, messages)
    }
  }

  return { fieldErrors: Object.fromEntries(fieldErrors), generalErrors: [...generalErrors] }
}
