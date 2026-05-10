# Floating Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed top header with a centered floating bottom nav block (dark, chunky, `border-radius: 8px`) with a gold scroll-progress bar along its top inner edge and a separate scroll-to-top button; change the Hero background from dark to `#D6D6D6` and flip all text colors from light to dark.

**Architecture:** New `FloatNav` component (single file, two fixed-position elements sharing one scroll listener + one IntersectionObserver per section). `Nav.tsx` and its test are deleted. `Hero.tsx` gets inline style + Tailwind class swaps only — no structural changes.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Jest + React Testing Library

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/FloatNav.tsx` | Floating nav block + scroll-to-top button |
| Create | `__tests__/FloatNav.test.tsx` | Structural render tests for FloatNav |
| Modify | `components/Hero.tsx` | Background → `#D6D6D6`, flip text colors |
| Modify | `__tests__/Hero.test.tsx` | Fix pre-existing tagline mismatch |
| Modify | `app/page.tsx` | Swap `<Nav />` → `<FloatNav />` |
| Modify | `__tests__/page.test.tsx` | Add `IntersectionObserver` mock |
| Delete | `components/Nav.tsx` | Replaced by FloatNav |
| Delete | `__tests__/Nav.test.tsx` | No longer relevant |

---

## Task 1: Write failing FloatNav tests

**Files:**
- Create: `__tests__/FloatNav.test.tsx`

- [ ] **Step 1: Create the test file**

```tsx
// __tests__/FloatNav.test.tsx
import { render, screen } from '@testing-library/react'
import FloatNav from '@/components/FloatNav'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders all nav links', () => {
  render(<FloatNav />)
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /what i do/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

it('nav links point to correct section anchors', () => {
  render(<FloatNav />)
  expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about')
  expect(screen.getByRole('link', { name: /what i do/i })).toHaveAttribute('href', '#what-i-do')
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
})

it('renders scroll-to-top button', () => {
  render(<FloatNav />)
  expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx jest __tests__/FloatNav.test.tsx --no-coverage
```

Expected: 3 failures — `Cannot find module '@/components/FloatNav'`

- [ ] **Step 3: Commit failing tests**

```bash
git add __tests__/FloatNav.test.tsx
git commit -m "test: add failing FloatNav render tests"
```

---

## Task 2: Create FloatNav component

**Files:**
- Create: `components/FloatNav.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/FloatNav.tsx
'use client'

import React, { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about', id: 'about' },
  { label: 'What I Do', href: '#what-i-do', id: 'what-i-do' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

export default function FloatNav() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      const { scrollY, innerHeight } = window
      const max = document.body.scrollHeight - innerHeight
      setProgress(max > 0 ? scrollY / max : 0)
      setScrolled(scrollY > innerHeight * 0.9)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: '-40% 0px -40% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [])

  return (
    <>
      <nav
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 overflow-hidden"
        style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          boxShadow: '0 6px 28px rgba(0,0,0,0.28)',
        }}
        aria-label="Page navigation"
      >
        {/* Progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.07)',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: '#c8a84a',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Nav links */}
        <ul className="flex items-center list-none m-0" style={{ padding: '16px 8px 14px' }}>
          {LINKS.map(({ label, href, id }, i) => (
            <React.Fragment key={href}>
              {i > 0 && (
                <li
                  aria-hidden="true"
                  role="separator"
                  style={{
                    width: '1px',
                    height: '14px',
                    background: 'rgba(255,255,255,0.18)',
                    flexShrink: 0,
                    listStyle: 'none',
                  }}
                />
              )}
              <li>
                <a
                  href={href}
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0 20px',
                    opacity: activeId === id ? 1 : 0.45,
                    fontWeight: activeId === id ? 500 : 400,
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </a>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Scroll-to-top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '36px',
          height: '36px',
          background: '#1a1a1a',
          borderRadius: '6px',
          boxShadow: '0 6px 28px rgba(0,0,0,0.28)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
          transition: 'opacity 0.2s, transform 0.2s',
          transform: scrolled ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 9l4.5-4.5L11 9" />
        </svg>
      </button>
    </>
  )
}
```

