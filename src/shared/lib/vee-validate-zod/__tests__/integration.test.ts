import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '..'

beforeEach(() => {
  vi.useFakeTimers()
})

enableAutoUnmount((unmount) => {
  afterEach(async () => {
    try {
      unmount()
      await vi.runAllTimersAsync()
    } finally {
      vi.useRealTimers()
    }
  })
})

async function runWithTimers<T>(pending: Promise<T>): Promise<T> {
  const [result] = await Promise.all([pending, vi.runAllTimersAsync()])
  return result
}

function mountComposable<T>(setup: () => T): T {
  let result!: T
  mount(
    defineComponent({
      setup() {
        result = setup()
        return () => null
      },
    }),
  )
  return result
}

describe('toTypedSchema consumers', () => {
  it('passes asynchronous transformations and defaults to validation and submission', async () => {
    const schema = z.object({
      name: z.string().trim(),
      quantity: z.string().transform(async (value) => {
        await Promise.resolve()
        return Number(value)
      }),
      enabled: z.boolean().default(true),
    })
    const initialValues = { name: ' Example ', quantity: '12' }
    const form = mountComposable(() =>
      useForm<z.input<typeof schema>, z.output<typeof schema>>({
        validationSchema: toTypedSchema(schema),
        initialValues,
      }),
    )
    const output = { name: 'Example', quantity: 12, enabled: true }
    const validation = await runWithTimers(form.validate())
    expect(validation.valid).toBe(true)
    expect(validation.values).toEqual(output)

    const onSubmit = vi.fn()
    await runWithTimers(form.handleSubmit(onSubmit)())

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith(output, expect.anything())
    expect(form.values).toEqual(initialValues)
  })

  it('submits the output shape of a whole-form transformation', async () => {
    const schema = z.object({ label: z.string() }).transform(({ label }) => ({
      slug: label.trim().toLowerCase(),
    }))
    const form = mountComposable(() =>
      useForm<z.input<typeof schema>, z.output<typeof schema>>({
        validationSchema: toTypedSchema(schema),
        initialValues: { label: ' EXAMPLE ' },
      }),
    )
    const onSubmit = vi.fn()

    await runWithTimers(form.handleSubmit(onSubmit)())

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ slug: 'example' }, expect.anything())
    expect(form.values).toEqual({ label: ' EXAMPLE ' })
  })

  it('keeps initialization and reset values raw instead of casting or extracting defaults', async () => {
    const schema = z.object({
      quantity: z.string().transform(Number),
      enabled: z.boolean().default(true),
    })
    const form = mountComposable(() =>
      useForm<z.input<typeof schema>, z.output<typeof schema>>({
        validationSchema: toTypedSchema(schema),
        initialValues: { quantity: '1' },
      }),
    )
    expect(form.values).toStrictEqual({ quantity: '1' })

    form.resetForm({ values: { quantity: '2' } })
    await nextTick()

    expect(form.values).toStrictEqual({ quantity: '2' })
    expect((await runWithTimers(form.validate())).values).toEqual({ quantity: 2, enabled: true })
    expect(form.values).toStrictEqual({ quantity: '2' })
  })

  it('exposes all field messages in errorBag, the first in errors, and clears both', async () => {
    const form = mountComposable(() => {
      const form = useForm({
        validationSchema: toTypedSchema(
          z.object({ name: z.string().min(1, 'Required').min(3, 'Too short') }),
        ),
        initialValues: { name: '' },
      })
      useField('name')
      return form
    })

    await runWithTimers(form.validate())

    expect(form.errorBag.value).toEqual({ name: ['Required', 'Too short'] })
    expect(form.errors.value).toEqual({ name: 'Required' })

    form.setFieldValue('name', 'Example', false)
    await runWithTimers(form.validate())

    expect(form.errorBag.value).toEqual({})
    expect(form.errors.value).toEqual({})
  })

  it('keeps form-level messages, blocks invalid submission, and clears errors after correction', async () => {
    const schema = z.object({ accepted: z.boolean() }).superRefine(({ accepted }, ctx) => {
      if (!accepted) {
        ctx.addIssue({ code: 'custom', message: 'Form first' })
        ctx.addIssue({ code: 'custom', message: 'Form second' })
      }
    })
    const form = mountComposable(() =>
      useForm({
        validationSchema: toTypedSchema(schema),
        initialValues: { accepted: false },
      }),
    )
    const onSubmit = vi.fn()
    const onInvalid = vi.fn()
    const submit = form.handleSubmit(onSubmit, onInvalid)

    await runWithTimers(submit())

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalledOnce()
    expect(form.errorBag.value['']).toEqual(['Form first', 'Form second'])
    expect(form.errors.value['']).toBe('Form first')

    form.setFieldValue('accepted', true, false)
    await runWithTimers(submit())

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ accepted: true }, expect.anything())
    expect(form.errorBag.value[''] ?? []).toEqual([])
    expect(form.errors.value).toEqual({})
  })

  it('connects nested union messages to a registered array field', async () => {
    const item = z.union(
      [
        z.object({ name: z.string().min(3, 'Too short') }),
        z.object({ name: z.string().regex(/^x/, 'Must start with x') }),
      ],
      { error: 'Choose a valid item' },
    )
    const { form, field } = mountComposable(() => {
      const form = useForm({
        validationSchema: toTypedSchema(z.object({ items: z.array(item) })),
        initialValues: { items: [{ name: '' }] },
      })
      const field = useField<string>('items[0].name')
      return { form, field }
    })

    await runWithTimers(form.validate())

    expect(form.errorBag.value).toEqual({
      'items[0]': ['Choose a valid item'],
      'items[0].name': ['Too short', 'Must start with x'],
    })
    expect(field.errors.value).toEqual(['Too short', 'Must start with x'])
    expect(field.errorMessage.value).toBe('Too short')

    field.setValue('xyz', false)
    await runWithTimers(form.validate())

    expect(form.errorBag.value['items[0]'] ?? []).toEqual([])
    expect(field.errors.value).toEqual([])
  })

  it('validates a standalone field through the same public adapter', async () => {
    const field = mountComposable(() =>
      useField('name', toTypedSchema(z.string().min(1, 'Required').min(3, 'Too short')), {
        initialValue: '',
      }),
    )

    expect(await runWithTimers(field.validate())).toEqual({
      valid: false,
      errors: ['Required', 'Too short'],
    })
    expect(field.errors.value).toEqual(['Required', 'Too short'])
    expect(field.errorMessage.value).toBe('Required')

    field.setValue('Example', false)

    expect(await runWithTimers(field.validate())).toEqual({
      valid: true,
      errors: [],
      value: 'Example',
    })
    expect(field.errors.value).toEqual([])
    expect(field.errorMessage.value).toBeUndefined()
  })
})
