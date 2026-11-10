---
name: manage-form-operation-states
description: Configure asynchronous action states, loading indicators, handler guards, and readonly behavior in frontend forms. Use when distinguishing save, delete, or background operations and controlling mutation actions.
---

# Manage form operation states

Work with the existing form and submission flow. Adding validation, changing
entity contracts, and reorganizing slices are separate tasks unless requested.

## Establish state ownership

Follow [AGENTS.md](../../../AGENTS.md). Read [DOCS.md](../../../DOCS.md) sections
1 and 3 for error propagation, CRUD loading, and its debounce behavior; consult
section 4 when cancellation affects the action.

Identify resource-loading states, submissions, independent mutation actions,
and background work. Determine which operations conflict and which controls
each operation should disable or mark as loading.

Reuse model `isLoading` for the resources it represents. For vee-validate forms,
use the existing `form.isSubmitting` for submission; do not add a duplicate
`isSaving` around the same promise.

Use explicit state for independent actions not represented by existing mechanisms,
such as deletion. Use a pending-operation counter only when overlapping requests
actually need to be tracked.

## Separate loading indication from blocking

Bind each action's spinner to that action's state. A combined resource/model
loading flag may include fetching or other mutations, so it should not determine
an unrelated button's spinner.

Derive editor/control disabled state from readonly and the operations that
actually conflict with editing. Independent background work should not block
the whole form automatically. Do not disable controls solely because some
unrelated operation displays a loading indicator.

Use component loading props and existing loading indicators. Avoid custom
spinner classes or additional indicator implementations when existing UI covers
the requirement.

## Keep handlers and cleanup consistent

Guard mutation handlers against readonly and conflicting in-flight operations,
in addition to disabling or hiding their UI controls. Use immediate action state
to prevent duplicate execution when a resource loading flag is debounced.

Set manually managed state before awaiting the operation and reset it in
`finally`, including on rejection or cancellation. Do not add a catch solely
to reset loading. Catch only errors requiring existing local handling; preserve
rejection and avoid duplicate notifications.

## Preserve the view-only mode

Render form controls noneditable using their supported readonly/disabled props.
Hide mutation actions, including save, instead of only disabling them. Keep
navigation and viewing actions available where appropriate.

Preserve existing confirmation and navigation behavior. Do not introduce new
operations or change request semantics while adjusting state management.

## Verify and report

Follow repository check and test-authoring rules. Verify successful, rejected,
and relevant cancelled operations; state must settle correctly in each case.
Check duplicate-click guards, independent button indicators, appropriate editor
blocking, and hidden mutation actions in readonly mode.

Report the resulting state ownership, affected controls, checks performed,
and any unresolved interaction between operations.
