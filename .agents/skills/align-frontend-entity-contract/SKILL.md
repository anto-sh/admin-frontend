---
name: align-frontend-entity-contract
description: Align a frontend entity's schemas, inferred types, API integration, consumers, and forms with its established backend contract. Use when adapting entity screens to an agreed API contract.
---

# Align a frontend entity contract

## Establish the inputs

Verify the entity's backend contract using the source designated by
the project. Inspect the affected frontend schemas, types, API configuration,
consumers, and forms.

Identify writable and returned fields, requiredness, nullability,
update semantics, constraints, normalization, responses, and errors.
Do not derive the contract solely from the current form or database.

Ask the user about unresolved business constraints, offering suitable
options. Reuse already agreed decisions. Do not independently invent
or relax server rules.

Determine whether frontend validation is included in the request.
Respect explicit deferrals; contract alignment alone does not authorize
a complete form-validation implementation.

## Align schemas, types, and API integration

Define one complete Zod schema as the frontend source of truth for the
full entity field model before deriving operation or editor shapes.
Use a domain-oriented name such as `entitySchema`. Represent the established
backend contract, including identifiers and returned fields where they belong;
do not impose identifiers on models without them. Do not reconstruct the full
entity from an editor or create schema.

Infer the entity value type as `Entity = z.output<typeof entitySchema>`.
Use `Entity`, `CreateEntityDto`, and `UpdateEntityDto`, substituting the actual
entity name; the entity value type has no `Dto` suffix. Keep domain schemas and
domain/request types with the entity, separate from unfinished form state.

Derive writable request shapes and types according to the contract. When a
separate runtime schema is needed, compose it from the complete schema using
`pick`, `omit`, `partial`, or justified extensions, and infer its type with
`z.output`. Otherwise, type utilities over the inferred entity type are
sufficient. Do not maintain independent copies of field definitions or add
unused schemas.

Use `Partial<CreateEntityDto>` only when the update contract has the same
field semantics and differs solely in requiredness. Preserve the distinction
between omission and explicit `null`; represent null only where the relevant
contract or draft state permits it.

Reuse existing builders from `@/shared/lib/schemas` and shared messages from
`@/shared/lib/validation` where relevant. Keep domain constraints faithful to
the backend and avoid duplicating shared schema-building logic.

Update directly affected nested types and consumers.

Configure the entity API to match backend methods, payloads, and
response shapes using the existing client and CRUD mechanisms.
Do not extend shared factories as an automatic part of this workflow.

## Align the form

Derive any form-specific schema from the complete entity schema in the form's
owning page or feature. Use `z.input` for editable input and `z.output` for
validated output where they differ. Do not name domain types after an editor
or infer them from its draft representation.

Keep unfinished form values separate from valid request DTOs. Allow draft
`null` or `undefined` only where appropriate; successful DTOs must satisfy
the contract. Do not conceal missing required values with type assertions
or invented defaults.

Map form state to writable request fields while preserving the agreed
meaning of omission, null, empty strings, empty collections, zero,
and false.

If a minimal save guard is needed to construct a valid DTO while full
validation is deferred, agree on that guard with the user first.

Check that available form actions permit the entity's valid states,
including allowed empty collections. Respect the existing view-only
mode when exposing editing actions.

Implement client validation and field-error display only to the agreed
extent. Use existing response and error-handling mechanisms.

Sending all writable form fields is acceptable when the update contract
allows it; do not introduce changed-field tracking without a need.

## Verify and report

Run relevant checks according to repository instructions. Report
completed integration changes, remaining incompatibilities, and
deferred validation work.

Keep changes scoped to the entity and its direct consumers. Propose
required shared-infrastructure or backend changes separately instead
of making them automatically. Do not introduce contract generation
as part of entity alignment. Operation-state redesign, readonly implementation
changes, and broad FSD restructuring require separate scope.
