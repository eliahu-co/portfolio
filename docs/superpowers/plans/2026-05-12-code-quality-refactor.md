# Code Quality Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate repeated constants, duplicated data, and inline magic values across the codebase by creating three shared files and migrating every component to use them.

**Architecture:** Three new files act as single sources of truth — `lib/tokens.ts` (JS constants), `lib/site-data.ts` (nav/contact arrays), `hooks/useScramble.ts` (extracted hook). `app/globals.css` gains four new CSS variables that mirror the token values. All components then do mechanical substitutions: import from tokens instead of repeating literals, use CSS vars instead of inline hex strings.

**Tech Stack:** TypeScript, React 18, Next.js 15 App Router, CSS custom properties, Tailwind CSS

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Create | `lib/tokens.ts` | New — ORANGE, ORANGE_HOVER, GRAY_UI, SHADOW_CARD, MOBILE_BREAKPOINT |
| Create | `lib/site-data.ts` | New — NAV_LINKS, CONTACT_LINKS |
| Create | `hooks/useScramble.ts` | New — extracted from About.tsx |
| Modify | `app/globals.css` | Add 4 CSS vars; update WhatIDo media-query border to use var |
| Modify | `components/WhatIDo.tsx` | Remove local ORANGE/ORANGE_HOVER; import from tokens; CSS var for border |
| Modify | `components/WorkBannerSwitcher.tsx` | Import ORANGE from tokens |
| Modify | `components/About.tsx` | Import useScramble + ORANGE + MOBILE_BREAKPOINT; remove local defs |
| Modify | `components/Cursor.tsx` | Import MOBILE_BREAKPOINT from tokens |
| Modify | `components/Tooltip.tsx` | Import MOBILE_BREAKPOINT from tokens |
| Modify | `components/PanelScene.tsx` | Import MOBILE_BREAKPOINT; use in isMobile() |
| Modify | `components/Nameplate.tsx` | Import CONTACT_LINKS from site-data; CSS vars for bg + shadow |
| Modify | `components/FloatNav.tsx` | Import NAV_LINKS from site-data; CSS vars for bg + shadow |
| Modify | `components/Hero.tsx` | CSS vars for scroll-CTA bg + shadow |
| Modify | `components/Contact.tsx` | Import CONTACT_LINKS from site-data |

---

### Task 1: Create `lib/tokens.ts`

**Files:**
- Create: `lib/tokens.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/tokens.ts

export const ORANGE            = '#FF6B35'
export const ORANGE_HOVER      = '#FF895F'
export const GRAY_UI           = '#d4d4d4'
export const SHADOW_CARD       = '0 2px 16px rgba(26,26,26,0.08)'
export const MOBILE_BREAKPOINT = 768  // px
```

- [ ] **Step 2: Verify TypeScript accepts it**

Run: `npx tsc --noEmit`
Expected: no output (zero errors)

- [ ] **Step 3: Commit**

```bash
git add lib/tokens.ts
git commit -m "feat: add shared design tokens (ORANGE, GRAY_UI, SHADOW_CARD, MOBILE_BREAKPOINT)"
```

---

### Task 2: Create `lib/site-data.ts`

**Files:**
- Create: `lib/site-data.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/site-data.ts

export interface ContactLink {
  label:    string
  href:     string
  external: boolean
  download: boolean
}

export const CONTACT_LINKS: ContactLink[] = [
  { label: 'hi@eliahu.co',   href: 'mailto:hi@eliahu.co',                                external: false, download: false },
  { label: 'LinkedIn ↗',     href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114', external: true,  download: false },
  { label: 'Download CV ↓',  href: '/cv.pdf',                                            external: false, download: true  },
]

export interface NavLink {
  label: string
  href:  string
  id:    string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',      href: '#hero',     id: 'hero'     },
  { label: 'About',     href: '#about',    id: 'about'    },
  { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
]
```

