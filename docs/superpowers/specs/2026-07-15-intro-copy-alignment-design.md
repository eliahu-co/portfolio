# Intro Copy and Alignment Design

## Goal

Update the closing sentence in the Coin Master assignment introduction and align the intro content's right edge with the feature sections on desktop.

## Root cause

The page's desktop main column is 748px wide at a 1440px viewport, but the intro wrapper is capped by `max-w-2xl` at 672px. That cap creates an unintended 76px gap on the right. The feature sections use the full main-column width. On mobile, the intro and main column already share the same width and do not overflow.

## Approved change

Replace the closing intro sentence with:

> I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.

Remove `max-w-2xl` from the `#hero` intro wrapper. This lets the intro paragraphs and core-loop diagram use the same width as the feature content while preserving the page-level responsive padding and grid.

## Scope

- Change only the intro copy and intro wrapper width.
- Preserve all typography, vertical spacing, page padding, navigation, and section layouts.
- Do not change prototype or demo files.
- Do not alter mobile behavior beyond inheriting the existing full available width.

## Verification

- Add a regression test for the exact approved sentence.
- Add a regression test that the intro wrapper no longer has `max-w-2xl`.
- Run the focused assignment test suite and full test suite.
- Run a production build.
- Visually verify desktop alignment and confirm mobile has no horizontal overflow.
