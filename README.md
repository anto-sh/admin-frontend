# admin-frontend

Administrative interface for the Amplituda rehabilitation center website.

## Primary repository

`admin-frontend` is the project's primary repository and the home of shared documentation and agreements. See [manifesto.md](manifesto.md#primary-repository) for the governing principles.

## Repositories

- Frontend: [anto-sh/admin-frontend](https://github.com/anto-sh/admin-frontend).
- Backend: [anto-sh/admin-backend](https://github.com/anto-sh/admin-backend), normally at `../admin-backend` locally.
- Shared package: [anto-sh/admin-network-shared](https://github.com/anto-sh/admin-network-shared), normally at `../admin-network-shared` locally.

## Project documentation

- [manifesto.md](manifesto.md): development principles and shared documentation ownership.
- [DOCS.md](DOCS.md): current implementation and frontend/backend integration.
- [TODO.md](TODO.md): frontend backlog and shared follow-up work.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

Use Node.js **22.16.0** (see [.node-version](.node-version)) and pnpm **10.11.0** (see the `packageManager` field in [package.json](package.json)).

```sh
npm install --global pnpm@10.11.0
pnpm install
```

Installation includes development dependencies and runs `prepare` (`husky`), which initializes the project's Git hooks automatically. Lifecycle scripts must be enabled, and `HUSKY` must not be set to `0`.

### Git Hooks

If dependencies are already installed and you need to initialize the hooks again, run:

```sh
pnpm prepare
```

Verify the hook directory:

```sh
git config --get core.hooksPath
```

The expected value is `.husky/_`. Git, Node.js, and pnpm must also be available to the IDE's Git process when committing through an IDE.

The `pre-commit` hook runs `pnpm precommit` in this order:

1. `pnpm build`: type-check and build the whole project.
2. `pnpm test:unit --run --passWithNoTests`: run unit tests once; an empty test suite is allowed.
3. `lint-staged`: lint and format staged files, then stage the resulting fixes automatically.

The `commit-msg` hook validates the message against [.commitlintrc.json](.commitlintrc.json), including the custom `ai` type. Errors block the commit; warnings do not.

To run the preparation workflow manually, stage the intended changes and run:

```sh
pnpm precommit
```

This command can modify and restage files. In VS Code, `Ctrl+Shift+B` runs the same workflow through the **Prepare for commit** task; individual tasks are available through **Tasks: Run Task**.

To check a message manually in PowerShell:

```powershell
'build: configure Git hooks' | pnpm check:message
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
