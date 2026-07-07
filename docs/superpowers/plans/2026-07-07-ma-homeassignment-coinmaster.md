# MA-HomeAssignment Coin Master Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Copy the HA-DrawingAnalyzer main page to `/MA-HomeAssignment` and restyle it with the Coin Master brand (violet hero, cream body, gold/crimson accents, parchment workflow panels).

**Architecture:** Next.js App Router — a new `app/MA-HomeAssignment/` folder is a verbatim copy of the original main-page files (no `/demo`, no `/presentation`), then restyled in place. New `cm-*` color tokens go into `tailwind.config.ts`; the original page and its `autodesk-blue`/`charcoal` tokens are never touched.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, next/font (Google Fonts), Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-07-ma-homeassignment-coinmaster-design.md`

## Global Constraints

- Never modify anything under `app/HA-DrawingAnalyzer/` — the original page must render pixel-identical after this work.
- Never remove or rename the existing Tailwind tokens (`autodesk-blue`, `charcoal`, `canvas`, `ink`, etc.).
- All page text content stays byte-identical to the original. The ONLY metadata change: OpenGraph `url` becomes `https://eliahu.co/MA-HomeAssignment`. `robots: { index: false, follow: false }` stays.
- Prototype links keep pointing at `/HA-DrawingAnalyzer/demo` (the demo route is not copied).
- Coin Master palette (exact values): `cm-violet #3B1F63`, `cm-violet-deep #2A1B54`, `cm-gold #F5A800`, `cm-gold-bright #FFC93C`, `cm-coin #FFCB70`, `cm-wood #903900`, `cm-sky #4FBFEF`, `cm-crimson #C8102E`, `cm-cream #FFF9EE`.
- Run tests with `npm test` (Jest via next/jest; `next/font` is auto-mocked — no manual font mock needed).
- Commit after every task. Branch: `moonactive`.

---

### Task 1: Copy the route and add a smoke test

**Files:**
- Create: `app/MA-HomeAssignment/` (copy of `app/HA-DrawingAnalyzer/` minus `demo/` and `presentation/`)
- Test: `__tests__/ma-homeassignment.test.tsx`

**Interfaces:**
- Produces: route `/MA-HomeAssignment`; page component `MAHomeAssignmentPage` (default export of `app/MA-HomeAssignment/page.tsx`); scope CSS classes `.ma-page` and `.ma-sidenav` that later tasks style against.

- [ ] **Step 1: Write the failing smoke test**

Create `__tests__/ma-homeassignment.test.tsx`:

```tsx
// __tests__/ma-homeassignment.test.tsx
import { render } from '@testing-library/react'
import MAHomeAssignmentPage from '@/app/MA-HomeAssignment/page'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders every side-nav section anchor', () => {
  render(<MAHomeAssignmentPage />)
  const ids = [
    'hero', 'use-case-1', 'use-case-2', 'use-case-3', 'use-case-4',
    'prioritization', 'mvp', 'prototype', 'unknowns', 'assumptions', 'approach',
  ]
  for (const id of ids) {
    expect(document.getElementById(id)).toBeInTheDocument()
  }
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ma-homeassignment`
Expected: FAIL — `Cannot find module '@/app/MA-HomeAssignment/page'`

- [ ] **Step 3: Copy the folder, drop the subroutes**

```powershell
Copy-Item -Recurse app/HA-DrawingAnalyzer app/MA-HomeAssignment
Remove-Item -Recurse -Force app/MA-HomeAssignment/demo, app/MA-HomeAssignment/presentation
```

Resulting contents of `app/MA-HomeAssignment/`: `page.tsx`, `SideNav.tsx`, `sections.ts`, `sections/` (Approach, AssumptionsSources, DemoVideo, Hero, KeyUnknowns, MVP, Prioritization, PrototypeDemo, Section, UseCase, useCaseData).

- [ ] **Step 4: Rename scope classes and fix metadata in the copy**

In `app/MA-HomeAssignment/page.tsx`:

1. Rename the component and every `ha-page`/`ha-sidenav` occurrence (component name, wrapper className, and the whole inline `<style>` block):
   - `export default function HADrawingAnalyzerPage()` → `export default function MAHomeAssignmentPage()`
   - `className="ha-page min-h-screen bg-white text-charcoal"` → `className="ma-page min-h-screen bg-white text-charcoal"`
   - In the `<style>` block, replace all `.ha-page` with `.ma-page` and `.ha-sidenav` with `.ma-sidenav` (7 occurrences total).
