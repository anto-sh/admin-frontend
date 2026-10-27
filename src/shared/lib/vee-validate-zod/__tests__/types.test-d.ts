/* eslint vitest/expect-expect: ["error", { "assertFunctionNames": ["expectTypeOf"] }] */
import { expectTypeOf, it } from 'vitest'
import { useForm, type InferInput, type InferOutput } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '../index'

it('preserves required input fields and optional input for defaults', () => {
  const schema = toTypedSchema(
    z.object({ code: z.string().transform(Number), enabled: z.boolean().default(true) }),
  )

  expectTypeOf(schema.parse).parameter(0).toEqualTypeOf<{
    code: string
    enabled?: boolean | undefined
  }>()
  expectTypeOf<InferInput<typeof schema>>().toEqualTypeOf<{
    code: string
    enabled?: boolean | undefined
  }>()
})

it('resolves asynchronous output types and makes defaulted output required', () => {
  const schema = toTypedSchema(
    z.object({
      code: z.string().transform(async (value) => value.length),
      enabled: z.boolean().default(true),
    }),
  )

  expectTypeOf(schema.parse)
    .returns.resolves.toHaveProperty('value')
    .toEqualTypeOf<{ code: number; enabled: boolean } | undefined>()
  expectTypeOf<InferOutput<typeof schema>>().toEqualTypeOf<{
    code: number
    enabled: boolean
  }>()
})

it('keeps form values typed as input and submission values typed as output', () => {
  const schema = z.object({
    quantity: z.string().transform(async (value) => Number(value)),
    enabled: z.boolean().default(true),
  })
  const form = useForm<z.input<typeof schema>, z.output<typeof schema>>({
    validationSchema: toTypedSchema(schema),
    initialValues: { quantity: '1' },
  })

  expectTypeOf(form.values).toEqualTypeOf<z.input<typeof schema>>()
  expectTypeOf(form.values.quantity).toEqualTypeOf<string>()

  form.handleSubmit((result) => {
    expectTypeOf(result).toEqualTypeOf<z.output<typeof schema>>()
    expectTypeOf(result.quantity).toEqualTypeOf<number>()
    expectTypeOf(result.enabled).toEqualTypeOf<boolean>()
  })
})
