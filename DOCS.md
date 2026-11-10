# 0. Architecture: adapted Feature-Sliced Design

The frontend uses [Feature-Sliced Design (FSD)](https://fsd.how/ru/docs/) as its architectural foundation, adopting its core principles selectively rather than following the entire specification strictly.

The current implementation retains these FSD principles:

- Standard layer names and dependency hierarchy: `app`, `pages`, `features`, `entities`, and `shared`.
- Slices organized around pages and business entities, with related page slices grouped by domain.
- Application initialization and routing in `app`, screen composition in `pages`, domain data/API/state in `entities`, and reusable infrastructure and UI in `shared`.
- Downward cross-layer source imports; `shared` has no dependencies on higher layers.

## Project adaptations

- Some entity DTOs directly reference DTOs from other entity slices without dedicated cross-reference APIs.
- Single-file segments stay at the slice root; segments with two or more files use a directory.
- Shared groups some code by kind (`composables`, `store`, `utils`, `types`, `enums`).

Component naming and slice public APIs follow [manifesto.md](manifesto.md#component-naming) and its [public API rules](manifesto.md#slice-public-api).

# 1. API errors handling

The [Axios interceptor](src/shared/api/client.ts) shows a translated toast for failures except cancellation and HTTP `422`. Every failure remains rejected.

Forms handle `422` locally as described in section 6. Other errors propagate without duplicate local notifications.

# 2. i18n

The [shared i18n instance](src/shared/lib/i18n/index.ts) uses Composition API mode with `ru` as the active and fallback locale. It eagerly collects `src/shared/**/locales/*.json` and merges messages by language at the top level. Network and validation messages use this instance.

# 3. CRUD API and composables factories

[`createCrudApi`](src/shared/lib/crud/createCrudApi.ts) builds typed CRUD clients configured in entity `api.ts` files. Entity clients add `getById`; category clients add `getAllWithEntities`. Custom endpoints extend the client locally.

[`createCrudComposable`](src/shared/lib/crud/createCrudComposable.ts) returns the entity's model composable. Each instance owns a readonly list, loading state, and request cancellation.

## 3.1 Local state and loading

Fetch methods replace the list or return one entity. Mutations append, replace, or remove local entries using returned data; automatic refetching is not included.

A pending-request counter tracks concurrent operations and affects global loading by default. Local `isLoading` becomes `true` immediately and resets to `false` after 200 ms; another operation cancels that reset. Request counters settle in `finally`.

## 3.2 Form operation states

Form submission uses `form.isSubmitting`, deletion has a separate `isDeleting` state, and resource loading comes from entity models. These states and readonly determine editor availability; mutation handlers also check them. Readonly hides mutation actions.

[field-image-upload](src/features/field-image-upload/useFieldImageUploadModel.ts) owns its upload counter and indicators. Uploading does not block the editor; disabled/readonly guards prevent file selection handling.

# 4. Request cancellation

Each CRUD model instance passes its `AbortController` signal to API calls. In `onBeforeUnmount`, it aborts requests and clears its pending count and loading timer. Cancellation skips the Axios error toast but remains rejected; the global `unhandledrejection` handler suppresses default reporting for unhandled cancellations.

# 5. API contract, shared types, and client maintenance

The API contract is the backend implementation, normally at `../admin-backend`. No OpenAPI specification or client generator is configured.

`@anto-sh/admin-network-shared` supplies response envelopes, network messages, and validation codes. Entity Zod schemas live in `src/entities/*/schema.ts`, types and DTOs in `src/entities/*/types.ts`, and API clients in `src/entities/*/api.ts` and `src/shared/api`.

Schemas are written manually to match the backend's class-validator models. Entity types and request DTOs are then derived from these schemas.

API compatibility relies on keeping schemas, types, clients, and consumers consistent with backend payloads, HTTP methods, responses, errors, optionality, and nullability.

# 6. Frontend form validation

Form validation uses Zod 4, vee-validate 4 composables, and the local [`toTypedSchema` adapter](src/shared/lib/vee-validate-zod/README.md). Reusable field schemas live in [`shared/lib/schemas`](src/shared/lib/schemas/index.ts); shared Russian messages and server-error mapping live in [`shared/lib/validation`](src/shared/lib/validation/index.ts).

Field errors become visible after the first submission attempt; validation then runs on model updates and blur.

The Axios interceptor rejects `422` errors without a toast. Form submission handlers catch them locally and call `mapServerValidationErrors` with a resolver for editable paths and current array indices. Field messages are passed to `form.setErrors`; general messages appear in a local toast. Other errors are rethrown.
