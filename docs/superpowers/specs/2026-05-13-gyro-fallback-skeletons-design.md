# Gyro-Denied Fallback + Skeleton Loaders

**Date:** 2026-05-13
**Scope:** Mobile + desktop, PanelScene and WorkBanner

---

## Overview

Two independent improvements:

1. **Gyro-denied parallax fix** — when the user denies gyroscope permission on mobile, the 3D scene should hold a fixed base rotation instead of mirroring scroll position as a parallax proxy. The scroll-driven layer explosion (GSAP ScrollTrigger) is unaffected.

2. **Skeleton loaders** — a blue-shimmer skeleton appears while heavy content loads (3D GLB, work strip images) and auto-dismisses when the content is ready. No text, no spinner — just a shimmer placeholder.

---

## Part 1: Gyro-Denied Parallax Fix

### Current behaviour

`PanelScene.tsx` has a scroll fallback path: when `scrollFallback.current = true` (gyro denied or error), an `onScrollFb` listener sets `mouseY` from `window.scrollY / heroHeight`. The render loop then uses that `mouseY` to drive a parallax tilt, making the scene rock as the user scrolls.

### Target behaviour

When gyro is denied, the scene stays at `BASE_ROTATION` permanently. The user gets the layer explosion on scroll (GSAP ScrollTrigger drives `scrollProgress`), but no tilt.

### Changes

**`components/PanelScene.tsx`**

1. **Render loop condition** — remove `scrollFallback.current` from the guard:
   ```ts
   // Before
   if (!isMobile() || gyroActiveRef.current || scrollFallback.current) { /* parallax */ }
   // After
   if (!isMobile() || gyroActiveRef.current) { /* parallax */ }
   ```
   When gyro is denied on mobile, the condition is false → `currentRotX/Y` never updates → scene holds `BASE_ROTATION`.

2. **Delete `onScrollFb` listener** — the listener that sets `mouseY` from scroll is no longer needed. Remove only that `addEventListener`/`removeEventListener` pair. The `removeScrollFb` cleanup function also removes the `deviceorientation` probe listener and clears the probe timer — keep those two cleanups; just remove the scroll listener line.

3. **Keep `scrollFallback.current`** — the flag can stay; it is set by the denied-permission path and is harmless with the listener removed (nothing reads it for parallax anymore).

No changes to GSAP ScrollTrigger, layer explosion, or the probe/overlay flow.

---

## Part 2: Work Strip Skeleton

### Current behaviour

`WorkBanner.tsx` tracks `stripReady` (false until all images have loaded). While false, the strip div has `opacity: 0`. The orange container background is always visible — so the user sees a blank orange rectangle during load.

### Target behaviour

While `!stripReady`, show four image-shaped placeholder boxes over the orange background with a left-to-right blue shimmer. When `stripReady` flips, the skeleton fades out as the strip fades in.

### Changes

**`app/globals.css`**

Add a shared shimmer keyframe (reused by both skeletons):

```css
@keyframes skeleton-shimmer {
  0%   { background-position: -200% 0 }
  100% { background-position:  200% 0 }
}
```

**`components/WorkBanner.tsx`**

Render a skeleton overlay inside the outer container, conditionally visible:

```tsx
{!stripReady && (
  <div className="absolute inset-0 flex items-center justify-center gap-[2vw] px-[4vw] pointer-events-none">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="wb-skeleton-slot" />
    ))}
  </div>
)}
```

**`app/globals.css`** (skeleton slot style):

```css
.wb-skeleton-slot {
  height: 80%;
  aspect-ratio: 3 / 4;
  flex-shrink: 0;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    rgba(0,0,255,0.08) 25%,
    rgba(0,0,255,0.18) 50%,
    rgba(0,0,255,0.08) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}
```

The skeleton mounts/unmounts with `stripReady`. No additional transition needed — the strip's existing `opacity 0.3s` covers the crossfade.

---

## Part 3: 3D Hero Skeleton

### Current behaviour

The GLB loads asynchronously after the component mounts. On desktop, users see a blank transparent canvas until the model appears. On mobile, the "Tap to enter" overlay covers the canvas, so the blank is hidden — but if the GLB hasn't finished loading by the time the overlay dismisses, users see a brief blank hero.

### Target behaviour

Show a full-hero blue shimmer skeleton while `!sceneReady`. On mobile, only surface it after the overlay dismisses (overlay already covers it). Disappears automatically when the GLB finishes loading.

### Changes

**`components/PanelScene.tsx`**

1. Add state:
   ```ts
   const [sceneReady, setSceneReady] = useState(false)
   ```

2. At the end of the `loader.load` success callback (after label anchors are locked):
   ```ts
   setSceneReady(true)
   ```

3. In JSX, render the skeleton alongside the canvas:
   ```tsx
   {!sceneReady && !overlayVisible && (
     <div className="hero-skeleton" />
   )}
   ```

**`app/globals.css`**

```css
.hero-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0,0,255,0.04) 25%,
    rgba(0,0,255,0.10) 50%,
    rgba(0,0,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}
```

The hero skeleton is more subtle than the work strip (lower opacity) because the hero background is already `#f5f5f5` — the shimmer just needs to signal activity, not fill a coloured void.

---

## Shared CSS

One `@keyframes skeleton-shimmer` in `globals.css`, used by both `.wb-skeleton-slot` and `.hero-skeleton`.

---

## Out of scope

- Skeleton for the About section (images are small and load fast)
- Skeleton for the FloatNav or Nameplate
- Any spinner fallback — skeleton only
