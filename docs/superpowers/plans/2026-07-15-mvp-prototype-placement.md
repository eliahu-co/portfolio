# MVP Prototype Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the existing interactive prototype preview into the MVP section and remove the standalone prototype introduction.

**Architecture:** `MVP.tsx` will own the `#prototype` anchor and render the existing `PrototypePreview` after the scope lists and before success metrics. The page will stop rendering `PrototypeDemo`, and the now-unused wrapper component will be deleted while `PrototypePreview` and all anchor links remain unchanged.

**Tech Stack:** Next.js, React, TypeScript, Jest, Testing Library

## Global Constraints

- Preserve the existing prototype preview styling, behavior, and `/MA-HomeAssignment/demo` link.
- Preserve the `#prototype` anchor and the sidebar `Prototype` entry.
- Remove the old eyebrow, title, and descriptive paragraph completely.
- Make no unrelated content or layout changes.

---

### Task 1: Embed the prototype in MVP

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx:84-92`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx:5-7,119-145`
- Modify: `app/MA-HomeAssignment/page.tsx:17-20,83-87`
- Delete: `app/MA-HomeAssignment/sections/PrototypeDemo.tsx`

**Interfaces:**
- Consumes: the default `PrototypePreview` component and existing `#prototype` links in the sidebar/demo.
- Produces: one `#prototype` block nested inside `#mvp`, before the Success metrics block.

- [x] **Step 1: Replace the prototype integration test**

Replace the existing prototype integration test with:

```ts
it('renders the interactive prototype inside MVP without the old introduction', () => {
  render(<MAHomeAssignmentPage />)
  const mvp = document.getElementById('mvp')!
  const prototype = document.getElementById('prototype')!
  const heading = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Interactive prototype'
  )!
  const successMetrics = Array.from(mvp.querySelectorAll('h2')).find(
    (node) => node.textContent === 'Success metrics'
  )!

  expect(mvp.contains(prototype)).toBe(true)
  expect(prototype.contains(heading)).toBe(true)
  expect(prototype.querySelectorAll('a[href="/MA-HomeAssignment/demo"]')).toHaveLength(1)
  expect(prototype.querySelector('img[src="/coinmaster/prototype.webp"]')).not.toBeNull()
  expect(prototype.compareDocumentPosition(successMetrics) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(document.body.textContent).not.toContain('Prototype demo')
  expect(document.body.textContent).not.toContain('Card Bounty, interactive')
  expect(document.body.textContent).not.toContain('An interactive concept prototype of Card Bounty')
})
```

- [x] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
```

Expected: FAIL because `#prototype` remains a standalone section outside `#mvp` and the new subheading is absent.

- [x] **Step 3: Embed the existing preview and remove the wrapper**

In `MVP.tsx`, import the preview:

```ts
import PrototypePreview from './PrototypePreview'
```

After the scope-list container and before success metrics, render:

```tsx
<div id="prototype" className="mb-10 max-w-2xl scroll-mt-6">
  <SubHeading>Interactive prototype</SubHeading>
  <PrototypePreview />
</div>
```

In `page.tsx`, remove the `PrototypeDemo` import and `<PrototypeDemo />` render. Delete `app/MA-HomeAssignment/sections/PrototypeDemo.tsx`. Do not change `sections.ts` or demo-page anchor links.

- [x] **Step 4: Run focused and full verification**

Run:

```powershell
npm.cmd test -- __tests__\ma-homeassignment.test.tsx --runInBand
npm.cmd test -- --runInBand
```

Expected: the focused suite passes, then all suites pass with no failures.

- [x] **Step 5: Verify the localhost structure**

Open `http://localhost:3000/MA-HomeAssignment?finetuning=5#prototype` and confirm the preview appears after the scope lists and before Success metrics, the old introduction is absent, and the preview opens the existing demo.

- [x] **Step 6: Commit**

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/MVP.tsx app/MA-HomeAssignment/page.tsx app/MA-HomeAssignment/sections/PrototypeDemo.tsx docs/superpowers/plans/2026-07-15-mvp-prototype-placement.md
git commit -m "refactor(ma-homeassignment): move prototype into MVP"
```
