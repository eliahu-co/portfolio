# Mobile Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three mobile UX issues: scroll-lock the tap-to-enter overlay in PanelScene, scale down the 3D model so it fits a phone viewport, and redesign the About section's mobile layout so the photo fills the section with bio overlaid on it.

**Architecture:** Two files only — `components/PanelScene.tsx` (overlay + 3D scale) and `components/About.tsx` (layout redesign). Desktop layouts are untouched.

**Tech Stack:** React 18, Next.js 15 (App Router, `'use client'`), Tailwind CSS, Three.js, GSAP ScrollTrigger.

---

### Task 1: PanelScene — scroll lock, full-screen overlay, mobile scale + bleed

**Files:**
- Modify: `components/PanelScene.tsx`

**Context:** The overlay is currently `absolute inset-0` inside a container that bleeds `-20vw` left/right. On mobile the overlay doesn't cover the full viewport and the user can scroll under it. The 3D model uses `SCALE = 130` which is too large for portrait phone viewports.

- [ ] **Step 1: Add `mobileBleed` state**

After `const labelRefs = useRef(...)` (line ~130), add:

```tsx
const [mobileBleed, setMobileBleed] = useState(false)
```

- [ ] **Step 2: Add mobile-bleed detection + scroll-lock effects**

After the existing `handleOverlayTap = useCallback(...)` block, add two new effects:

```tsx
useEffect(() => {
  setMobileBleed(isMobile())
}, [])

useEffect(() => {
  document.body.style.overflow = overlayVisible ? 'hidden' : ''
  return () => { document.body.style.overflow = '' }
}, [overlayVisible])
```

The scroll-lock effect sets `body.overflow = 'hidden'` while the overlay is visible and restores it on cleanup (handles unmount edge case).

- [ ] **Step 3: Change overlay positioning from `absolute` to `fixed`**

In the return JSX, find the overlay div. Change:
```tsx
className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer select-none"
```
To:
```tsx
className="fixed inset-0 z-30 flex flex-col items-center justify-center cursor-pointer select-none"
```

`fixed` pins the overlay to the viewport regardless of the container's `-20vw` bleed.

- [ ] **Step 4: Apply mobile-specific scale in the Three.js setup effect**

Inside the main `useEffect`, find:
```tsx
rootGroup.scale.setScalar(SCALE)
```
Change to:
```tsx
rootGroup.scale.setScalar(isMobile() ? 80 : SCALE)
```

`isMobile()` is safe here because this effect only runs on the client after mount. `80` vs `130` reduces the model to ~62% of desktop size; adjust if it still looks too large or too small on device.

- [ ] **Step 5: Apply mobile-specific bleed in the container div**

In the return JSX, find:
```tsx
style={{ top: 0, bottom: 0, left: '-20vw', right: '-20vw', zIndex: 0 }}
```
Change to:
```tsx
style={{ top: 0, bottom: 0, left: mobileBleed ? 0 : '-20vw', right: mobileBleed ? 0 : '-20vw', zIndex: 0 }}
```

