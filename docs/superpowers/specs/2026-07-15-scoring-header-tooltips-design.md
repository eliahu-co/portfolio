# Scoring Header Tooltips

## Goal

Replace the four expandable scoring-criterion controls below the Prioritization table with compact, discoverable explanations attached directly to the corresponding table headers.

## Approved design

Each of the four criterion headers—ARPDAU Impact, Core-Loop Fit, Confidence, and Effort—will include a small outlined information icon. Hovering anywhere over a criterion header will reveal a tooltip containing that criterion's existing definition and 5 / 3 / 1 rubric.

The same tooltip will appear when its information button receives keyboard focus. On touch devices, tapping the information button will focus it and reveal the tooltip; tapping elsewhere will remove focus and dismiss it. The button will have an accessible label and reference the tooltip through `aria-describedby`. Tooltip content will remain in the DOM for assistive technologies.

Tooltips will overlay the table rather than changing its height or moving rows. The first three criterion tooltips will center beneath their headers. The Effort tooltip will align to the right edge of its header so it remains within the table boundary. Tooltip styling will use the page's cream surface, wood border, violet heading, charcoal body copy, and crimson score emphasis.

## Component behavior

`Prioritization.tsx` will render table headers directly from `CRITERIA_DEFS`, avoiding a separate duplicate criteria-title array. Each header will be a CSS hover/focus group containing:

- the unchanged criterion label;
- an outlined information button;
- a hidden tooltip with the unchanged definition and rubric.

The tooltip will become visible through group hover or focus-within classes. No React state is required. The existing `useState`, toggle handler, open-definition lookup, and four-control criteria block below the scoring method will be removed. The component can return to a server component by removing `'use client'`.

## Unchanged behavior

The feature rows, scores, totals, winner treatment, scoring-method paragraphs, Opportunity Score formula, criterion definitions, and rubric copy will remain unchanged.

## Verification

Regression coverage will verify that:

- exactly four criterion information buttons render in the table headers;
- each button has an accessible label and `aria-describedby` relationship;
- each corresponding tooltip contains the approved definition and 5 / 3 / 1 rubric;
- tooltip wrappers include hover/focus visibility classes and the Effort tooltip uses right-edge alignment;
- the former criterion dropdown buttons, arrow markers, and expanded panel are absent;
- the Prioritization component no longer depends on client state.

Focused MA Home Assignment tests and the full Jest suite will run before the branch is considered complete.
