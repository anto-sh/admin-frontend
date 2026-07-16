# My production rules

- Production api url must be `/api`

---

# Project rules

- No `export default` - all exports must be named.
- All URLs must start with a single leading slash and must not have a trailing slash - e.g., `/some-url`.

---

# ADR

## 1. API errors handling

Every API error except `422` is handled in the Axios interceptor:
A toast notification is shown, and then the error is thrown so that it propagates, stops dependent processes, and can optionally be caught.
`422` (validation errors) do not trigger a toast - they are prepared to be caught by the feature layer and displayed on the form.

## 2. i18n

Current purpose – provide a single translation system for user‑facing messages.
Initially used only to map API response codes to human‑readable toast messages.
May be extended later for full UI internationalisation.

Implementation – uses vue-i18n in Composition API mode (legacy: false). A single instance is created in `shared/lib/i18n/index.ts` and exported as i18n.

Loading translations – all JSON files from `/locales` folders (located in any layer of the project) are recursively collected using import.meta.glob with eager: true.
This allows translations to stay close to their modules, preserving modularity and simplifying maintenance.

Future evolution – the architecture allows switching to asynchronous (lazy) loading, adding dynamic language switching, or supporting additional languages without modifying existing code.

## 3. CRUD API and composables factories

All CRUD operations are built through two factories - `createCrudApi` and `createCrudComposable`.
This eliminates duplication and establishes a uniform pattern for every business entity.

`createCrudApi` takes a type (`"entity"` or `"category"`) and a url, returning an API client with base methods and some type-specific methods.
The factory is used in the entity’s `api.ts` file; when needed, the client is extended with additional endpoints right there.

`createCrudComposable` receives that API client and returns a function that creates local reactive state.
This function is called inside the entity’s `model.ts` and can likewise be extended with custom logic.
The composable wires the API to the state, exposes a readonly entity list and methods to mutate it, and manages the loading flag (debounce is covered in 3.1).
The consuming component therefore gets a ready-made model and never interacts with the API or raw state directly.

### 3.1 CRUD composable refetching and `isLoading` debounce

Data refetching is intentionally left to the consuming component rather than built into the composable.
The composable acts as a local entity-model store and may exposes multiple fetch methods (e.g., fetchAll, fetchAllWithEntities for categories).
Adding automatic refetch logic internally would require extra branching, reduce clarity, and is unnecessary because not every mutation demands reloading the full dataset.

In most cases, data must be refetched after every state-changing call, as data freshness is important.
In forms that allow editing multiple entities and provide both a bulk save and a per-entity save, the UI must warn that unsaved changes to other entities will be lost if a single entity is saved individually.

To avoid visual flicker caused by rapid successive toggles inside individual async operations, the reactive `isLoading` flag is setted through a debounced `customRef` set function.
