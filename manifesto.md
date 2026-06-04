# My production rules
- Production api url must be `/api`

# Project rules

- No `export default` - all exports must be named.
- All URLs must start with a single leading slash and must not have a trailing slash - e.g., `/some-url`.

# ADR
## 1. API errors handling
Every API error except `422` is handled in the Axios interceptor:
A toast notification is shown, and then the error is thrown so that it propagates, stops dependent processes, and can optionally be caught.
`422` (validation errors) do not trigger a toast — they are prepared to be caught by the feature layer and displayed on the form.
