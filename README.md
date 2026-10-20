# admin-frontend

Administrative interface for the Amplituda rehabilitation center website.

## Primary repository

`admin-frontend` is the project's primary repository and the home of shared documentation and agreements. See [manifesto.md](manifesto.md#primary-repository) for the governing principles.

## Project documentation

- [manifesto.md](manifesto.md): development principles and shared documentation ownership.
- [DOCS.md](DOCS.md): current implementation and frontend/backend integration.
- [TODO.md](TODO.md): frontend backlog and shared follow-up work.
- Backend repository: `../admin-backend` (server implementation and repository-specific documentation).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint js with [ESLint](https://eslint.org/)

```sh
pnpm lint

```

```sh
pnpm lint:fix
```

### Lint css with [Stylelint](https://eslint.org/)

```sh
pnpm lint:css

```

```sh
pnpm lint:css:fix
```
