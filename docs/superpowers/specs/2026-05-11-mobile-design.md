# Mobile Experience Design

## Goal

Replace the current `MobileGate` placeholder with a full mobile portfolio experience. Every desktop section is present; mouse-driven interactions are replaced with gyroscope (3D panel) and scroll/touch equivalents (eyes, work strip).

---

## Decisions

| Feature | Desktop | Mobile |
|---|---|---|
| MobileGate | Blocks mobile | Removed — always renders children |
| Hero / PanelScene 3D | Mouse parallax | Gyroscope (tap-to-enter overlay on iOS) |
| About — eye tracking | Mouse position → gaze layer | Scroll position → gaze layer + tap tag → eyes right |
| About — skill tags layout | Horizontal wrap above bio | Vertical column beside photo, height = photo height |
| WorkBanner navigation | Click directional arrow cursor | Swipe left / right gesture |
| Skill tags interaction | Hover to preview, click to pin | Tap to pin (already works via onClick) |
| WhatIDo cards | Hover + click | Tap (already works) |
| Cursor | Custom crosshair | Hidden (not applicable on touch) |
| Tooltip | Follows mouse | Hidden (no hover on touch) |
| FloatNav | Works | No change |

---

## Feature Specs

### 1. MobileGate — remove gate

`components/MobileGate.tsx` currently renders a static orange placeholder for `window.innerWidth < 768`. Remove the gate: always render `{children}`. The component can be deleted entirely and removed from `app/layout.tsx`, or gutted to a passthrough.

---

### 2. Hero / PanelScene — gyroscope + tap-to-enter

**Tap-to-enter overlay (iOS permission gate)**

An absolutely-positioned full-screen overlay sits on top of the hero on mobile. It shows:
- "Eliahu Cohen" in Nabla font (large, same as Nameplate)
- "Tap to enter" in small uppercase below

On tap:
1. On iOS (`typeof DeviceOrientationEvent.requestPermission === 'function'`): call `DeviceOrientationEvent.requestPermission()`. If granted, proceed. If denied, remove overlay and fall back to scroll-driven rotation.
2. On Android/others: permission not required — proceed immediately.
3. Capture the current `beta` and `gamma` as the **neutral orientation**.
4. Fade the overlay out (`opacity → 0`, then `display: none`).

**Gyroscope handler**

```ts
// Neutral captured at tap time
let neutralBeta  = 0  // front/back tilt when upright
let neutralGamma = 0  // left/right tilt

const onOrientation = (e: DeviceOrientationEvent) => {
  if (e.beta === null || e.gamma === null) return
  const dx = (e.gamma - neutralGamma) / 20   // ±20° → ±1
  const dy = (e.beta  - neutralBeta)  / 20
  mouseX = Math.max(-1, Math.min(1, dx))
  mouseY = Math.max(-1, Math.min(1, dy))
}
window.addEventListener('deviceorientation', onOrientation)
```

`mouseX` / `mouseY` feed the existing `PARALLAX_STRENGTH` LERP in the render loop — no other changes to the 3D code.

**Scroll-driven fallback (iOS permission denied)**

If permission is denied, add a `scroll` listener that maps `window.scrollY / heroHeight` to a gentle Y rotation, so the panel still animates on mobile.

---

### 3. About — scroll-driven eye gaze

**Gaze layer selection**

On mobile, replace the `mousemove` listener with an `IntersectionObserver` (or `scroll` listener reading `getBoundingClientRect`) on the photo container:

```ts
const getScrollGaze = (photoRef: RefObject<HTMLDivElement>): LayerId => {
  const rect = photoRef.current?.getBoundingClientRect()
  if (!rect) return 'center'
  const vh = window.innerHeight
  const midY = rect.top + rect.height / 2
  const third = vh / 3
  if (midY > vh * 0.67) return 'up'       // photo in bottom third → eyes look up
  if (midY < vh * 0.33) return 'down'     // photo in top third → eyes look down
  return 'center'
}
```

A `scroll` event listener (passive, throttled via `requestAnimationFrame`) calls `getScrollGaze` and updates the active layer.

**Skill tag tap → eyes right**

When a tag is tapped/clicked (`onClick`), after pinning the tag, also set the active gaze layer to `'right'`. When the tag is de-pinned (tap same tag again), revert to the scroll-based gaze.

```ts
const handleTagClick = (tag: string) => {
  const newPinned = tag === pinnedTag ? null : tag
  setPinnedTag(newPinned)
  setActiveTag(newPinned ?? activeTag)
  if (isMobile()) {
    setMobileGaze(newPinned ? 'right' : getScrollGaze(photoRef))
  }
}
```

**Layout change (mobile only)**

The right column changes from a stacked layout (tags above bio) to a side-by-side layout (photo | tags, bio below):

```tsx
// Mobile layout:
<div className="flex gap-3 items-start">
  {/* photo — existing left column, unchanged */}
  <div ref={photoRef} className="...existing...">...</div>

  {/* tags — vertical column, height matches photo */}
  <div style={{ height: photoHeight, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    {SKILL_TAGS.map(tag => <span ...>{tag}</span>)}
  </div>
</div>

{/* bio — full width below the row */}
<p className="...">{bioText}</p>
```

`photoHeight` is read via a `ResizeObserver` attached to `photoRef` in a `useEffect`, stored in a `useState<number>`. Initial value `0` (tags column is invisible until measured).

The two-column grid (`md:grid-cols-2`) remains for desktop; the mobile layout applies below `md` breakpoint.

---

### 4. WorkBanner — swipe gesture

Add `touchstart` / `touchend` listeners to the banner container:

```ts
let touchStartX = 0

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX
}
const onTouchEnd = (e: TouchEvent) => {
  const delta = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(delta) < 50) return   // ignore taps
  goTo(delta < 0 ? 1 : -1)
}
```

Attach to the outer `<div>` via `onTouchStart` / `onTouchEnd` React props. Remove `cursor: none` style on mobile (already guarded by `n === 0` check pattern — add `isMobile()` guard).

---

### 5. Cursor + Tooltip — hide on mobile

**Cursor.tsx:** Return `null` early if `window.innerWidth < 768`.

**Tooltip.tsx:** Return `null` early if `window.innerWidth < 768`. (Tooltips require hover; touch devices fire `touchstart` not `mouseover`.)

Both checks should use a `useState` initialized in `useEffect` to avoid SSR mismatch.

---

## What does NOT change

- GSAP scroll animations (already work on mobile)
- FloatNav (already works on mobile)
- WhatIDo card click behaviour
- Skill tag scramble effect
- WorkBanner auto-advance timer
- All desktop behaviour — every change is guarded by `isMobile()` or a responsive class

---

## Responsive breakpoint

`isMobile()` is already defined in PanelScene as `window.innerWidth < 768`. Use the same threshold consistently across all components. For CSS, use Tailwind's `md:` prefix (768px).
