# Hero 80vh on Desktop — Scroll Affordance

**Date:** 2026-05-13
**Scope:** Desktop only (`md:` breakpoint and above), `components/Hero.tsx`

---

## Problem

The hero fills 100% of the viewport height on desktop. No content is visible below the fold on first load, so users don't know there is more to see and go straight to the FloatNav instead of scrolling.

## Solution

Reduce the hero section height to 80vh on desktop. The About section will peek ~20vh below the hero's orange bottom border, giving an immediate visual cue that content exists below.

## Change

**`components/Hero.tsx`**

The `<section>` element's height class changes from:

```
h-screen
```

to:

```
h-screen md:h-[80vh]
```

Mobile stays `h-screen` (full height). Desktop (`md:` = 768px+) becomes 80vh.

## Unchanged

- PanelScene canvas — `absolute inset-0`, resizes automatically with the section.
- GSAP ScrollTrigger — recalculates against the element's new dimensions; no code change needed.
- Scroll CTA — `absolute bottom-8`, stays anchored to the bottom of the hero section.
- FloatNav visibility logic — unaffected.
- All mobile layout — no change.

## Out of scope

- Adjusting hero height to any value other than 80vh.
- Changing mobile hero height.
- Any animation or transition on the hero height.