- [ ] **Step 2: Run FloatNav tests — confirm they pass**

```bash
npx jest __tests__/FloatNav.test.tsx --no-coverage
```

Expected: 3 passing

- [ ] **Step 3: Commit**

```bash
git add components/FloatNav.tsx
git commit -m "feat: add FloatNav with progress bar and scroll-to-top"
```

---

## Task 3: Update Hero background and text colors

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `__tests__/Hero.test.tsx`

- [ ] **Step 1: Fix the pre-existing tagline mismatch in the Hero test**

Open `__tests__/Hero.test.tsx`. The test at line 14 checks for `"architect. developer. i actually know how to build."` but the component renders `"Architect. Developer. Builder."` — update it:

```tsx
// __tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

jest.mock('next/dynamic', () => () => () => null)

it('renders name', () => {
  render(<Hero />)
  expect(screen.getByText('Eliahu Cohen')).toBeInTheDocument()
})

it('renders tagline', () => {
  render(<Hero />)
  expect(screen.getByText(/architect\. developer\. builder\./i)).toBeInTheDocument()
})

it('renders scroll CTA', () => {
  render(<Hero />)
  expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run Hero test — confirm it now passes (pre-existing issue fixed)**

```bash
npx jest __tests__/Hero.test.tsx --no-coverage
```

Expected: 3 passing

- [ ] **Step 3: Update Hero.tsx — swap background and flip text colors**

Replace the entire `components/Hero.tsx`:

```tsx
// components/Hero.tsx
'use client'

import dynamic from 'next/dynamic'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ backgroundColor: '#D6D6D6' }} />,
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#D6D6D6' }}
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-bold text-ink leading-none">
          Eliahu Cohen
        </h1>

        {/* Divider rule */}
        <div className="w-8 h-px bg-ink/20 my-4" />

        <p className="font-sans text-[13px] uppercase tracking-[0.12em] text-ink/60">
          Architect. Developer. Builder.
        </p>
      </div>

      {/* Scroll CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-ink/40">
          Scroll to explore
        </span>
        <svg
          className="animate-bounce-y w-4 h-4 text-ink/40"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 5l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run Hero tests — confirm all 3 still pass**

```bash
npx jest __tests__/Hero.test.tsx --no-coverage
```

Expected: 3 passing

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx __tests__/Hero.test.tsx
git commit -m "feat: hero background #D6D6D6, flip text to ink colors"
```

---

## Task 4: Wire up page, remove old Nav

**Files:**
- Modify: `app/page.tsx`
- Modify: `__tests__/page.test.tsx`
- Delete: `components/Nav.tsx`
- Delete: `__tests__/Nav.test.tsx`

- [ ] **Step 1: Update page.tsx**

```tsx
// app/page.tsx
import FloatNav from '@/components/FloatNav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="bg-canvas">
      <FloatNav />
      <Hero />
      <About />
      <WhatIDo />
      <Contact />
    </main>
  )
}
```

- [ ] **Step 2: Add IntersectionObserver mock to page.test.tsx**

`FloatNav` calls `new IntersectionObserver(...)` on mount; jsdom doesn't provide it. Add the mock at the top of the file:

```tsx
// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

jest.mock('next/dynamic', () => () => () => null)
jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
}))

it('renders all four sections', () => {
  render(<Home />)
  expect(document.getElementById('hero')).toBeInTheDocument()
  expect(document.getElementById('about')).toBeInTheDocument()
  expect(document.getElementById('what-i-do')).toBeInTheDocument()
  expect(document.getElementById('contact')).toBeInTheDocument()
})
```

- [ ] **Step 3: Delete Nav files**

```bash
rm components/Nav.tsx __tests__/Nav.test.tsx
```

- [ ] **Step 4: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: all tests pass, no reference to Nav

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx __tests__/page.test.tsx
git rm components/Nav.tsx __tests__/Nav.test.tsx
git commit -m "feat: wire FloatNav into page, remove Nav header"
```
