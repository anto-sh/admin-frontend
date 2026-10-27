import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { toTypedSchema } from '../index'

describe('toTypedSchema.parse', () => {
  it('returns transformed output without changing the input', async () => {
    const schema = toTypedSchema(
      z
        .object({ name: z.string().trim(), quantity: z.string().transform(Number) })
        .transform(({ name, quantity }) => ({ label: name, quantity })),
    )
    const input = { name: ' Example ', quantity: '12' }

    await expect(schema.parse(input)).resolves.toEqual({
      value: { label: 'Example', quantity: 12 },
      errors: [],
    })
    expect(input).toEqual({ name: ' Example ', quantity: '12' })
  })

  it.each([false, 0, ''])('preserves the successful falsy value %j', async (value) => {
    const schema = toTypedSchema(z.literal(value))

    await expect(schema.parse(value)).resolves.toEqual({ value, errors: [] })
  })

  it('preserves a valid root null', async () => {
    const schema = toTypedSchema(z.null())

    await expect(schema.parse(null)).resolves.toEqual({ value: null, errors: [] })
  })

  it('accepts undefined for an optional root schema', async () => {
    const schema = toTypedSchema(z.string().optional())

    await expect(schema.parse(undefined)).resolves.toEqual({ value: undefined, errors: [] })
  })

  it('applies a root default to undefined input', async () => {
    const schema = toTypedSchema(z.string().default('Fallback'))

    await expect(schema.parse(undefined)).resolves.toEqual({ value: 'Fallback', errors: [] })
  })

  it.each([null, undefined])(
    'rejects invalid root input for an object schema: %j',
    async (input) => {
      const schema = toTypedSchema(
        z.object({ enabled: z.boolean().default(true) }, { error: 'Object required' }),
      )

      // @ts-expect-error Exercise invalid runtime data at the validation boundary.
      await expect(schema.parse(input)).resolves.toEqual({
        errors: [{ path: '', errors: ['Object required'] }],
      })
    },
  )

  it.each([
    { input: {}, enabled: true },
    { input: { enabled: undefined }, enabled: true },
    { input: { enabled: false }, enabled: false },
  ])('applies defaults only to missing or undefined values: $input', async ({ input, enabled }) => {
    const schema = toTypedSchema(z.object({ enabled: z.boolean().default(true) }))

    await expect(schema.parse(input)).resolves.toEqual({ value: { enabled }, errors: [] })
  })

  it('rejects null in a defaulted field instead of replacing it with the default', async () => {
    const schema = toTypedSchema(
      z.object({ enabled: z.boolean({ error: 'Use a boolean' }).default(true) }),
    )

    // @ts-expect-error Exercise invalid runtime data at the validation boundary.
    await expect(schema.parse({ enabled: null })).resolves.toEqual({
      errors: [{ path: 'enabled', errors: ['Use a boolean'] }],
    })
  })

  it('groups independent messages per field and removes duplicate messages only within that field', async () => {
    const schema = toTypedSchema(
      z.object({
        name: z
          .string()
          .min(3, 'Too short')
          .regex(/^[a-z]+$/, 'Use letters')
          .refine(() => false, 'Too short'),
        code: z.string().min(1, 'Too short'),
      }),
    )

    await expect(schema.parse({ name: '1', code: '' })).resolves.toEqual({
      errors: [
        { path: 'name', errors: ['Too short', 'Use letters'] },
        { path: 'code', errors: ['Too short'] },
      ],
    })
  })

  it('preserves nested object paths and numeric indices in arrays', async () => {
    const schema = toTypedSchema(
      z.object({
        profile: z.object({ name: z.string().min(1, 'Name required') }),
        items: z.array(z.object({ name: z.string().min(1, 'Item required') })),
        matrix: z.array(z.array(z.string().min(1, 'Cell required'))),
      }),
    )

    await expect(
      schema.parse({
        profile: { name: '' },
        items: [{ name: 'Valid' }, { name: '' }],
        matrix: [['']],
      }),
    ).resolves.toEqual({
      errors: [
        { path: 'profile.name', errors: ['Name required'] },
        { path: 'items[1].name', errors: ['Item required'] },
        { path: 'matrix[0][0]', errors: ['Cell required'] },
      ],
    })
  })

  it('uses brackets for an error path starting with a root array index', async () => {
    const schema = toTypedSchema(z.array(z.string().min(1, 'Required')))

    await expect(schema.parse([''])).resolves.toEqual({
      errors: [{ path: '[0]', errors: ['Required'] }],
    })
  })

  it('keeps form-level messages alongside field messages', async () => {
    const schema = toTypedSchema(
      z.object({ name: z.string().min(1, 'Name required') }).superRefine((_, ctx) => {
        ctx.addIssue({ code: 'custom', message: 'Form first' })
        ctx.addIssue({ code: 'custom', message: 'Form second', path: [] })
      }),
    )

    await expect(schema.parse({ name: '' })).resolves.toEqual({
      errors: [
        { path: 'name', errors: ['Name required'] },
        { path: '', errors: ['Form first', 'Form second'] },
      ],
    })
  })

  it('returns output after asynchronous refinement and transformation', async () => {
    const schema = toTypedSchema(
      z.object({
        name: z
          .string()
          .refine(async (value) => (await Promise.resolve(value)) === 'valid', 'Unknown name')
          .transform(async (value) => (await Promise.resolve(value)).length),
      }),
    )

    await expect(schema.parse({ name: 'valid' })).resolves.toEqual({
      value: { name: 5 },
      errors: [],
    })
  })

  it('returns field errors when an asynchronous refinement rejects a value', async () => {
    const schema = toTypedSchema(
      z.object({
        name: z
          .string()
          .refine(async (value) => (await Promise.resolve(value)) === 'valid', 'Unknown name'),
      }),
    )

    await expect(schema.parse({ name: 'other' })).resolves.toEqual({
      errors: [{ path: 'name', errors: ['Unknown name'] }],
    })
  })

  it.each(['refinement', 'transformation'] as const)(
    'propagates exceptions from a custom %s',
    async (kind) => {
      const failure = new Error('Unexpected failure')
      const fail = async () => {
        throw failure
      }
      const schema = toTypedSchema(
        kind === 'refinement' ? z.string().refine(fail) : z.string().transform(fail),
      )

      await expect(schema.parse('value')).rejects.toBe(failure)
    },
  )

  it('applies defaults alongside an asynchronous field transformation', async () => {
    const schema = toTypedSchema(
      z.object({
        code: z.string().transform(async (value) => value.length),
        enabled: z.boolean().default(true),
      }),
    )

    await expect(schema.parse({ code: 'text' })).resolves.toEqual({
      value: { code: 4, enabled: true },
      errors: [],
    })
  })
})

