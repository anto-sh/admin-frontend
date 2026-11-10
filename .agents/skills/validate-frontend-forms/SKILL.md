---
name: validate-frontend-forms
description: Implement or revise client-side validation for Vue forms using Zod, vee-validate, and PrimeVue. Use when wiring schemas, validation messages, or local server-error handling into a form.
---

# Validate frontend forms

Apply this workflow to the requested forms using their established contracts,
schemas, and types. Keep entity-contract redesign, operation-state redesign,
and broad structural changes outside the task unless separately requested.

## Prepare

Follow [AGENTS.md](../../../AGENTS.md). Read the relevant parts of
[DOCS.md](../../../DOCS.md): API errors (1), i18n (2), and frontend validation (6).
Read the [local adapter README](../../../src/shared/lib/vee-validate-zod/README.md)
before using its initialization, transformation, or field-metadata behavior.

Inspect the affected form, model, schema, request types, and existing reusable
controls. Use the agreed constraints rather than inventing or relaxing rules.

## Reuse schemas and messages

Look first in [shared schemas](../../../src/shared/lib/schemas/index.ts) and
[shared validation](../../../src/shared/lib/validation/index.ts). Reuse existing
schema builders, normalization, translations, and error-mapping functions.
Add shared helpers only when existing ones do not cover the actual requirement.
Keep form-specific composition local to the form's owning page or feature.

Use the shared validation codes and Russian message templates for client and
server errors. Do not duplicate translations or hardcode equivalent messages
inside individual form schemas.

## Connect form state and submission

Preserve the distinction between schema input and validated output. Draft values
may be incomplete where the form permits it; successful DTOs must satisfy the
contract. Do not turn missing values into zero or other invented defaults.

Use `useForm` with the local `toTypedSchema`. Supply explicit `initialValues`;
the adapter does not infer them from Zod defaults. After loading existing data,
use `resetForm` to establish the form's values and initial state.

Keep the `useForm` result as one reactive `form` object rather than exporting
its members individually when it's more than 2 fields.
Group scalar bindings in a reactive `formFields`
object as `formFields.someField.field` and `.attrs`. Preserve writable nested
refs and exact field types. Array bindings may retain the `useFieldArray` API.

Submit the transformed argument received by `form.handleSubmit`. Do not rebuild
the payload from untransformed editable values after successful validation.

## Apply the common interaction policy

Before the first submission attempt, keep validation messages hidden. After that
attempt, validate on model updates and blur. Evaluate these trigger settings
reactively against `form.submitCount`; avoid duplicate validation through
additional input/change handlers.

Show every message for a field from `form.errorBag`. Use PrimeVue `Message` with
`severity="error"`, `variant="simple"`, and `size="small"`. Bind invalid state and
accessible descriptions to the matching field. Set required indicators explicitly:
the local adapter does not infer `meta.required`.

Display form-level client issues and general server errors using the existing
form notification pattern rather than leaving them undisplayed.

## Map server errors locally

Reuse `mapServerValidationErrors` from `@/shared/lib/validation`. Add a local
wrapper or path resolver for the affected form; keep it limited to identifying
its supported editable paths, including valid current array indices.

Reuse the shared parsing, code/parameter translation, deduplication, and fallback.
Pass field messages to `form.setErrors` or `form.setFieldError` directly, without
constructing a `ZodError`. Show general errors and unsupported paths through the
existing notification mechanism.

Handle validation failures locally according to DOCS section 1. Preserve rejection
for other errors and avoid duplicate notifications for failures already handled
centrally.

## Handle repeated fields

Use `useFieldArray` for array mutations and its stable keys for rendered rows.
Register editable row fields in a row component with a reactive name, such as
`useField(() => props.name)`, so Vue and vee-validate manage renaming and cleanup.

Apply the same submission-gated model-update and blur policy to new rows. After
an attempted submission, appending an empty row alone must not immediately show
its field error; interaction or submission triggers its visible validation.

When the array helper owns removal, account for unmount cleanup; use
`keepValueOnUnmount` where needed to avoid deleting the value twice. Verify that
removing the last row preserves an empty array when the contract allows it.
Errors must follow surviving rows as their indices change.

Do not recreate lifecycle management with cached registrations or `nextTick`
repair sequences when the component and composable already provide it.

## Constrain input through PrimeVue

Use the components' built-in input restrictions. Read bounds through the schema's
public API, unwrapping its actual wrappers as needed, and pass them directly to
the PrimeVue component as props. Preserve zero-valued bounds and represent an
absent bound as `undefined` rather than an invented limit.

For `InputNumber`, configure `min`, `max`, and fraction digits according to the
field contract. Integer fields need zero fraction digits; decimal fields need
their agreed precision. Do not pass these UI settings through `defineField`.
Keep schema checks in place even when the component constrains user input.

## Verify and report

Follow AGENTS.md for check commands and test-authoring permissions. Verify the
affected observable behavior: required values, empty/null values, allowed zero
and false, bounds, normalization, transformed DTOs, multiple messages, and server
error routing. For arrays, check addition, removal, and error reindexing.

Exercise the actual PrimeVue component when checking typing, paste, bounds, or
clearing behavior; checking schema results or stub props alone is insufficient.
Report completed changes, checks actually performed, and unresolved behavior.
