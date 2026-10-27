import type { TypedSchema, TypedSchemaError } from 'vee-validate'
import type { z } from 'zod'

type ZodIssues = z.ZodError['issues']

function toFieldPath(segments: PropertyKey[]): string {
  return segments.reduce<string>((path, segment) => {
    if (typeof segment === 'number') {
      return `${path}[${segment}]`
    }

    return path ? `${path}.${String(segment)}` : String(segment)
  }, '')
}

function groupIssues(issues: ZodIssues): TypedSchemaError[] {
  const errors = new Map<string, TypedSchemaError>()

  function collect(currentIssues: ZodIssues, prefix: PropertyKey[] = []): void {
    for (const issue of currentIssues) {
      const segments = [...prefix, ...issue.path]
      const path = toFieldPath(segments)
      const entry = errors.get(path) ?? { path, errors: [] }

      if (!entry.errors.includes(issue.message)) {
        entry.errors.push(issue.message)
      }
      errors.set(path, entry)

      if (issue.code === 'invalid_union') {
        // Zod 4 branch paths are relative to the union's own path.
        for (const branch of issue.errors) {
          collect(branch, segments)
        }
      }
    }
  }

  collect(issues)
  return [...errors.values()]
}

export function toTypedSchema<TSchema extends z.ZodType>(
  schema: TSchema,
): TypedSchema<z.input<TSchema>, z.output<TSchema>> {
  return {
    __type: 'VVTypedSchema',
    async parse(values) {
      const result = await schema.safeParseAsync(values)

      if (result.success) {
        return { value: result.data, errors: [] }
      }

      return { errors: groupIssues(result.error.issues) }
    },
  }
}
