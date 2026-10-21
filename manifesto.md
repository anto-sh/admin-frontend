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
