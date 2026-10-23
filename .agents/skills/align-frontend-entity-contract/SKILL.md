---
name: align-frontend-entity-contract
description: Align a frontend entity's types, API integration, consumers, and forms with its established backend contract. Use when adapting entity screens to an agreed API contract.
---

# Align a frontend entity contract

## Establish the inputs

Verify the entity's backend contract using the source designated by
the project. Inspect the affected frontend types, API configuration,
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

## Align types and API integration

Separate the entity value type, creation DTO, update DTO, and unfinished
form state.

Name entity value types after the entity without a Dto suffix.
Use CreateEntityDto and UpdateEntityDto for request shapes, replacing
Entity with the actual entity name.

Use Partial<CreateEntityDto> only when the update contract has the same
field semantics and differs solely in requiredness. Represent null
only where the relevant contract or draft state permits it.

Update directly affected nested types and consumers.

Configure the entity API to match backend methods, payloads, and
response shapes using the existing client and CRUD mechanisms.
Do not extend shared factories as an automatic part of this workflow.

## Align the form

Keep unfinished form values separate from valid request DTOs.
Do not conceal missing required values with type assertions or invented
defaults.

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
as part of entity alignment.
