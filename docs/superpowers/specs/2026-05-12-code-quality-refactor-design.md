# Code Quality Refactor — Design Spec

## Goal

Eliminate repeated constants, duplicated data, and inline magic values across the codebase without changing any behavior or visual output. Make the token system (`globals.css` CSS variables) the single source of truth for shared values.

## Architecture

Three new shared files feed into targeted mechanical substitutions across ~10 existing components. No component logic changes — only value sources change.

## Tech Stack

TypeScript, React, Next.js App Router, CSS custom properties, Tailwind CSS

---

## New Files

### `lib/tokens.ts`

Single source of truth for every value used in more than one TSX file:

```ts
export const ORANGE            = '#FF6B35'
export const ORANGE_HOVER      = '#FF895F'
export const GRAY_UI           = '#d4d4d4'
export const SHADOW_CARD       = '0 2px 16px rgba(26,26,26,0.08)'
export const MOBILE_BREAKPOINT = 768   // px
```

**Rule:** JS/TSX files that need these values import from here. CSS files use the CSS variables defined in `globals.css` (which mirrors the same values).

### `lib/site-data.ts`

Nav links and contact links currently duplicated across `Nameplate`, `FloatNav`, and `Contact`:

```ts
export const NAV_LINKS = [
  { label: 'Home',      href: '#hero',     id: 'hero'     },
  { label: 'About',    href: '#about',    id: 'about'    },
  { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
]

export type ContactLink = { label: string; href: string }

export const CONTACT_LINKS: ContactLink[] = [
  // exact values taken from Contact.tsx (source of truth)
]
```

`cv/page.tsx` has its own richer contact format (phone, address, etc.) and stays independent.

### `hooks/useScramble.ts`

Exact extraction of the `useScramble` hook currently inlined in `About.tsx`. Identical implementation, new location:

```ts
// hooks/useScramble.ts
'use client'
import { useState, useRef, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useScramble(initial: string) { /* ... */ }
```

`About.tsx` drops its local definition and imports from here.

---

## CSS Variable Additions — `app/globals.css`

Add to the existing `:root` block:

```css
--color-orange:       #FF6B35;
--color-orange-hover: #FF895F;
--color-gray-ui:      #d4d4d4;
--shadow-card:        0 2px 16px rgba(26,26,26,0.08);
```

These mirror the values in `lib/tokens.ts`. Components that only need the value in CSS (no conditional logic) use `var(--color-gray-ui)` etc. Components that toggle between values in JS import from `lib/tokens.ts`.

---

## Component Changes

All changes are mechanical value substitutions. No logic, props, or rendered structure changes.

### `WhatIDo.tsx`
- Remove local `const ORANGE = '#FF6B35'` and `const ORANGE_HOVER = '#FF895F'`
- Import `ORANGE`, `ORANGE_HOVER` from `lib/tokens.ts`

### `WorkBannerSwitcher.tsx`
- Replace hardcoded `'#FF6B35'` overlay color with `ORANGE` from `lib/tokens.ts`

### `About.tsx`
- Remove inline `useScramble` function and `CHARS` constant
- Import `useScramble` from `hooks/useScramble.ts`
- Replace `window.innerWidth < 768` with `window.innerWidth < MOBILE_BREAKPOINT` (import from tokens)
- Replace `'#ff6b35'` inline hex strings with `ORANGE` from tokens

### `Cursor.tsx`
- Replace `window.innerWidth < 768` with `window.innerWidth < MOBILE_BREAKPOINT`

### `Tooltip.tsx`
- Replace `window.innerWidth < 768` with `window.innerWidth < MOBILE_BREAKPOINT`

### `PanelScene.tsx`
- The internal `isMobile()` function uses `window.innerWidth < 768` — update that literal to `MOBILE_BREAKPOINT`

### `Nameplate.tsx`
- Replace `#d4d4d4` background → `var(--color-gray-ui)`
- Replace box-shadow literal → `var(--shadow-card)`
- Replace hardcoded border string → `var(--border)` (already defined in globals.css)
- Replace nav/contact link arrays with imports from `lib/site-data.ts`

### `FloatNav.tsx`
- Replace `#d4d4d4` background → `var(--color-gray-ui)`
- Replace box-shadow literal → `var(--shadow-card)`
- Replace `LINKS` local array with `NAV_LINKS` from `lib/site-data.ts`

### `Hero.tsx` (scroll CTA div)
- Replace `#d4d4d4` background → `var(--color-gray-ui)`
- Replace box-shadow literal → `var(--shadow-card)`

### `Contact.tsx`
- Replace local contact link array with `CONTACT_LINKS` from `lib/site-data.ts`
- When writing `site-data.ts`, copy the link values from the existing `Contact.tsx` definition; after the refactor `site-data.ts` is the single source of truth

---

## What Does NOT Change

- All component logic, event handling, animation behavior
- All rendered HTML structure and CSS classes
- `cv/page.tsx` contact data (richer format, stays local)
- `WorkBanner.tsx` internal constants (`GAP_VW`, `DEFAULT_HOLD`, `TRAVEL_S`) — local to that component, not duplicated elsewhere
- `PanelScene.tsx` layer config and Three.js constants — local, not duplicated
- `About.tsx` `FADE_MS`, `LAYERS`, `TAG_BIO`, `SKILL_TAGS` — local, not duplicated

---

## Success Criteria

- `grep -r '#FF6B35' components/` returns zero results (all replaced by import or CSS var)
- `grep -r '#d4d4d4' components/` returns zero results
- `grep -r '< 768' components/` returns zero results (all use `MOBILE_BREAKPOINT`)
- `grep -r '0 2px 16px' components/` returns zero results
- `useScramble` defined in exactly one place
- Nav links defined in exactly one place
- Contact links defined in exactly one place
- `npx tsc --noEmit` passes
- Visual output identical to before
