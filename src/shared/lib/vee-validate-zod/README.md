# Zod adapter for vee-validate

The named export `toTypedSchema` bridges Zod 4 and vee-validate 4 through the public `TypedSchema` interface. It preserves `z.input` and `z.output` types and awaits asynchronous validation and transformations.

## Dependencies

- vee-validate: 4.15.1
- zod: 4.6.7

## Usage

Use it inside a component's `setup` or `<script setup lang="ts">`:

```ts
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@/shared/lib/vee-validate-zod'

const schema = z.object({
  name: z.string().trim().min(1),
  quantity: z.string().regex(/^\d+$/).transform(Number),
  enabled: z.boolean().default(true),
})

const { values, handleSubmit, errorBag } = useForm<z.input<typeof schema>, z.output<typeof schema>>(
  {
    validationSchema: toTypedSchema(schema),
    initialValues: { name: '', quantity: '1', enabled: true },
  },
)

const onSubmit = handleSubmit((result) => {
  // values.quantity is a string; result.quantity is a number.
  // result.name is trimmed and result.enabled is a required boolean.
  return result.quantity.toFixed(0)
})
```

Validation uses `safeParseAsync`. On success, `parse` returns the Zod output as `value`; vee-validate exposes it in the validation result and passes it to `handleSubmit`. Editable `values` retain the input type. Zod `.default()` applies to missing or `undefined` values during validation.

## Errors and limitations

- Messages are grouped and deduplicated by path. Nested fields and array indices use names such as `items[0].name`.
- Union errors retain the union message and recursively collect all failing branch messages. The adapter does not select a preferred branch or localize messages.
- Form-level errors use the empty path: read `errorBag.value['']` for all messages. `errorBag` contains every message per path; `errors` contains only the first. Rendering messages is the consumer's responsibility.
- Supply `initialValues` explicitly. The adapter has no `cast` or `describe`: it does not extract defaults on initialization/reset or infer required-field UI metadata.
- `useForm` expects object input and output. Transform individual fields or return an object from a whole-form transform.
- Field names must fit vee-validate's nested-path syntax. Literal dots/brackets, empty property names, and symbol keys cannot be represented reliably.
- Exceptions thrown by custom refinements/transforms propagate. Expected validation failures must use Zod issues.
- Server errors go directly through `setErrors` / `setFieldError`; the adapter only handles client-side Zod parsing.

## Field metadata

Without `describe`, vee-validate 4.15.1 sets `meta.required` to `false`, including for fields required by the Zod schema. Validation still enforces the schema and blocks invalid submission.

Set required indicators and `aria-required` explicitly in the template or a field UI configuration. Keep validation rules in Zod; UI requiredness flags describe how fields are presented.

The `exists` flag in `TypedSchemaPathDescription` is not consumed by vee-validate 4.15.1, and there is no `meta.exists`. A field's presence in a schema does not imply it is currently rendered or registered. Route server errors using the current form's fields and valid array indices; show unmatched paths as general errors.

## Checks

Run from the frontend repository:

```sh
pnpm test:unit --run shared/lib/vee-validate-zod/__tests__
pnpm type-check
```

Runtime tests exercise the public adapter and real `useForm`/`useField` consumers. The separate `types.test-d.ts` assertions are checked by `pnpm type-check`.