On mobile, removing the bleed gives the renderer a 100vw canvas (saves GPU cost; gyro parallax doesn't need overscan).

- [ ] **Step 6: Type-check and commit**

```
npx tsc --noEmit
git add components/PanelScene.tsx
git commit -m "feat(mobile): scroll lock overlay, mobile scale 80, remove bleed on mobile"
```

Expected: no new TypeScript errors (pre-existing failures are OK).

---

### Task 2: About — mobile layout redesign

**Files:**
- Modify: `components/About.tsx`

**Context:** Current mobile layout: `[140×140 photo | tags column]` then bio below. New layout: large photo (flex: 3) with bio text absolutely overlaid at the bottom (image at 30% opacity), tags column (flex: 1) to the right. No fixed pixel sizes — the photo fills available width via flex.

**Complete new mobile JSX branch** (the `isMobileLayout ? (...)` arm):

```tsx
{isMobileLayout ? (
  /* ── Mobile: large photo with bio overlay | tags column ── */
  <div className="max-w-6xl mx-auto">
    <div ref={leftRef} className="flex gap-2 items-stretch">

      {/* Photo — left, takes most width, bio overlaid */}
      <div
        ref={photoRef}
        className="relative rounded-sm overflow-hidden"
        style={{ flex: 3, aspectRatio: '1' }}
        role="img"
        aria-label="Eliahu Cohen"
      >
        {/* Image layers wrapped at 30% opacity */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          {LAYERS.map(({ id, src }) => {
            const isActive = id === active
            const isPrev   = id === prev
            if (!isActive && !isPrev) return null
            return (
              <div
                key={id}
                className="absolute inset-0"
                style={{
                  zIndex:    isActive ? 2 : 1,
                  opacity:   isPrev ? 1 : undefined,
                  animation: isActive && prev !== null ? `photo-fade-in ${FADE_MS}ms ease forwards` : 'none',
                }}
              >
                <Image src={src} alt="" fill className="object-cover object-top" sizes="75vw" priority={id === 'center'} />
              </div>
            )
          })}
        </div>

        {/* Bio text overlaid at bottom */}
        <p
          ref={rightRef}
          className="absolute bottom-0 left-0 right-0 font-sans text-[12px] leading-relaxed font-medium text-ink/90 px-3 py-3"
          style={{ background: 'linear-gradient(to top, rgba(245,245,245,0.95) 60%, transparent)' }}
        >
          {bioText}
        </p>
      </div>

      {/* Tags — right column, stretches to match photo height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {SKILL_TAGS.map((tag) => (
          <span
            key={tag}
            className="font-sans text-[8px] uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-sm cursor-default transition-all duration-150"
            style={activeTag === tag
              ? { background: '#ff6b35', border: '1.5px solid #ff6b35', color: '#fff' }
              : { border: '1.5px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}
            onClick={() => {
              const isDepin = tag === pinnedTag
              const newPinned = isDepin ? null : tag
              pinnedTagRef.current = newPinned
              setPinnedTag(newPinned ?? 'Architecture')
              setActiveTag(newPinned ?? 'Architecture')
              scrambleTo(TAG_BIO[newPinned ?? 'Architecture'] ?? DEFAULT_BIO)
              if (!isDepin) {
                if (clearTimer.current) clearTimeout(clearTimer.current)
                setPrev(activeRef.current)
                activeRef.current = 'right'
                setActive('right')
                clearTimer.current = setTimeout(() => setPrev(null), FADE_MS)
              }
            }}
          >
            {tag}
          </span>
        ))}
      </div>

    </div>
  </div>
) : (
  /* ── Desktop: 2-column grid (UNCHANGED) ── */
  ...
```

Steps:

- [ ] **Step 1: Remove `photoHeight` state and ResizeObserver**

Delete this line:
```tsx
const [photoHeight, setPhotoHeight] = useState(0)
```

Replace the mobile-detect `useEffect` with the version below (removes the ResizeObserver that was only needed to match the tags height to the fixed 140px photo):

```tsx
useEffect(() => {
  setIsMobileLayout(window.innerWidth < 768)
}, [])
```

- [ ] **Step 2: Update the GSAP animation effect**

The bio `<p>` is now `position: absolute` inside an `overflow: hidden` photo. A `y: 40` translate would clip it at the bottom. Use `isMobile()` (safe inside a `useEffect`) to skip the y-translate on mobile, and use `leftRef` as the ScrollTrigger trigger for the bio animation (since `rightRef` is now a positioned child of `photoRef`, not a block element with its own scroll position).

Replace the entire GSAP `useEffect` with:

```tsx
useEffect(() => {
  const mobile = window.innerWidth < 768
  const ctx = gsap.context(() => {
    gsap.from(leftRef.current, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: leftRef.current, start: 'top 80%', once: true },
    })
    gsap.from(rightRef.current, {
      opacity: 0,
      ...(mobile ? {} : { y: 40 }),
      duration: 0.8, delay: 0.15, ease: 'power2.out',
      scrollTrigger: { trigger: leftRef.current, start: 'top 80%', once: true },
    })
  })
  return () => ctx.revert()
}, [])
```

- [ ] **Step 3: Update section padding**

Find the section opening tag:
```tsx
<section id="about" className="relative px-8 py-16 md:px-16 lg:px-24"
```
Change to:
```tsx
<section id="about" className="relative px-4 py-16 md:px-16 lg:px-24"
```

`px-4` (16px) on mobile instead of `px-8` (32px) gives the image more horizontal room. `md:px-16` takes over at ≥768px.

- [ ] **Step 4: Replace the mobile JSX branch**

Replace the entire `{isMobileLayout ? ( ... ) : (` arm up to (but not including) the `/* ── Desktop ──` comment with the new layout from the **Complete new mobile JSX branch** block above.

Keep the desktop branch (`else` arm) exactly as-is.

- [ ] **Step 5: Type-check and commit**

```
npx tsc --noEmit
git add components/About.tsx
git commit -m "feat(mobile): About redesign — large photo, bio overlay, smaller tags"
```

Expected: no new TypeScript errors.
