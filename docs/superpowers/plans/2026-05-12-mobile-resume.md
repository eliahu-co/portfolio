# Mobile Branch — Resume Context

**Branch:** `mobile`  
**Last complete commit:** `9a2c5e8` feat(mobile): swipe left/right gesture for WorkBanner  
**Plan file:** `docs/superpowers/plans/2026-05-11-mobile.md`

---

## What's done (Tasks 1–3)

| Task | Commit | Status |
|------|--------|--------|
| MobileGate passthrough | b5710d2 | ✅ |
| Cursor + Tooltip hide on mobile | f4285b3 | ✅ |
| WorkBanner swipe gesture | 9a2c5e8 | ✅ |

---

## What remains

### Task 4: About — mobile layout + scroll-driven gaze

**File:** `components/About.tsx` only

Three changes in one commit:

#### 4a. Add state + refs (after line ~95, after `const [prev, setPrev]`)

```tsx
const [isMobileLayout, setIsMobileLayout] = useState(false)
const [photoHeight, setPhotoHeight]       = useState(0)
const pinnedTagRef = useRef<string | null>('Architecture')
```

#### 4b. Add mobile-detect + ResizeObserver useEffect (after the GSAP animation useEffect, after line ~111)

```tsx
useEffect(() => {
  const mobile = window.innerWidth < 768
  setIsMobileLayout(mobile)
  if (!mobile) return
  const el = photoRef.current
  if (!el) return
  const ro = new ResizeObserver(([entry]) => setPhotoHeight(entry.contentRect.height))
  ro.observe(el)
  return () => ro.disconnect()
}, [])
```

#### 4c. Replace the existing mousemove useEffect (lines ~113-131) entirely

```tsx
useEffect(() => {
  const setGaze = (next: LayerId) => {
    if (next === activeRef.current) return
    if (clearTimer.current) clearTimeout(clearTimer.current)
    setPrev(activeRef.current)
    activeRef.current = next
    setActive(next)
    clearTimer.current = setTimeout(() => setPrev(null), FADE_MS)
  }

  if (!isMobileLayout) {
    // Desktop: mouse-driven gaze
    const onMove = (e: MouseEvent) => {
      const rect = photoRef.current?.getBoundingClientRect()
      if (!rect) return
      setGaze(getGaze(e.clientX, e.clientY, rect))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (clearTimer.current) clearTimeout(clearTimer.current)
    }
  }

  // Mobile: scroll-driven gaze
  const getScrollGaze = (): LayerId => {
    const rect = photoRef.current?.getBoundingClientRect()
    if (!rect) return 'center'
    const midY = rect.top + rect.height / 2
    if (midY > window.innerHeight * 0.67) return 'up'
    if (midY < window.innerHeight * 0.33) return 'down'
    return 'center'
  }

  let rafId = 0
  const onScroll = () => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      if (pinnedTagRef.current) return
      setGaze(getScrollGaze())
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
    if (clearTimer.current) clearTimeout(clearTimer.current)
  }
}, [isMobileLayout])
```

#### 4d. Replace the entire return (section JSX) with this conditional layout

```tsx
return (
  <section id="about" className="relative px-8 py-16 md:px-16 lg:px-24" style={{ zIndex: 1, background: '#f5f5f5' }}>

    {isMobileLayout ? (
      /* ── Mobile: [photo | tags column] then bio ── */
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        <div ref={leftRef} className="flex gap-3 items-start">
          {/* Photo */}
          <div
            ref={photoRef}
            className="relative flex-shrink-0 rounded-sm overflow-hidden"
            style={{ width: 140, height: 140 }}
            role="img"
            aria-label="Eliahu Cohen"
          >
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
                  <Image src={src} alt="" fill className="object-cover object-top" sizes="140px" priority={id === 'center'} />
                </div>
              )
            })}
          </div>

          {/* Vertical tags column — height matches photo */}
          <div style={{ height: photoHeight || 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[9px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm cursor-default transition-all duration-150"
                style={activeTag === tag
                  ? { background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff' }
                  : { border: '2px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}
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

        {/* Bio — full width below the row */}
        <p ref={rightRef} className="font-sans text-[15px] leading-relaxed font-medium text-ink/80">
          {bioText}
        </p>

      </div>
    ) : (
      /* ── Desktop: 2-column grid ── */
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-1 items-start">

        {/* Left column — photo */}
        <div ref={leftRef} className="relative w-full aspect-square max-w-sm">
          <div
            ref={photoRef}
            className="absolute inset-0"
            role="img"
            aria-label="Eliahu Cohen"
            onMouseEnter={() => showTooltip('Me')}
            onMouseLeave={hideTooltip}
          >
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
                  <Image src={src} alt="" fill className="object-cover object-top rounded-sm" sizes="(max-width: 768px) 100vw, 50vw" priority={id === 'center'} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column — tags + bio */}
        <div ref={rightRef} className="pt-4 flex flex-col gap-8">
          <div className="flex flex-wrap gap-1.5">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[10px] uppercase tracking-[0.06em] px-2 py-0.5 rounded-sm cursor-default transition-all duration-150"
                style={activeTag === tag
                  ? { background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff' }
                  : { border: '2px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}
                onMouseEnter={() => { showTooltip('Click'); if (tag === pinnedTag) return; setActiveTag(tag); scrambleTo(TAG_BIO[tag] ?? DEFAULT_BIO) }}
                onMouseLeave={() => { hideTooltip(); if (tag === pinnedTag) return; setActiveTag(pinnedTag); scrambleTo(TAG_BIO[pinnedTag] ?? DEFAULT_BIO) }}
                onClick={() => {
                  pinnedTagRef.current = tag
                  setPinnedTag(tag)
                  setActiveTag(tag)
                  scrambleTo(TAG_BIO[tag] ?? DEFAULT_BIO)
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="font-sans text-[17px] leading-relaxed font-medium text-ink/80">
            {bioText}
          </p>
        </div>

      </div>
    )}

  </section>
)
```