describe('toTypedSchema union errors', () => {
  const itemSchema = z.union(
    [
      z.object({ name: z.string({ error: 'Use text' }) }),
      z.object({ name: z.number({ error: 'Use a number' }) }),
    ],
    { error: 'Invalid item' },
  )

  it.each([{ name: 'Valid' }, { name: 42 }])(
    'accepts a successful branch without reporting failed alternatives: %j',
    async (input) => {
      await expect(toTypedSchema(itemSchema).parse(input)).resolves.toEqual({
        value: input,
        errors: [],
      })
    },
  )

  it('preserves a root union message and groups messages from its branches', async () => {
    const schema = toTypedSchema(itemSchema)

    // @ts-expect-error Exercise invalid runtime data at the validation boundary.
    await expect(schema.parse({ name: false })).resolves.toEqual({
      errors: [
        { path: '', errors: ['Invalid item'] },
        { path: 'name', errors: ['Use text', 'Use a number'] },
      ],
    })
  })

  it('accumulates relative paths through nested unions and array elements', async () => {
    const schema = toTypedSchema(
      z.object({
        choice: z.union(
          [z.object({ items: z.array(itemSchema) }), z.number({ error: 'Use a numeric choice' })],
          { error: 'Invalid choice' },
        ),
      }),
    )

    // @ts-expect-error Exercise invalid runtime data at the validation boundary.
    await expect(schema.parse({ choice: { items: [{ name: false }] } })).resolves.toEqual({
      errors: [
        { path: 'choice', errors: ['Invalid choice', 'Use a numeric choice'] },
        { path: 'choice.items[0]', errors: ['Invalid item'] },
        { path: 'choice.items[0].name', errors: ['Use text', 'Use a number'] },
      ],
    })
  })

  it('retains a discriminated-union error when there are no branch issues', async () => {
    const schema = toTypedSchema(
      z.object({
        choice: z.discriminatedUnion(
          'kind',
          [z.object({ kind: z.literal('a') }), z.object({ kind: z.literal('b') })],
          { error: 'Unknown kind' },
        ),
      }),
    )

    // @ts-expect-error Exercise an unknown discriminator at the validation boundary.
    await expect(schema.parse({ choice: { kind: 'unknown' } })).resolves.toEqual({
      errors: [{ path: 'choice.kind', errors: ['Unknown kind'] }],
    })
  })

  it('retains an exclusive-union error when multiple branches match', async () => {
    const schema = toTypedSchema(
      z.object({ choice: z.xor([z.string(), z.string()], { error: 'Ambiguous choice' }) }),
    )

    await expect(schema.parse({ choice: 'matches both' })).resolves.toEqual({
      errors: [{ path: 'choice', errors: ['Ambiguous choice'] }],
    })
  })
})
