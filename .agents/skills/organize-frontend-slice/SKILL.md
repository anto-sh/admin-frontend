---
name: organize-frontend-slice
description: Organize a frontend slice using the project's adapted FSD structure, component naming, and public API. Use when arranging its files and segments, naming components, or introducing its entrypoint.
---

# Organize a frontend slice

Work on one requested slice and the consumer imports affected by its changes.
Do not reorganize other slices as part of this task. Structural work alone does
not authorize changes to business rules, API contracts, or validation behavior.

## Read the project conventions

Follow [AGENTS.md](../../../AGENTS.md), the architecture section of
[DOCS.md](../../../DOCS.md#0-architecture-adapted-feature-sliced-design), and
[manifesto.md](../../../manifesto.md), particularly its
[component naming](../../../manifesto.md#component-naming) and
[slice public API](../../../manifesto.md#slice-public-api) rules.

Use the project's documented FSD adaptations rather than introducing additional
canonical FSD machinery automatically.

## Place and name the affected code

Inspect the affected slice and its consumers before moving files. Place UI,
models, entity code, reusable features, and shared infrastructure according
to the layer responsibilities in DOCS.md.

Keep single-file segments at the slice root. Group segments containing two or
more files into their own directories. Keep component logic in the model segment
where appropriate; do not create empty segments or extra wrappers to fill a
prescribed structure.

Name components from the highest-level/general words toward descriptive
modifiers. Preserve meaningful leading groups for related component families.
Rename affected files, composables, imports, and directories consistently;
do not turn a local naming task into a repository-wide migration.

## Expose a deliberate public API

Provide an `index.ts` at the slice root. Use explicit named re-exports
for components, functions, and types required by external consumers. Keep other
implementation details internal and avoid `export *`.

A Vue SFC's generated default export can be exposed as a named public export:

```ts
export { default as FieldAssetUpload } from './FieldAssetUpload.vue'
```

Imports from outside the slice must use this public API rather than deep paths
to internal files or segments. Within the slice, use direct relative imports
instead of importing its own public API; avoid barrel-induced cycles.

Update the affected consumers, including routing and other entrypoints. Check
for stale paths and names. Preserve module initialization behavior and existing
interfaces unless changing them is part of the requested task.

## Verify and report

Follow repository check and test-authoring rules. Review file placement, named
exports, external import paths, and internal dependencies. Type-check affected
consumers; include a build when changes affect bundling or module entrypoints.

Report the resulting structure, public exports, updated consumers, checks,
and unresolved references or constraints.