2. Metadata: change ONLY the OpenGraph url line:
   - `url: 'https://eliahu.co/HA-DrawingAnalyzer',` → `url: 'https://eliahu.co/MA-HomeAssignment',`
3. Update the header comment path: `// app/HA-DrawingAnalyzer/page.tsx` → `// app/MA-HomeAssignment/page.tsx`

In `app/MA-HomeAssignment/SideNav.tsx`:
- `className="ha-sidenav hidden md:block sticky top-10 self-start"` → `className="ma-sidenav hidden md:block sticky top-10 self-start"`
- In the `<style>` block, replace all `.ha-sidenav-link` with `.ma-sidenav-link` (4 occurrences), and the `<a>` className `ha-sidenav-link` → `ma-sidenav-link`.
- Header comment: `// app/HA-DrawingAnalyzer/SideNav.tsx` → `// app/MA-HomeAssignment/SideNav.tsx`

In every file under `app/MA-HomeAssignment/sections/` and `app/MA-HomeAssignment/sections.ts`: update the first-line path comment from `app/HA-DrawingAnalyzer/...` to `app/MA-HomeAssignment/...` (comment-only change, 11 files).

Do NOT change the `/HA-DrawingAnalyzer/demo` href in `sections/PrototypeDemo.tsx`.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: new smoke test PASSES; entire existing suite stays green.

- [ ] **Step 6: Commit**

```bash
git add app/MA-HomeAssignment __tests__/ma-homeassignment.test.tsx
git commit -m "feat(ma-homeassignment): copy HA-DrawingAnalyzer main page to /MA-HomeAssignment"
```

---

### Task 2: Coin Master tokens in Tailwind config

**Files:**
- Modify: `tailwind.config.ts` (colors block, currently lines 12–21)
- Test: `__tests__/tailwind-tokens.test.ts`

**Interfaces:**
- Produces: Tailwind color classes `cm-violet`, `cm-violet-deep`, `cm-gold`, `cm-gold-bright`, `cm-coin`, `cm-wood`, `cm-sky`, `cm-crimson`, `cm-cream` — every later task styles with these.

- [ ] **Step 1: Write the failing test**

Create `__tests__/tailwind-tokens.test.ts`:

```ts
// __tests__/tailwind-tokens.test.ts
import config from '../tailwind.config'

it('defines the Coin Master palette without touching existing tokens', () => {
  const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>
  expect(colors['cm-violet']).toBe('#3B1F63')
  expect(colors['cm-violet-deep']).toBe('#2A1B54')
  expect(colors['cm-gold']).toBe('#F5A800')
  expect(colors['cm-gold-bright']).toBe('#FFC93C')
  expect(colors['cm-coin']).toBe('#FFCB70')
  expect(colors['cm-wood']).toBe('#903900')
  expect(colors['cm-sky']).toBe('#4FBFEF')
  expect(colors['cm-crimson']).toBe('#C8102E')
  expect(colors['cm-cream']).toBe('#FFF9EE')
  // originals untouched
  expect(colors['autodesk-blue']).toBe('#0696d7')
  expect(colors['charcoal']).toBe('#666666')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tailwind-tokens`
Expected: FAIL — `cm-violet` is `undefined`.

- [ ] **Step 3: Add the tokens**

In `tailwind.config.ts`, after the `charcoal: '#666666',` line, add:

```ts
        // Coin Master (Moon Active) brand palette — used by /MA-HomeAssignment
        'cm-violet':      '#3B1F63',
        'cm-violet-deep': '#2A1B54',
        'cm-gold':        '#F5A800',
        'cm-gold-bright': '#FFC93C',
        'cm-coin':        '#FFCB70',
        'cm-wood':        '#903900',
        'cm-sky':         '#4FBFEF',
        'cm-crimson':     '#C8102E',
        'cm-cream':       '#FFF9EE',
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tailwind-tokens`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts __tests__/tailwind-tokens.test.ts
git commit -m "feat(ma-homeassignment): add Coin Master cm-* color tokens"
```

---

### Task 3: Page shell and hero banner

**Files:**
- Modify: `app/MA-HomeAssignment/page.tsx`
- Modify: `app/MA-HomeAssignment/sections/Hero.tsx` (full rewrite of JSX, content strings unchanged)
- Test: `__tests__/ma-homeassignment.test.tsx` (extend)

**Interfaces:**
- Consumes: `cm-*` tokens (Task 2), `.ma-page` scope class (Task 1).
- Produces: full-bleed hero banner above the sidebar grid; `#hero` anchor preserved (SideNav observes it).

