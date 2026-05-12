# Gyro-Fallback + Skeleton Loaders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix mobile gyro-denied parallax to hold base rotation, and add blue shimmer skeleton loaders to the work strip and 3D hero while content loads.

**Architecture:** Four small changes — render-loop condition edit in PanelScene, shared CSS keyframe in globals.css, skeleton JSX in WorkBanner, skeleton state + JSX in PanelScene. No new files. No new dependencies.

**Tech Stack:** Next.js 15, React 18, Three.js, Tailwind CSS, plain CSS keyframes

---

### Task 1: Gyro-denied parallax fix

**Files:**
- Modify: `components/PanelScene.tsx`

- [ ] **Step 1: Remove `scrollFallback.current` from the render-loop guard**

  In `components/PanelScene.tsx`, find this line (inside the `animate` function, around line 292):

  ```tsx
  if (!isMobile() || gyroActiveRef.current || scrollFallback.current) {
  ```

  Change it to:

  ```tsx
  if (!isMobile() || gyroActiveRef.current) {
  ```

  This makes the scene hold `BASE_ROTATION` when gyro is denied on mobile. `mouseX`/`mouseY` stay 0, so the lerp target is always the base angle.

- [ ] **Step 2: Delete the `onScrollFb` scroll listener block**

  Still in `components/PanelScene.tsx`, find and replace this block (inside the `if (isMobile())` section near the bottom of the main `useEffect`, around line 534):

  **Before:**
  ```tsx
      const heroEl = document.getElementById('hero')
      const onScrollFb = () => {
        if (!scrollFallback.current) return
        const heroH = heroEl?.offsetHeight ?? window.innerHeight
        mouseY = Math.max(-1, Math.min(1, (window.scrollY / heroH) * 2 - 1))
      }
      window.addEventListener('scroll', onScrollFb, { passive: true })
      removeScrollFb = () => {
        window.removeEventListener('scroll', onScrollFb)
        window.removeEventListener('deviceorientation', probe)
        clearTimeout(probeTimer)
      }
  ```

  **After:**
  ```tsx
      removeScrollFb = () => {
        window.removeEventListener('deviceorientation', probe)
        clearTimeout(probeTimer)
      }
  ```

  The probe cleanup lines are kept — only the scroll listener is removed.

- [ ] **Step 3: Visual check**

  Run `npm run dev`. Open on a mobile device (or Chrome DevTools mobile emulation). Tap "Tap to enter" then deny gyro permission (or test with a device that doesn't have gyro). Scroll down through the hero — the 3D model should stay at its base tilt while layers explode outward. It should **not** tilt/rock as you scroll.

- [ ] **Step 4: Commit**

  ```bash
  git add components/PanelScene.tsx
  git commit -m "fix(mobile): hold base rotation when gyro denied — no scroll parallax"
  ```

---

### Task 2: Add shared skeleton CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append skeleton keyframe and classes to globals.css**

  Add the following at the **end** of `app/globals.css`:

  ```css
  /* Skeleton loaders — shimmer shared by work strip and 3D hero */
  @keyframes skeleton-shimmer {
    0%   { background-position: -200% 0 }
    100% { background-position:  200% 0 }
  }

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

- [ ] **Step 2: Commit**

  ```bash
  git add app/globals.css
  git commit -m "style: add skeleton-shimmer keyframe + wb-skeleton-slot + hero-skeleton"
  ```

---

### Task 3: Work strip skeleton

**Files:**
- Modify: `components/WorkBanner.tsx`

- [ ] **Step 1: Add skeleton overlay inside the outer container**

  In `components/WorkBanner.tsx`, find the outer `<div>` that wraps everything (the one with `className="relative w-full overflow-hidden h-[72vh] md:h-[80vh]"`, around line 286). Inside it, directly before the strip `<div ref={stripRef} ...>`, add:

  ```tsx
  {!stripReady && (
    <div className="absolute inset-0 flex items-center justify-center gap-[2vw] px-[4vw] pointer-events-none">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="wb-skeleton-slot" />
      ))}
    </div>
  )}
  ```

  `stripReady` is already declared in this component (`const [stripReady, setStripReady] = useState(false)`). When it flips to `true`, this node unmounts and the strip div's existing `opacity 0.3s` transition fades the images in simultaneously.

- [ ] **Step 2: Visual check**

  Run `npm run dev`. Open the work strip section. On a slow connection (DevTools → Network → Slow 3G), you should see four shimmering blue-tinted portrait-ratio boxes on the orange background before images load, then they disappear as the strip fades in.

- [ ] **Step 3: Commit**

  ```bash
  git add components/WorkBanner.tsx
  git commit -m "feat: work strip skeleton — 4 shimmer slots while images load"
  ```

---

### Task 4: 3D hero skeleton

**Files:**
- Modify: `components/PanelScene.tsx`

- [ ] **Step 1: Add `sceneReady` state**

  In `components/PanelScene.tsx`, find the existing state declarations at the top of the component (around line 134). Add `sceneReady` directly after `overlayVisible`:

  **Before:**
  ```tsx
  const [overlayVisible, setOverlayVisible] = useState(false)
  ```

  **After:**
  ```tsx
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [sceneReady,     setSceneReady]     = useState(false)
  ```

- [ ] **Step 2: Set `sceneReady` when the GLB finishes loading**

  Inside the `loader.load` success callback, find the last `LAYER_NAMES.forEach` block that locks label anchors (around line 457). Add `setSceneReady(true)` immediately after it closes, before the `},` that ends the success callback:

  **Before:**
  ```tsx
          layerAnchors[name] = worldAnchor
        })

      },
      undefined,
  ```

  **After:**
  ```tsx
          layerAnchors[name] = worldAnchor
        })

        setSceneReady(true)
      },
      undefined,
  ```

- [ ] **Step 3: Render the skeleton in JSX**

  In the `return` block of `PanelScene`, find the `{overlayVisible && (...)}` block (around line 565). Add the hero skeleton **after** it:

  **Before:**
  ```tsx
      {overlayVisible && (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center cursor-pointer select-none"
          ...
        >
          ...
        </div>
      )}

      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
  ```

  **After:**
  ```tsx
      {overlayVisible && (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center cursor-pointer select-none"
          ...
        >
          ...
        </div>
      )}

      {!sceneReady && !overlayVisible && (
        <div className="hero-skeleton" />
      )}

      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
  ```

  The condition `!overlayVisible` ensures the skeleton is hidden behind the "Tap to enter" overlay on mobile — it only surfaces after the overlay dismisses, if the GLB hasn't loaded yet.

- [ ] **Step 4: Visual check**

  Run `npm run dev`. On a slow connection (DevTools → Network → Slow 3G), reload the page. On desktop you should see a gentle blue shimmer across the hero background before the 3D model appears. On mobile, open the page, dismiss the overlay — if the GLB is still loading you should see the shimmer briefly, then the model fades in.

- [ ] **Step 5: Commit**

  ```bash
  git add components/PanelScene.tsx
  git commit -m "feat: 3D hero skeleton — shimmer until GLB loads"
  ```

---

### Task 5: Push and open PR

- [ ] **Step 1: Push branch and open PR**

  ```bash
  git push
  ```

  Then confirm with user before merging to main.
