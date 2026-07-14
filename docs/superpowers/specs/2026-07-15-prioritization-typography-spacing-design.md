# Prioritization Typography and Spacing

## Goal

Make the prioritization criteria labels and Opportunity Score formula read as part of the regular body copy, and give the criteria block the same bottom spacing as the feature sections.

## Design

- In `app/MA-HomeAssignment/sections/Prioritization.tsx`, use the existing body typography on both the criterion label text and the Opportunity Score formula: `font-sans text-[14px] font-normal text-charcoal` with the existing relaxed line height where applicable.
- Keep the criterion triangle arrows, wood left borders, and the formula's gold left border unchanged as interaction and structural accents.
- Add `mb-6` to the outer criteria block. Feature sections end with a shared `Block` that already contributes `mb-6`; using the same value makes the distance to the following gradient separator consistent.
- Do not change the shared `Section` component or spacing in unrelated sections.

## Verification

- Add a focused regression test that renders the prioritization section and verifies the formula and four criterion labels use the agreed body typography and grey color.
- Verify the criteria wrapper uses `mb-6` while the accent arrows and borders retain their existing classes.
- Run the relevant test, then the full test suite and production build.