- [ ] **Step 1: Extend the smoke test with hero assertions (failing first)**

Add to `__tests__/ma-homeassignment.test.tsx`:

```tsx
it('renders the Coin Master hero banner', () => {
  render(<MAHomeAssignmentPage />)
  const hero = document.getElementById('hero')!
  // full-bleed violet banner
  expect(hero.className).toContain('from-cm-violet-deep')
  // chunky display font applied to the title
  const h1 = hero.querySelector('h1')!
  expect(h1.className).toContain('text-cm-gold-bright')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ma-homeassignment`
Expected: FAIL — className assertions don't match.

- [ ] **Step 3: Restructure `page.tsx` — cream body, hero outside the grid**

In `app/MA-HomeAssignment/page.tsx`, replace the returned JSX layout (keep imports, metadata, and the `<style>` block as-is):

```tsx
export default function MAHomeAssignmentPage() {
  return (
    <>
      <div className="ma-page min-h-screen bg-cm-cream text-charcoal">
        <Hero />

        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-16 grid md:grid-cols-[180px_1fr] gap-10 md:gap-16">
          <SideNav />

          <main className="min-w-0">
            <UseCase data={USE_CASE_1} />
            <UseCase data={USE_CASE_2} />
            <UseCase data={USE_CASE_3} />
            <UseCase data={USE_CASE_4} />
            <Prioritization />
            <MVP />
            <PrototypeDemo />
            <KeyUnknowns />
            <AssumptionsSources />
            <Approach />

            <div className="mt-4">
              <a
                href="#hero"
                className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.12em] text-charcoal/70 hover:text-cm-crimson transition-colors no-underline"
              >
                <span aria-hidden="true">↑</span> Back to top
              </a>
            </div>

            <p className="mt-8 font-sans text-[10px] leading-relaxed text-charcoal/40">
              This page was created specifically for the Autodesk interview process and is not publicly discoverable.
            </p>
          </main>
        </div>
      </div>
      {/* ...existing <style> block unchanged... */}
    </>
  )
}
```

(Only structural changes: `bg-white` → `bg-cm-cream`, `<Hero />` hoisted above the grid, back-to-top hover `hover:text-autodesk-blue` → `hover:text-cm-crimson`. Everything else identical.)

- [ ] **Step 4: Rewrite `Hero.tsx` as the violet banner**

Replace `app/MA-HomeAssignment/sections/Hero.tsx` with (all visible strings identical to the original):