**Commit:** `git add components/About.tsx && git commit -m "feat(mobile): scroll-driven eye gaze, mobile About layout, tap-to-pin eyes right"`

---

### Task 5: PanelScene — gyroscope + tap-to-enter overlay

**File:** `components/PanelScene.tsx` only

#### 5a. Add useState to imports (line 4)
`import { useEffect, useRef, useState } from 'react'`

#### 5b. Add refs + state inside component (after `const labelRefs` line ~130)

```tsx
const [overlayVisible, setOverlayVisible] = useState(false)
const neutralRef     = useRef({ beta: 0, gamma: 0 })
const lastOrientRef  = useRef({ beta: 0, gamma: 0 })
const gyroActiveRef  = useRef(false)
const scrollFallback = useRef(false)
```

#### 5c. Add handleOverlayTap handler (before the main useEffect)

```tsx
const handleOverlayTap = async () => {
  type DOEWithPerm = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }
  if (typeof (DeviceOrientationEvent as DOEWithPerm).requestPermission === 'function') {
    try {
      const perm = await (DeviceOrientationEvent as DOEWithPerm).requestPermission!()
      if (perm !== 'granted') {
        scrollFallback.current = true
        setOverlayVisible(false)
        return
      }
    } catch {
      scrollFallback.current = true
      setOverlayVisible(false)
      return
    }
  }
  neutralRef.current = { ...lastOrientRef.current }
  gyroActiveRef.current = true
  setOverlayVisible(false)
}
```

#### 5d. Inside the main useEffect, add mobile listeners BEFORE the return cleanup

```tsx
let removeOrient: (() => void) | null = null
let removeScrollFb: (() => void) | null = null

if (isMobile()) {
  setOverlayVisible(true)

  const onOrientation = (e: DeviceOrientationEvent) => {
    lastOrientRef.current.beta  = e.beta  ?? lastOrientRef.current.beta
    lastOrientRef.current.gamma = e.gamma ?? lastOrientRef.current.gamma
    if (!gyroActiveRef.current) return
    const dx = (e.gamma - neutralRef.current.gamma) / 20
    const dy = (e.beta  - neutralRef.current.beta)  / 20
    mouseX = Math.max(-1, Math.min(1, dx))
    mouseY = Math.max(-1, Math.min(1, dy))
  }
  window.addEventListener('deviceorientation', onOrientation)
  removeOrient = () => window.removeEventListener('deviceorientation', onOrientation)

  const heroEl = document.getElementById('hero')
  const heroH  = heroEl?.offsetHeight ?? window.innerHeight
  const onScrollFb = () => {
    if (!scrollFallback.current) return
    mouseY = Math.max(-1, Math.min(1, (window.scrollY / heroH) * 2 - 1))
  }
  window.addEventListener('scroll', onScrollFb, { passive: true })
  removeScrollFb = () => window.removeEventListener('scroll', onScrollFb)
}
```

Update cleanup return to include:
```tsx
removeOrient?.()
removeScrollFb?.()
```

#### 5e. Update animate loop condition (currently `if (!isMobile())` around line 244)

```tsx
if (!isMobile() || gyroActiveRef.current || scrollFallback.current) {
```

#### 5f. Replace the component return JSX (add overlay before the labels div)

```tsx
return (
  <div ref={containerRef} className="fixed" style={{ top: 0, bottom: 0, left: '-20vw', right: '-20vw', zIndex: 0 }}>

    {overlayVisible && (
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer select-none"
        style={{ background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(4px)' }}
        onClick={handleOverlayTap}
      >
        <h1
          className="text-[18vw] leading-[1] tracking-tight text-ink"
          style={{ fontFamily: 'var(--font-nabla)' }}
        >
          Eliahu<br />Cohen
        </h1>
        <p className="font-sans text-[3.5vw] uppercase tracking-[0.2em] text-ink/50 mt-4">
          Tap to enter
        </p>
      </div>
    )}

    <div className="hidden md:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {LAYER_NAMES.filter(name => LAYER_CONFIG[name].label).map((name) => (
        <div
          key={name}
          ref={(el) => { labelRefs.current[name] = el }}
          className="absolute font-sans text-[10px] uppercase tracking-[0.1em] text-ink/50 whitespace-nowrap"
          style={{ opacity: 0, left: 0, top: 0 }}
        >
          {LAYER_CONFIG[name].label}
        </div>
      ))}
    </div>

  </div>
)
```

**Commit:** `git add components/PanelScene.tsx && git commit -m "feat(mobile): gyroscope parallax + tap-to-enter overlay for hero panel"`

---

## How to resume

When user says "resume mobile" or similar:

1. Tell user you're resuming from `docs/superpowers/plans/2026-05-12-mobile-resume.md`
2. Use subagent-driven-development skill
3. Tasks 1-3 already complete on `mobile` branch (last commit: 9a2c5e8)
4. Dispatch Task 4 implementer with the full Task 4 spec above (components/About.tsx) — use standard model (not haiku) since it's complex
5. After Task 4 passes both reviews: dispatch Task 5 implementer with the full Task 5 spec above (components/PanelScene.tsx)
6. After all tasks: run finishing-a-development-branch skill
