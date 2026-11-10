# Primary repository

- `admin-frontend` is the primary repository of the administration project.
- Shared principles, decisions, and documentation are maintained here.
- Each concern has one authoritative source; other documents link to it.
- Shared documentation reflects changes across all project repositories.

# My production rules

- Production api url must be `/api`

---

# Project rules

- No `export default` - all exports must be named.
- All URLs must start with a single leading slash and must not have a trailing slash - e.g., `/some-url`.

## Component naming

- Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

## Slice public API

- Each slice must expose its public API through an `index.ts` at the slice root.
- Imports from outside a slice must use its public API, without referencing internal files or segments directly.
- Within a slice, import internal modules directly using relative paths, without going through its public API.
- Use explicit named re-exports for symbols needed by external consumers. Do not use `export *`.
