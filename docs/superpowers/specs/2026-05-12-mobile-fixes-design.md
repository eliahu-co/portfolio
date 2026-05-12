# Mobile Fixes — Design Spec

**Branch:** `mobile`  
**Date:** 2026-05-12  
**Files touched:** `components/PanelScene.tsx`, `components/About.tsx`

---

## Fix 1 — Tap-to-enter overlay locks scroll (PanelScene.tsx)

**Problem:** The overlay renders but the user can still scroll past it before tapping.

**Solution:**
- Add a `useEffect` keyed on `overlayVisible` that sets `document.body.style.overflow = overlayVisible ? 'hidden' : ''`. Cleanup restores `''` on unmount.
- Change the overlay element from `className="absolute inset-0 ..."` to `className="fixed inset-0 ..."`. The PanelScene container uses `left: '-20vw', right: '-20vw'` so `absolute` would bleed beyond the viewport; `fixed` pins it to the full viewport regardless.

---

## Fix 2 — 3D panel fits phone screen (PanelScene.tsx)

**Problem:** On mobile the wall model is too large — the canvas renders at 140vw and `SCALE = 130` was tuned for a wide desktop canvas.

**Solution:**
- Add `isMobileLayout` state (set once at mount with `window.innerWidth < 768`, same pattern as About.tsx).
- Pass mobile-aware scale to the root group: `rootGroup.scale.setScalar(isMobileLayout ? 75 : 130)`. This reduces the model to ~58% of desktop size so the wall fits within the viewport.
- Remove the `-20vw` bleed on mobile in the container's inline style: `left: isMobileLayout ? 0 : '-20vw', right: isMobileLayout ? 0 : '-20vw'`. On mobile, gyro-driven parallax doesn't need the overscan margin, and a 100vw canvas reduces GPU cost.

> **Note:** `isMobileLayout` state is set once at mount. It does not respond to viewport resize (same pattern as existing About.tsx). This is intentional — the Three.js scene is initialized once.

> **Scale tuning:** `75` is an estimate based on the wall's 14.2m width at `SCALE = 130` being too large for a portrait viewport. If the model still overflows or looks too small after implementation, adjust the mobile scale value.

---

## Fix 3 — About mobile layout redesign (About.tsx)

**Problem:** The current mobile layout places a small 140×140px photo next to a tall tags column, with bio text below. The photo is too small; tags are too large; bio is disconnected from the photo.

**New layout:**

```
┌──────────────────────────┬──────────┐
│  Photo (flex: 3)         │  tag     │
│  opacity: 0.3 on images  │  tag     │
│  Bio text at bottom,     │  tag     │
│  position: absolute      │  tag     │
│                          │  tag     │
│                          │  tag     │
│                          │  tag     │
└──────────────────────────┴──────────┘
```

**Structure changes:**

- **Row container:** `display: flex; gap: 8px` — photo gets `flex: 3`, tags column gets `flex: 1`.
- **Photo div:** `position: relative; aspect-ratio: 1; overflow: hidden; border-radius: 2px`. No fixed `width/height`.
- **Image opacity:** Wrap all `LAYERS` renders in a single `<div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>`. Bio text is a sibling outside this wrapper so it renders at full opacity.
- **Bio text:** `<p ref={rightRef}>` moves inside `photoRef` div as `position: absolute; bottom: 0; left: 0; right: 0`. Add a gradient background: `linear-gradient(to top, rgba(245,245,245,0.95) 50%, transparent)` so text is readable over the dimmed photo.
- **Tags:** `font-size: 8px` (down from 9px), `padding: 1px 4px` (down from `px-2 py-0.5`). Vertical column with `justify-content: space-between`, height matches photo via `align-self: stretch` on the tags container (height inherits from row).
- **Section padding:** Change `px-8` to `px-4` on mobile only — use `className="relative px-4 py-16 md:px-16 lg:px-24"`.
- **ResizeObserver:** The `photoHeight` state and ResizeObserver used to match tags height to the 140px photo are no longer needed — tags column height is controlled by `align-self: stretch` on the row. Remove them.
- **GSAP refs:** `leftRef` stays on the row container. `rightRef` moves to the bio `<p>` inside the photo. The GSAP `y: 40` translate on `rightRef` should be skipped on mobile (use `opacity` only) since the bio is `position: absolute` inside an `overflow: hidden` photo — a y-translate would clip it. Branch the GSAP call: apply `y: 40` only when `!isMobileLayout`.

---

## What does NOT change

- Desktop layout (`md:` and above) — untouched.
- Scroll-driven gaze logic — untouched.
- Tag tap-to-pin behavior — untouched.
- PanelScene gyroscope logic — untouched.
- Any other component.
