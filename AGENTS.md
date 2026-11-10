# admin-frontend

Guidance for coding agents working in this repository. Project type: Vue 3 + TypeScript + Vite 6 administrative interface for the Amplituda rehabilitation center website.

- Apply `.agents/instructions/security.md` to every task in this repository.
- Read it before starting work unless its complete, current contents are already available in context. Re-read it after changes to the file or when context compaction has removed the full text.

## Commands and checks

Use Node.js 22.16.0 (`.node-version`) and pnpm 10.11.0 (`package.json`). Run frontend commands from this repository.

- Use the standalone pnpm CLI installed with `npm install --global pnpm@10.11.0`.

| Purpose                  | Command                               |
| ------------------------ | ------------------------------------- |
| Install dependencies     | `pnpm install --frozen-lockfile`      |
| Start development server | `pnpm dev`                            |
| Type-check               | `pnpm type-check`                     |
| Lint TypeScript and Vue  | `pnpm lint` / `pnpm lint:fix`         |
| Lint CSS and SCSS        | `pnpm lint:css` / `pnpm lint:css-fix` |
| Format source files      | `pnpm format`                         |
| Run unit tests once      | `pnpm test:unit --run`                |
| Type-check and build     | `pnpm build`                          |
| Preview a local build    | `pnpm preview`                        |

- Use the pnpm commands listed above for standard project tasks.
- Focus unit tests by appending the affected test file path or a `-t` name filter to `pnpm test:unit --run`; Vitest uses `src` as its root and `jsdom` as its environment.
- No end-to-end test command is configured.
- `pnpm format` rewrites all of `src`; keep formatting scoped to affected files.
- Choose checks for the affected code. Include the build when changing build configuration or bundling; documentation-only changes need text and link review.

## Project conventions

- Before changing application code, read [manifesto.md](manifesto.md) for coding conventions, including [component naming](manifesto.md#component-naming) and [slice public API](manifesto.md#slice-public-api).
- Read only the [DOCS.md](DOCS.md) sections relevant to the mechanism being changed: architecture (section 0), API errors (1), i18n (2), CRUD/refetching/loading (3), cancellation (4), API contracts/schemas/types/clients (5), and form validation ([section 6](DOCS.md#6-frontend-form-validation)). Consult `TODO.md` when planning related backlog work.
- Use the relevant local workflow: [form validation](.agents/skills/validate-frontend-forms/SKILL.md), [entity contracts](.agents/skills/align-frontend-entity-contract/SKILL.md), [slice organization](.agents/skills/organize-frontend-slice/SKILL.md), or [form operation states](.agents/skills/manage-form-operation-states/SKILL.md).
- Keep app wiring, routing, and layouts in `src/app`; page components and page models in `src/pages`; reusable features in `src/features`; entity APIs, DTO types, and models in `src/entities`; shared infrastructure and UI in `src/shared`.
- Follow the existing Vue Composition API and `<script setup lang="ts">` patterns. Reuse existing components, features, widgets, and `src/shared/ui` primitives before adding new implementations.
- Preserve the Russian UI language.

## Backend integration

- Only when a task requires backend investigation or changes, locate the related repository (normally `../admin-backend`), verify its actual path and checkout, and read its root `AGENTS.md` and applicable local instructions.
- When changing an API integration, consult `DOCS.md` section 5 for the current contract source and how DTOs and clients are maintained. Verify the affected integration against that source and keep its frontend DTOs, clients, and consumers consistent.
- Run Git operations and checks in the repository they concern. If the backend is unavailable, complete independent frontend work and identify the server compatibility checks that remain unavailable.

## Final review before a PR

- Only when the user explicitly states that the relevant work is complete and asks to prepare a PR, compare the final code with the `DOCS.md` sections describing mechanisms changed by that work. Keep this check limited to affected sections and perform it during PR preparation.
- Report discrepancies and prepare concrete proposed diffs. Before including any additional documentation or code change outside the existing authorization in the PR, obtain the user's explicit approval. Do not request approval again for changes already authorized.

## Deployment context

`.github/workflows/build_and_deploy_to_remote.yml` builds and deploys matching pushes to `master`. Account for this existing side effect when a task includes a push or workflow change.
