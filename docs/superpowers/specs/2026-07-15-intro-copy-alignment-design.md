# Intro Copy and Alignment Design

## Goal

Update the closing sentence in the Coin Master assignment introduction and align both the intro and hero header content with the feature sections on desktop.

## Root cause

The page's desktop main column is 748px wide at a 1440px viewport, but the intro wrapper and hero contact row are capped by `max-w-2xl` at 672px. Those caps create an unintended 76px gap on the right. The hero title row already spans the full column, but its desktop logo is inset 60px from the shared right edge. The feature sections use the full main-column width. On mobile, the intro and main column already share the same width and do not overflow.

## Approved change

Replace the closing intro sentence with:

> I developed three concepts, each targeting a different path to ARPDAU growth: a new spend surface, deeper spending or more purchase opportunities through re-engagement.

Remove `max-w-2xl` from the `#hero` intro wrapper. This lets the intro paragraphs and core-loop diagram use the same width as the feature content while preserving the page-level responsive padding and grid.

In the hero header, remove the desktop logo's `right-[60px]` inset and place it at `right-0`, so its right edge aligns with the intro and feature content. Remove `max-w-2xl` from the contact row so its border and contact details span the same column width. Preserve the existing logo size at every breakpoint.

## Scope

- Change only the intro copy, intro wrapper width, desktop logo position, and hero contact-row width.
- Preserve all typography, vertical spacing, page padding, navigation, and section layouts.
- Preserve the existing desktop-logo sizing classes without introducing breakpoint-specific resizing.
- Do not change prototype or demo files.
- Do not alter mobile behavior beyond inheriting the existing full available width.

## Verification

- Add a regression test for the exact approved sentence.
- Add a regression test that the intro wrapper no longer has `max-w-2xl`.
- Add regression assertions that the desktop logo uses `right-0`, no longer uses `right-[60px]`, and keeps its existing height classes.
- Add a regression assertion that the contact row no longer has `max-w-2xl`.
- Run the focused assignment test suite and full test suite.
- Run a production build.
- Visually verify the intro, logo, and contact-row right edges against the main content column, and confirm mobile has no horizontal overflow.