- [ ] **Step 2: Verify TypeScript accepts it**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add lib/site-data.ts
git commit -m "feat: add shared site-data (NAV_LINKS, CONTACT_LINKS)"
```

---

### Task 3: Create `hooks/useScramble.ts`

**Files:**
- Create: `hooks/useScramble.ts`

This is a verbatim extraction of the `useScramble` function and `CHARS` constant currently at the top of `components/About.tsx` (lines 23–53). Do not change any logic.

- [ ] **Step 1: Create the file**

```typescript
// hooks/useScramble.ts
'use client'

import { useState, useRef, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useScramble(initial: string) {
  const [text, setText] = useState(initial)
  const rafRef = useRef<number>(0)

  const scrambleTo = (next: string) => {
    cancelAnimationFrame(rafRef.current)
    const len = next.length
    let frame = 0
    const totalFrames = 20

    const tick = () => {
      frame++
      const resolved = Math.floor((frame / totalFrames) * len)
      const scrambled = Array.from({ length: len }, (_, i) => {
        if (i < resolved) return next[i]
        if (next[i] === ' ' || next[i] === '\n') return next[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')
      setText(scrambled)
      if (frame < totalFrames) rafRef.current = requestAnimationFrame(tick)
      else setText(next)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { text, scrambleTo }
}
```

- [ ] **Step 2: Verify TypeScript accepts it**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add hooks/useScramble.ts
git commit -m "feat: extract useScramble into hooks/useScramble.ts"
```

---

### Task 4: Extend `app/globals.css`

**Files:**
- Modify: `app/globals.css`

Add four new CSS custom properties to the existing `:root` block, and update the WhatIDo media-query border rules to use `var(--color-orange)` instead of the hardcoded hex.

- [ ] **Step 1: Add CSS variables to the `:root` block**

Find the current `:root` block (it ends at `--border: 2px solid var(--color-ink);`) and add four lines immediately after:

```css
:root {
  --color-canvas: #f5f3ef;
  --color-ink: #1a1a1a;
  --color-accent-warm: #c8a84a;
  --color-accent-cool: #3a6ea8;
  --color-subtle: #e0ddd8;

  /* Single border token — change here to restyle all borders site-wide */
  --border: 2px solid var(--color-ink);

  /* Accent orange (primary CTA / highlight colour) */
  --color-orange:       #FF6B35;
  --color-orange-hover: #FF895F;

  /* UI chrome — button backgrounds, nav bar */
  --color-gray-ui: #d4d4d4;

  /* Elevation shadow used on all floating cards/buttons */
  --shadow-card: 0 2px 16px rgba(26,26,26,0.08);
}
```

- [ ] **Step 2: Update the WhatIDo border media queries to use `var(--color-orange)`**

Find the existing WhatIDo block at the bottom of the file and replace it:

```css
/* WhatIDo card borders — 2×2 on mobile, 1×4 on desktop */
@media (max-width: 767px) {
  .whatiodo-card:nth-child(odd)  { border-right: 2px solid var(--color-orange); }
  .whatiodo-card:nth-child(-n+2) { border-bottom: 2px solid var(--color-orange); }
}
@media (min-width: 768px) {
  .whatiodo-card:not(:last-child) { border-right: 2px solid var(--color-orange); }
}
```

- [ ] **Step 3: Verify TypeScript still passes (no CSS import issues)**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add CSS variables --color-orange, --color-gray-ui, --shadow-card"
```

---

### Task 5: Update `components/WhatIDo.tsx`

**Files:**
- Modify: `components/WhatIDo.tsx`

Remove the two locally-defined constants and replace with an import. Change the container border to use the CSS variable (no JS needed there).

- [ ] **Step 1: Replace the file header**

The current file begins:
```typescript
// components/WhatIDo.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'

const ORANGE       = '#FF6B35'
const ORANGE_HOVER = '#FF895F'
```

Replace with:
```typescript
// components/WhatIDo.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'
import { ORANGE, ORANGE_HOVER } from '@/lib/tokens'
```

- [ ] **Step 2: Change the container border to use the CSS variable**

Find:
```tsx
style={{ border: `2px solid ${ORANGE}` }}
```

Replace with:
```tsx
style={{ border: '2px solid var(--color-orange)' }}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add components/WhatIDo.tsx
git commit -m "refactor(WhatIDo): import ORANGE/ORANGE_HOVER from lib/tokens"
```

---

### Task 6: Update `components/WorkBannerSwitcher.tsx`

**Files:**
- Modify: `components/WorkBannerSwitcher.tsx`

- [ ] **Step 1: Add the import and replace the hardcoded colour**

At the top, add the import after the existing imports:
```typescript
import { ORANGE } from '@/lib/tokens'
```

Find the overlay div style:
```tsx
background: '#FF6B35',
```

Replace with:
```tsx
background: ORANGE,
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/WorkBannerSwitcher.tsx
git commit -m "refactor(WorkBannerSwitcher): import ORANGE from lib/tokens"
```

---

### Task 7: Update `components/Cursor.tsx` and `components/Tooltip.tsx`

**Files:**
- Modify: `components/Cursor.tsx`
- Modify: `components/Tooltip.tsx`

Both files contain `window.innerWidth < 768`. Replace the magic `768` with `MOBILE_BREAKPOINT`.

- [ ] **Step 1: Update `Cursor.tsx`**

Add to imports:
```typescript
import { MOBILE_BREAKPOINT } from '@/lib/tokens'
```

Find:
```typescript
useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])
```

Replace with:
```typescript
useEffect(() => { setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) }, [])
```

- [ ] **Step 2: Update `Tooltip.tsx`**

Add to imports:
```typescript
import { MOBILE_BREAKPOINT } from '@/lib/tokens'
```

Find:
```typescript
useEffect(() => { setIsMobile(window.innerWidth < 768) }, [])
```

Replace with:
```typescript
useEffect(() => { setIsMobile(window.innerWidth < MOBILE_BREAKPOINT) }, [])
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add components/Cursor.tsx components/Tooltip.tsx
git commit -m "refactor(Cursor,Tooltip): use MOBILE_BREAKPOINT from lib/tokens"
```

---

### Task 8: Update `components/About.tsx`

**Files:**
- Modify: `components/About.tsx`

Three substitutions: (1) import `useScramble` from hooks, removing the inline definition; (2) import `ORANGE` and replace the two `#ff6b35` inline values in tag styles; (3) import `MOBILE_BREAKPOINT` and replace `< 768` in the GSAP effect.

- [ ] **Step 1: Update the import block and remove the inline hook**

Replace the current top of the file (everything before `const SKILL_TAGS`):

```typescript
// components/About.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { showTooltip, hideTooltip } from '@/components/Tooltip'
import { useScramble } from '@/hooks/useScramble'
import { ORANGE, MOBILE_BREAKPOINT } from '@/lib/tokens'
```

(Delete the `const CHARS = ...` line and the entire `function useScramble(...) { ... }` block that follows it — they are now in `hooks/useScramble.ts`.)

- [ ] **Step 2: Replace `< 768` in the GSAP useEffect**

Find (inside the first `useEffect`):
```typescript
const mobile = window.innerWidth < 768
```

Replace with:
```typescript
const mobile = window.innerWidth < MOBILE_BREAKPOINT
```

- [ ] **Step 3: Replace inline `#ff6b35` in the mobile tag styles**

Find (inside the mobile JSX arm, the `style` props on each `<span>`):
```tsx
? { flex: 1, display: 'flex', alignItems: 'center', background: '#ff6b35', border: '1.5px solid #ff6b35', color: '#fff', overflow: 'hidden' }
: { flex: 1, display: 'flex', alignItems: 'center', border: '1.5px solid rgba(255,107,53,0.5)', color: '#ff6b35', overflow: 'hidden' }
```

Replace with:
```tsx
? { flex: 1, display: 'flex', alignItems: 'center', background: ORANGE, border: `1.5px solid ${ORANGE}`, color: '#fff', overflow: 'hidden' }
: { flex: 1, display: 'flex', alignItems: 'center', border: `1.5px solid ${ORANGE}99`, color: ORANGE, overflow: 'hidden' }
```

Note: `${ORANGE}99` appends the hex alpha `99` (≈ 60% opacity) directly to the colour string, matching the previous `rgba(255,107,53,0.5)` intent.

- [ ] **Step 4: Replace inline `#ff6b35` in the desktop tag styles**

Find (inside the desktop JSX arm, the `style` props on each `<span>`):
```tsx
style={activeTag === tag
  ? { background: '#ff6b35', border: '2px solid #ff6b35', color: '#fff' }
  : { border: '2px solid rgba(255,107,53,0.5)', color: '#ff6b35' }}
```

Replace with:
```tsx
style={activeTag === tag
  ? { background: ORANGE, border: `2px solid ${ORANGE}`, color: '#fff' }
  : { border: `2px solid ${ORANGE}99`, color: ORANGE }}
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 6: Commit**

```bash
git add components/About.tsx
git commit -m "refactor(About): import useScramble from hooks, ORANGE+MOBILE_BREAKPOINT from tokens"
```

---

### Task 9: Update `components/PanelScene.tsx`

**Files:**
- Modify: `components/PanelScene.tsx`

One import, one literal replaced inside `isMobile()`.

- [ ] **Step 1: Add the import**

PanelScene already imports from `@/lib/gsap`. Add `MOBILE_BREAKPOINT` alongside it, or add a separate import line:

```typescript
import { MOBILE_BREAKPOINT } from '@/lib/tokens'
```

- [ ] **Step 2: Update `isMobile()`**

Find:
```typescript
function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}
```

Replace with:
```typescript
function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "refactor(PanelScene): use MOBILE_BREAKPOINT from lib/tokens"
```

---

### Task 10: Update `components/Nameplate.tsx`

**Files:**
- Modify: `components/Nameplate.tsx`

Replace the local `LINKS` array with the shared `CONTACT_LINKS` import, and replace the inline `background`/`boxShadow` strings with CSS variables.

- [ ] **Step 1: Update imports and remove local LINKS**

Replace the current top of the file:
```typescript
'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'hi@eliahu.co',  href: 'mailto:hi@eliahu.co',                                 download: false, external: false },
  { label: 'LinkedIn ↗',    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',  download: false, external: true  },
  { label: 'Download CV ↓', href: '/cv.pdf',                                              download: true,  external: false },
]
```

With:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { CONTACT_LINKS } from '@/lib/site-data'
```

- [ ] **Step 2: Update the JSX map to use `CONTACT_LINKS`**

Find:
```tsx
{LINKS.map(({ label, href, download, external }) => (
```

Replace with:
```tsx
{CONTACT_LINKS.map(({ label, href, download, external }) => (
```

- [ ] **Step 3: Replace inline background and boxShadow with CSS variables**

Find the `<a>` element style inside the map:
```tsx
style={{
  background: '#d4d4d4',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
  padding: '6px 12px',
  display: 'inline-block',
}}
```

Replace with:
```tsx
style={{
  background: 'var(--color-gray-ui)',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: 'var(--shadow-card)',
  padding: '6px 12px',
  display: 'inline-block',
}}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add components/Nameplate.tsx
git commit -m "refactor(Nameplate): use CONTACT_LINKS from site-data, CSS vars for bg/shadow"
```

---

### Task 11: Update `components/FloatNav.tsx`

**Files:**
- Modify: `components/FloatNav.tsx`

Replace the local `LINKS` array with `NAV_LINKS`, and replace `#d4d4d4` / shadow literals with CSS variables (two places: the `<nav>` element and the scroll-to-top `<button>`).

- [ ] **Step 1: Update imports and remove local LINKS**

Replace:
```typescript
'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home',     href: '#hero',      id: 'hero'     },
  { label: 'About',    href: '#about',     id: 'about'    },
  { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
]
```

With:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/site-data'
```

- [ ] **Step 2: Update JSX to use `NAV_LINKS`**

Find:
```tsx
{LINKS.map(({ label, href, id }, i) => (
```

Replace with:
```tsx
{NAV_LINKS.map(({ label, href, id }, i) => (
```

Find (inside the map, the `borderRight` check):
```tsx
borderRight: i < LINKS.length - 1 ? '1px solid var(--color-ink)' : undefined,
```

Replace with:
```tsx
borderRight: i < NAV_LINKS.length - 1 ? '1px solid var(--color-ink)' : undefined,
```

- [ ] **Step 3: Replace `#d4d4d4` and shadow on `<nav>`**

Find the `<nav>` style:
```tsx
style={{
  background: '#d4d4d4',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
}}
```

Replace with:
```tsx
style={{
  background: 'var(--color-gray-ui)',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: 'var(--shadow-card)',
}}
```

- [ ] **Step 4: Replace `#d4d4d4` and shadow on the scroll-to-top `<button>`**

Find inside the button style object:
```tsx
background: '#d4d4d4',
borderRadius: '2px',
border: 'var(--border)',
boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
```

Replace with:
```tsx
background: 'var(--color-gray-ui)',
borderRadius: '2px',
border: 'var(--border)',
boxShadow: 'var(--shadow-card)',
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 6: Commit**

```bash
git add components/FloatNav.tsx
git commit -m "refactor(FloatNav): use NAV_LINKS from site-data, CSS vars for bg/shadow"
```

---

### Task 12: Update `components/Hero.tsx`

**Files:**
- Modify: `components/Hero.tsx`

The scroll-CTA div has hardcoded `#d4d4d4` and the shadow literal. Replace both with CSS variables.

- [ ] **Step 1: Replace the scroll-CTA inner div style**

Find:
```tsx
<div style={{
  width: '34px',
  height: '34px',
  background: '#d4d4d4',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: '0 2px 16px rgba(26,26,26,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
```

Replace with:
```tsx
<div style={{
  width: '34px',
  height: '34px',
  background: 'var(--color-gray-ui)',
  border: 'var(--border)',
  borderRadius: '2px',
  boxShadow: 'var(--shadow-card)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}>
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "refactor(Hero): CSS vars for scroll-CTA bg/shadow"
```

---

### Task 13: Update `components/Contact.tsx`

**Files:**
- Modify: `components/Contact.tsx`

Replace the local `LINKS` constant with `CONTACT_LINKS` from `lib/site-data.ts`.

- [ ] **Step 1: Add import, remove local constant**

Replace the current top of the file:
```typescript
// components/Contact.tsx

const LINKS = [
  {
    label: 'hi@eliahu.co',
    href: 'mailto:hi@eliahu.co',
    external: false,
    download: false,
  },
  {
    label: 'LinkedIn ↗',
    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',
    external: true,
    download: false,
  },
  {
    label: 'Download CV ↓',
    href: '/cv.pdf',
    external: false,
    download: true,
  },
]
```

With:
```typescript
// components/Contact.tsx

import { CONTACT_LINKS } from '@/lib/site-data'
```

- [ ] **Step 2: Update the JSX map**

Find:
```tsx
{LINKS.map(({ label, href, external, download }) => (
```

Replace with:
```tsx
{CONTACT_LINKS.map(({ label, href, external, download }) => (
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 4: Commit**

```bash
git add components/Contact.tsx
git commit -m "refactor(Contact): use CONTACT_LINKS from lib/site-data"
```

---

### Task 14: Final Verification

**Files:** none (read-only checks)

- [ ] **Step 1: Grep for remaining `#FF6B35` / `#ff6b35` in components**

Run: `grep -ri "#ff6b35" components/`
Expected: **no output** (zero matches)

- [ ] **Step 2: Grep for remaining `#d4d4d4` in components**

Run: `grep -ri "#d4d4d4" components/`
Expected: **no output**

- [ ] **Step 3: Grep for remaining raw `< 768` in components**

Run: `grep -r "< 768" components/`
Expected: **no output**

- [ ] **Step 4: Grep for remaining shadow literal in components**

Run: `grep -r "0 2px 16px" components/`
Expected: **no output**

- [ ] **Step 5: Confirm useScramble defined in exactly one place**

Run: `grep -r "function useScramble" .`
Expected: one match — `hooks/useScramble.ts`

- [ ] **Step 6: Final TypeScript check**

Run: `npx tsc --noEmit`
Expected: no output

- [ ] **Step 7: Commit if any final fixups were needed; otherwise done**

```bash
git add -A
git commit -m "chore: final fixups from verification sweep"
```

Only run Step 7 if earlier steps revealed something that needed fixing. If all greps returned no output and tsc passed, this step is a no-op.
