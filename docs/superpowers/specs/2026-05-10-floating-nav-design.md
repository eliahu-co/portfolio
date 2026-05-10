# Floating Nav & Hero Background — Design Spec
Date: 2026-05-10

## Overview

Replace the fixed top header with a centered floating bottom nav block and a separate scroll-to-top button. Change the hero background from dark (`#1a1a1a`) to `#D6D6D6` and update text colors accordingly.

## Components

### Delete
- `components/Nav.tsx`
- `__tests__/Nav.test.tsx`

### Create: `components/FloatNav.tsx`

Single `'use client'` component. Contains two fixed-position elements sharing one scroll listener.

**Nav block**
- Position: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50`
- Shape: `rounded-[8px]`, background `#1a1a1a`, `overflow-hidden`
- Shadow: `box-shadow: 0 6px 28px rgba(0,0,0,0.28)`
- Always visible (no hide/show logic — it is the only navigation)

**Progress bar**
- Inside the block, `position: absolute top-0 left-0 right-0`, height `3px`
- Track: `rgba(255,255,255,0.07)`
- Fill: `#c8a84a` (existing `--color-accent-warm`)
- Width computed: `scrollY / (document.body.scrollHeight - innerHeight) * 100`%

**Nav links**
- Three anchors: About (`#about`) · What I Do (`#what-i-do`) · Contact (`#contact`)
- Font: `11px`, uppercase, `letter-spacing: 0.12em`
- Active section: `color: #fff, opacity: 1`; inactive: `opacity: 0.45`
- Thin vertical dividers (`1px`, `rgba(255,255,255,0.18)`, `14px` tall) between links
- Padding: `16px 8px` (top/bottom), `20px` per link horizontal
- Active section detected via `IntersectionObserver` on `#about`, `#what-i-do`, `#contact`
  - `rootMargin: '-40% 0px -40% 0px'` — triggers when section occupies the middle 20% of the viewport

**Scroll-to-top button**
- Position: `fixed bottom-6 right-6 z-50`
- Size: `36×36px`, `rounded-[6px]`, background `#1a1a1a`
- Shadow: same as nav block
- Icon: upward chevron, white, `stroke-width: 1.5`
- Visibility: hidden when `scrollY <= window.innerHeight * 0.9`; visible with a short opacity/translate transition
- On click: `window.scrollTo({ top: 0, behavior: 'smooth' })`

**Shared scroll listener**
- Single `useEffect` adds one passive `scroll` listener
- Updates: `scrollProgress` (number 0–1) and `scrolled` (boolean) state
- Cleans up on unmount

### Modify: `components/Hero.tsx`

| Element | Before | After |
|---|---|---|
| `<section>` background | `bg-ink` (className) | `style={{ backgroundColor: '#D6D6D6' }}` |
| `<h1>` color | `text-canvas` | `text-ink` |
| Divider | `bg-canvas/30` | `bg-ink/20` |
| Subtitle | `text-canvas/60` | `text-ink/60` |
| Scroll CTA label | `text-canvas/40` | `text-ink/40` |
| Scroll CTA chevron | `text-canvas/40` | `text-ink/40` |

### Modify: `app/page.tsx`

- Replace `import Nav` → `import FloatNav`
- Replace `<Nav />` → `<FloatNav />`

## Behavior Notes

- No mobile-specific breakpoint changes needed for the initial implementation — three short labels fit at `11px` on most phones. Revisit if testing shows overflow.
- The `IntersectionObserver` instance observes all three section elements; whichever last enters the middle band is the active link.
- When no section is in the middle band (e.g. at the very top in the hero), no link is highlighted (all at 0.45 opacity).