```tsx
// app/MA-HomeAssignment/sections/Hero.tsx
// Section 1 — Hero / Intro. Coin Master–styled full-bleed violet banner:
// gold chunky display title (Lilita One), crimson drop shadow, light lavender
// body text. Content strings are identical to the HA-DrawingAnalyzer original.

import { Lilita_One } from 'next/font/google'

const lilita = Lilita_One({ subsets: ['latin'], weight: '400', display: 'swap' })

const CAPABILITIES: { useCase: string; user: string }[] = [
  { useCase: 'Change Validation',          user: 'Designer' },
  { useCase: 'Context Link',               user: 'Field Team' },
  { useCase: 'Coordination Lock',          user: 'BIM/VDC' },
  { useCase: 'Program Conformance Review', user: 'Owner' },
]

export default function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-8 bg-gradient-to-br from-cm-violet-deep via-cm-violet to-[#4A1E7A]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-14">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-cm-gold-bright mb-4">
          Product Manager · Home Assignment
        </p>

        <h1
          className={`${lilita.className} text-[clamp(34px,5.5vw,56px)] leading-[1.02] text-cm-gold-bright mb-6 [text-shadow:0_3px_0_#B7202E,0_5px_12px_rgba(0,0,0,0.35)]`}
        >
          AI Drawing Analyzer
          <span className="block font-sans font-normal text-[clamp(14px,1.8vw,18px)] text-[#EDE6FF] mt-2 [text-shadow:none]">
            Autodesk Construction Solutions
          </span>
        </h1>

        <div className="border-t-2 border-cm-gold/40 pt-3 max-w-2xl">
          <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#EDE6FF] border-b-2 border-cm-gold/40 pb-3">
            Eliahu Cohen
            <span className="text-[#B9A8E8]">
              <span className="mx-2">·</span>
              <a href="tel:+972528901495" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">+972 52 8901495</a>
              <span className="mx-2">·</span>
              <a href="mailto:hi@eliahu.co" className="no-underline text-[#B9A8E8] hover:text-cm-gold-bright transition-colors">hi@eliahu.co</a>
            </span>
          </p>
          <p className="font-sans pt-8 text-[15px] leading-relaxed text-[#EDE6FF]">
            The following use cases were selected to represent different points of view across the
            construction lifecycle—from designers and field teams to owners—while spanning multiple
            project phases and workflows. Together they illustrate the breadth of opportunities
            that become possible when construction drawings are transformed from static documents into
            structured, queryable project data.
          </p>

          <table className="w-full border-collapse text-left mt-6">
            <thead>
              <tr className="border-b border-cm-gold/30">
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-cm-gold-bright/80 py-2 pr-4">Use case</th>
                <th className="font-sans text-[9px] uppercase tracking-[0.12em] text-cm-gold-bright/80 py-2 pl-4">User</th>
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map(({ useCase, user }, i) => (
                <tr key={useCase} className="border-b border-cm-gold/20">
                  <td className="font-sans text-[13px] text-[#EDE6FF] py-2.5 pr-4">
                    <span className="mr-1.5">{i + 1}.</span>{useCase}
                  </td>
                  <td className="font-sans text-[13px] text-[#EDE6FF] py-2.5 pl-4">{user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS (hero assertions + full suite).

- [ ] **Step 6: Commit**

```bash
git add app/MA-HomeAssignment __tests__/ma-homeassignment.test.tsx
git commit -m "feat(ma-homeassignment): cream page shell and Coin Master hero banner"
```

---

### Task 4: Section shell — gradient rules, crimson eyebrows, violet headings

**Files:**
- Modify: `app/MA-HomeAssignment/sections/Section.tsx`

**Interfaces:**
- Consumes: `cm-*` tokens.
- Produces: same `Section`/`Eyebrow` API (`id`, `eyebrow`, `title`, `children`) — no signature changes; all section components pick the new look up automatically.

- [ ] **Step 1: Apply the restyle**

In `app/MA-HomeAssignment/sections/Section.tsx`:

Eyebrow — replace:

```tsx
    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-autodesk-blue mb-3">
```

with:

```tsx
    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-cm-crimson mb-3">
```

Section — replace the `<section>` opening and heading:

```tsx
    <section
      id={id}
      // scroll-mt keeps the section heading clear of the top edge when jumped to
      className="scroll-mt-8 border-t-4 border-autodesk-blue pt-5 pb-16"
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className="font-serif text-[clamp(22px,3vw,32px)] leading-tight text-black mb-5 whitespace-pre-line">
```

with:

```tsx
    <section
      id={id}
      // scroll-mt keeps the section heading clear of the top edge when jumped to
      className="scroll-mt-8 pt-0 pb-16"
    >
      {/* gold→crimson gradient rule replaces the flat brand border */}
      <div className="h-1 rounded-full bg-gradient-to-r from-cm-gold to-cm-crimson mb-5" aria-hidden="true" />
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className="font-serif text-[clamp(22px,3vw,32px)] leading-tight text-cm-violet-deep mb-5 whitespace-pre-line">
```

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS (no behavior change; anchors intact).

- [ ] **Step 3: Commit**

```bash
git add app/MA-HomeAssignment/sections/Section.tsx
git commit -m "feat(ma-homeassignment): Coin Master section shell (gradient rules, crimson eyebrows)"
```

---

### Task 5: UseCase accents — pills, bullets, quotes, value/risk cards

**Files:**
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx` (everything EXCEPT the workflow-lane code — that is Task 6)

**Interfaces:**
- Consumes: `cm-*` tokens.
- Produces: `Pill` keeps its exact signature (`tone?: 'charcoal' | 'blue' | 'solid'`) — tone names unchanged, only colors remapped (MVP.tsx imports `Pill` with `tone="blue"`). `CardList`/`Card` signatures unchanged.

- [ ] **Step 1: Apply the accent remaps**

All edits in `app/MA-HomeAssignment/sections/UseCase.tsx`:

1. `Bullets` dash — replace `text-autodesk-blue mt-1 shrink-0` with `text-cm-gold mt-1 shrink-0`.

2. `Pill` tones — replace the `toneClass` assignment:

```tsx
  const toneClass =
    tone === 'solid' ? 'bg-autodesk-blue/80 text-white border-autodesk-blue'
    : tone === 'blue' ? 'text-autodesk-blue border-autodesk-blue/50'
    : 'text-charcoal border-charcoal/50'
```

with:

```tsx
  const toneClass =
    tone === 'solid' ? 'bg-gradient-to-b from-cm-gold-bright to-cm-gold text-cm-violet-deep border-cm-wood/60'
    : tone === 'blue' ? 'text-cm-violet border-cm-violet/50'
    : 'text-charcoal border-charcoal/50'
```

3. Blockquotes in `OpportunityText` — replace `border-l-2 border-autodesk-blue pl-3` with `border-l-2 border-cm-gold pl-3`.

4. `OpportunityImage` — replace `border-2 border-autodesk-blue/70` with `border-2 border-cm-wood/50`.

5. `Card` — game-styled rounded cards. Replace the whole `bar`/return block:

```tsx
  const bar = variant === 'neutral'
    ? 'border-l-4 border-charcoal'
    : item.primary
      ? (variant === 'value' ? 'border-l-4 border-autodesk-blue' : 'border-l-4 border-[#f4b400]')
      : (variant === 'value' ? 'border-l-2 border-autodesk-blue/55' : 'border-l-2 border-[#f4b400]/70')
  const span = item.primary || fullWidth ? 'sm:col-span-2' : ''
  return (
    <div className={`pl-3 ${bar} ${span}`}>
```

with:

```tsx
  const edge = variant === 'neutral'
    ? 'border-charcoal/30 border-l-charcoal border-l-4'
    : variant === 'value'
      ? `border-cm-gold/40 border-l-cm-gold ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
      : `border-cm-crimson/35 border-l-cm-crimson ${item.primary ? 'border-l-[5px]' : 'border-l-4'}`
  const span = item.primary || fullWidth ? 'sm:col-span-2' : ''
  return (
    <div className={`rounded-[10px] border bg-white px-3 py-2.5 shadow-[0_2px_6px_rgba(42,27,84,0.08)] ${edge} ${span}`}>
```

6. `Card` star — replace `text-autodesk-blue" aria-hidden="true">★` line's class `text-autodesk-blue` with `text-cm-gold`. Card titles: replace `font-serif text-[14px] text-black` with `font-serif text-[14px] text-cm-violet-deep` (in `Card` only).

7. `WarningBadge` — unchanged (stays gold-on-white per spec).

8. Tradeoff line — replace `text-[#f4b400]">` with `text-cm-wood">` and inside it `text-black">Tradeoff` with `text-cm-crimson">Tradeoff`.

9. Opportunity head "DA" pill (`<Pill tone="solid">DA</Pill>`) — no edit needed; restyled via the `Pill` change.

Do NOT touch `markerGlyph`, `Connector`, `LaneHeader`, `StepCell`, `Legend`, `Lane`, or `WorkflowComparison` in this task.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/MA-HomeAssignment/sections/UseCase.tsx
git commit -m "feat(ma-homeassignment): Coin Master pills, bullets, and value/risk cards"
```

---

### Task 6: Workflow comparison — parchment/wood panel

**Files:**
- Modify: `app/MA-HomeAssignment/sections/UseCase.tsx` (only `Connector`, `LaneHeader`, `StepCell`, `Legend`, `WorkflowComparison`)

**Interfaces:**
- Consumes: `cm-*` tokens; data shapes (`Workflow`, `WorkflowStep`, `StepKind`) unchanged.
- Produces: identical component APIs — only colors/surfaces change.

- [ ] **Step 1: Restyle the lane components**

All edits in `app/MA-HomeAssignment/sections/UseCase.tsx`:

1. `Connector` — replace the color line:

```tsx
  const color = proposed ? 'rgba(6,150,215,0.7)' : 'rgba(102,102,102,0.45)'
```

with:

```tsx
  const color = proposed ? 'rgba(144,57,0,0.75)' : 'rgba(144,57,0,0.35)'
```

2. `LaneHeader` — replace the body:

```tsx
  const accent = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  return (
    <div className={`pb-2 border-b-2 ${proposed ? 'border-autodesk-blue' : 'border-charcoal/40'}`}>
```

with:

```tsx
  const accent = proposed ? 'text-cm-wood' : 'text-[#8a6a3f]'
  return (
    <div className={`pb-2 border-b-2 ${proposed ? 'border-cm-wood' : 'border-cm-wood/30'}`}>
```

3. `StepCell` — replace the box/marker/note color logic:

```tsx
  // box background + border
  let box = proposed ? 'bg-white border-autodesk-blue/30' : 'bg-white border-charcoal/25'
  if (kind === 'ai') box = 'bg-autodesk-blue/10 border-autodesk-blue/45 shadow-[0_0_16px_-1px_rgba(6,150,215,0.5)]'
  else if (kind === 'approve') box = proposed ? 'bg-white border-autodesk-blue/70' : 'bg-white border-charcoal/45'
  else if (kind === 'catch') box = isEmphasis
    ? (proposed ? 'bg-white border-autodesk-blue/70' : 'bg-white border-charcoal/60')
    : (proposed ? 'bg-white border-autodesk-blue/30' : 'bg-white border-charcoal/25')
  else if (kind === 'reject') box = 'bg-white border-charcoal/60'
  else if (kind === 'repeat') box = 'bg-white border-charcoal/45'
  else if (step.emphasis) box = proposed ? 'bg-white border-autodesk-blue/70' : 'bg-white border-charcoal/60'
```

with:

```tsx
  // box background + border — near-white cards sitting on the parchment panel
  let box = proposed ? 'bg-white/90 border-cm-wood/30' : 'bg-white/70 border-cm-wood/25'
  if (kind === 'ai') box = 'bg-gradient-to-b from-[#5FC9F5] to-cm-sky border-[#1D5E7E] shadow-[0_0_12px_rgba(79,191,239,0.7)]'
  else if (kind === 'approve') box = 'bg-white/90 border-[#4C9B3C]'
  else if (kind === 'catch') box = isEmphasis
    ? (proposed ? 'bg-white/90 border-cm-wood/70' : 'bg-white/80 border-cm-wood/60')
    : (proposed ? 'bg-white/90 border-cm-wood/30' : 'bg-white/70 border-cm-wood/25')
  else if (kind === 'reject') box = 'bg-white/80 border-cm-crimson'
  else if (kind === 'repeat') box = 'bg-white/80 border-cm-wood/45'
  else if (step.emphasis) box = proposed ? 'bg-white/90 border-cm-wood/70' : 'bg-white/80 border-cm-wood/60'
```

Then the marker colors:

```tsx
  let marker = proposed ? 'text-autodesk-blue/60' : 'text-charcoal/40'
  if (kind === 'ai') marker = 'text-autodesk-blue'
  else if (kind === 'approve') marker = proposed ? 'text-autodesk-blue' : 'text-charcoal'
  else if (kind === 'reject' || kind === 'repeat') marker = 'text-charcoal'
  else if (kind === 'catch') marker = proposed ? 'text-autodesk-blue' : 'text-charcoal'
```

with:

```tsx
  let marker = proposed ? 'text-cm-wood/70' : 'text-cm-wood/40'
  if (kind === 'ai') marker = 'text-[#0F3D54]'
  else if (kind === 'approve') marker = 'text-[#3C7A2F]'
  else if (kind === 'reject') marker = 'text-cm-crimson'
  else if (kind === 'repeat') marker = 'text-cm-wood'
  else if (kind === 'catch') marker = proposed ? 'text-cm-wood' : 'text-charcoal'
```

And the label/note colors:

```tsx
  const labelColor = isEmphasis ? 'text-black font-medium' : 'text-charcoal'

  const noteColor = proposed ? 'text-autodesk-blue' : 'text-charcoal/60'
```

with:

```tsx
  const labelColor = kind === 'ai'
    ? 'text-[#0F3D54] font-bold'
    : isEmphasis ? 'text-black font-medium' : 'text-charcoal'

  const noteColor = proposed ? 'text-cm-wood' : 'text-charcoal/60'
```

Also in `StepCell`'s actor pill: `<Pill tone={proposed ? 'blue' : 'charcoal'}>` stays as-is (tone remap already handled in Task 5).

4. `Legend` — replace the two accent classes:
   - `${isAi ? 'text-autodesk-blue' : 'text-charcoal/70'}` → `${isAi ? 'text-[#1D5E7E]' : 'text-cm-wood/80'}`
   - `${isAi ? 'text-autodesk-blue font-bold text-[13px]' : 'text-charcoal'}` → `${isAi ? 'text-[#1D5E7E] font-bold text-[13px]' : 'text-cm-wood'}`

5. `WorkflowComparison` — wrap everything in the parchment panel. Replace:

```tsx
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 mb-4">
```

with:

```tsx
  return (
    <div className="rounded-[14px] border-2 border-cm-wood bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] p-4 shadow-[0_3px_0_rgba(144,57,0,0.35)]">
      <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 mb-4">
```

- [ ] **Step 2: Extend smoke test with a workflow assertion (fails before, passes after — run once now)**

Add to `__tests__/ma-homeassignment.test.tsx`:

```tsx
it('renders workflow lanes inside the parchment panel', () => {
  render(<MAHomeAssignmentPage />)
  const useCase1 = document.getElementById('use-case-1')!
  expect(useCase1.querySelector('.border-cm-wood')).not.toBeNull()
})
```

Run: `npm test -- ma-homeassignment`
Expected: PASS (implementation from Step 1 already in place).

- [ ] **Step 3: Run the full suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/MA-HomeAssignment/sections/UseCase.tsx __tests__/ma-homeassignment.test.tsx
git commit -m "feat(ma-homeassignment): parchment/wood workflow comparison panel"
```

---

### Task 7: Remaining sections — Prioritization, MVP, KeyUnknowns, Assumptions, PrototypeDemo, DemoVideo

**Files:**
- Modify: `app/MA-HomeAssignment/sections/Prioritization.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`
- Modify: `app/MA-HomeAssignment/sections/KeyUnknowns.tsx`
- Modify: `app/MA-HomeAssignment/sections/AssumptionsSources.tsx`
- Modify: `app/MA-HomeAssignment/sections/PrototypeDemo.tsx`
- Modify: `app/MA-HomeAssignment/sections/DemoVideo.tsx`

**Interfaces:**
- Consumes: `cm-*` tokens; `Pill` from Task 5.
- Produces: no API changes anywhere.

- [ ] **Step 1: Prioritization.tsx**

1. Criteria accordion bars: `border-l-4 border-charcoal` → `border-l-4 border-cm-wood`; the `▶` chevron `text-charcoal/45` → `text-cm-wood/60`; criterion titles `text-black` → `text-cm-violet-deep`.
2. Table head rule: `border-b-2 border-autodesk-blue` → `border-b-2 border-cm-wood`.
3. Winner shimmer gradient (the inline `style`): replace

```tsx
style={row.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(6,150,215,0.06) 0%, rgba(6,150,215,0.22) 50%, rgba(6,150,215,0.06) 100%)', backgroundSize: '200% 100%' } : undefined}
```

with:

```tsx
style={row.winner ? { backgroundImage: 'linear-gradient(90deg, rgba(245,168,0,0.08) 0%, rgba(245,168,0,0.28) 50%, rgba(245,168,0,0.08) 100%)', backgroundSize: '200% 100%' } : undefined}
```

4. Winner total: `text-autodesk-blue` → `text-cm-crimson`.
5. "Decision" label: `text-autodesk-blue` → `text-cm-crimson`.

- [ ] **Step 2: MVP.tsx**

1. In-scope check markers: `<List title="In scope" items={SCOPE_IN} marker="✓" markerClass="text-autodesk-blue" />` → `markerClass="text-cm-gold"`.
2. Metric cards: `pl-3 border-l-4 border-autodesk-blue` → `rounded-[10px] border border-cm-gold/40 border-l-4 border-l-cm-gold bg-white px-3 py-2.5 shadow-[0_2px_6px_rgba(42,27,84,0.08)]`; metric titles `text-black` → `text-cm-violet-deep`.
3. The `<Pill tone="blue">` usages need no edit (Task 5 remapped the tone).

- [ ] **Step 3: KeyUnknowns.tsx**

Labels: `font-serif text-[18px] text-autodesk-blue mb-1` → `font-serif text-[18px] text-cm-wood mb-1`.

- [ ] **Step 4: AssumptionsSources.tsx**

Dashes: `text-autodesk-blue mt-1 shrink-0` → `text-cm-gold mt-1 shrink-0`.

- [ ] **Step 5: PrototypeDemo.tsx — gold pill CTA**

Replace the `<a>` className:

```tsx
className="inline-flex items-center gap-2 self-start font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white bg-autodesk-blue rounded-sm px-4 py-2.5 no-underline hover:opacity-90 transition-opacity"
```

with:

```tsx
className="inline-flex items-center gap-2 self-start font-sans text-[12px] font-extrabold uppercase tracking-[0.08em] text-cm-violet-deep bg-gradient-to-b from-[#FFD95C] to-cm-gold rounded-full px-5 py-2.5 no-underline shadow-[0_3px_0_#B7202E] hover:brightness-105 transition-[filter]"
```

The `href="/HA-DrawingAnalyzer/demo"` stays untouched.

- [ ] **Step 6: DemoVideo.tsx — gold play button**

Replace `bg-autodesk-blue text-white` (play/replay circle) with `bg-gradient-to-b from-[#FFD95C] to-cm-gold text-cm-violet-deep`.

- [ ] **Step 7: Run tests, then commit**

Run: `npm test`
Expected: PASS.

```bash
git add app/MA-HomeAssignment/sections
git commit -m "feat(ma-homeassignment): Coin Master accents for remaining sections"
```

---

### Task 8: SideNav — gold active state, crimson hover

**Files:**
- Modify: `app/MA-HomeAssignment/SideNav.tsx`

**Interfaces:**
- Consumes: `.ma-sidenav-link` class (Task 1).
- Produces: no API change; IntersectionObserver behavior untouched.

- [ ] **Step 1: Swap the palette**

In `app/MA-HomeAssignment/SideNav.tsx`, replace:

```tsx
const BLUE = '#0696d7'
```

with:

```tsx
const GOLD = '#F5A800'
const WOOD = '#903900'
const CRIMSON = '#C8102E'
const VIOLET = '#2A1B54'
```

and replace the `<style>` block with:

```tsx
      <style>{`
        .ma-sidenav-link {
          border: 2px solid ${GOLD}99;
          color: ${WOOD};
          background: transparent;
        }
        .ma-sidenav-link:hover {
          background: ${CRIMSON}1a;
          border-color: ${CRIMSON};
          color: ${CRIMSON};
        }
        .ma-sidenav-link[aria-current=true] {
          background: ${GOLD};
          border-color: ${GOLD};
          color: ${VIOLET};
        }
        .ma-sidenav-link:focus-visible {
          outline: 1px solid ${WOOD};
          outline-offset: 2px;
        }
      `}</style>
```

Also update the header comment mention of "Autodesk-blue brand colour" to "Coin Master gold/wood palette".

- [ ] **Step 2: Run tests, then commit**

Run: `npm test`
Expected: PASS.

```bash
git add app/MA-HomeAssignment/SideNav.tsx
git commit -m "feat(ma-homeassignment): Coin Master side-nav palette"
```

---

### Task 9: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: every suite PASSES, including the untouched originals (`page.test.tsx`, `presentation-nav.test.ts`, etc.).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds; route list includes both `/HA-DrawingAnalyzer` and `/MA-HomeAssignment`.

- [ ] **Step 3: Confirm the original page is untouched**

Run: `git diff main -- app/HA-DrawingAnalyzer tailwind.config.ts`
Expected: NO diff under `app/HA-DrawingAnalyzer/`; `tailwind.config.ts` diff shows only the added `cm-*` lines.

- [ ] **Step 4: Visual pass**

Run: `npm run dev`, open `http://localhost:3000/MA-HomeAssignment`, and check against the approved mockups (`.superpowers/brainstorm/869-1783434778/content/coinmaster-style-v2.html` and `workflow-panel-v3.html`):
- Violet hero banner, gold Lilita One title with crimson drop shadow
- Cream body, gold→crimson section rules, crimson eyebrows, violet headings
- Parchment/wood workflow panels with sky-blue AI steps
- White rounded value (gold edge) / risk (crimson edge) cards
- Gold pill CTA button and gold side-nav active state
- Also open `http://localhost:3000/HA-DrawingAnalyzer` — must look exactly as before.

- [ ] **Step 5: Commit any straggling fixes**

```bash
git status
git add -A app/MA-HomeAssignment __tests__
git commit -m "fix(ma-homeassignment): visual-pass adjustments"  # only if fixes were needed
```
