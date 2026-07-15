# Hometown Friend Visits Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the current friend-visit limitation to the start of the Hometown concept while preserving the existing copy and presentation.

**Architecture:** Keep the change in the existing `USE_CASE_1` content object so the current section component and styling continue to render it without structural changes. Add a data-level regression assertion for the exact combined copy and update the existing rendered typography selector to recognize the new opening sentence.

**Tech Stack:** Next.js 14, React, TypeScript, Jest, Testing Library

## Global Constraints

- Prepend exactly: `Friend visits currently display the friend’s active Village and offer no interaction.`
- Follow the new sentence with one space and the complete previous Hometown concept intro unchanged.
- Preserve the paragraph structure, rendering, typography, and spacing.
- Do not modify other feature copy, prototype files, or demo files.

---

### Task 1: Add the Hometown friend-visit context

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/useCaseData.ts`

**Interfaces:**
- Consumes: `USE_CASE_1.problem.intro: string`
- Produces: An intro string beginning with the new friend-visit limitation and continuing with the previous intro verbatim.

- [ ] **Step 1: Write the failing regression test and update the rendered-copy selector**

Change the data import to:

```tsx
import { USE_CASE_1, USE_CASE_2 } from '@/app/MA-HomeAssignment/sections/useCaseData'
```

Update the existing Concept paragraph lookup to recognize the approved new beginning:

```tsx
const concept = Array.from(document.querySelectorAll('#feature-1 p')).find((node) =>
  node.textContent?.startsWith('Friend visits currently display')
)!
```

Add this regression test:

```tsx
it('prepends the current friend-visit limitation to the Hometown concept', () => {
  const previousIntro =
    'Villages show progression, not ownership: completed items disappear once the player advances. Hometown gives them lasting utility through a familiar five-slot space that they can customize and gives friend visits a purpose. Building items costs Coins and rewards with a discount on the next Village build. Backdrops and item variants are unlocked through progression, LiveOps or purchase.'

  expect(USE_CASE_1.problem.intro).toBe(
    `Friend visits currently display the friend’s active Village and offer no interaction. ${previousIntro}`
  )
})
```

- [ ] **Step 2: Run the new test to verify it fails**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx -t "prepends the current friend-visit limitation to the Hometown concept"
```

Expected: FAIL because `USE_CASE_1.problem.intro` still starts with `Villages show progression`.

- [ ] **Step 3: Prepend the exact approved sentence**

Set the Hometown intro to:

```ts
intro: 'Friend visits currently display the friend’s active Village and offer no interaction. Villages show progression, not ownership: completed items disappear once the player advances. Hometown gives them lasting utility through a familiar five-slot space that they can customize and gives friend visits a purpose. Building items costs Coins and rewards with a discount on the next Village build. Backdrops and item variants are unlocked through progression, LiveOps or purchase.',
```

- [ ] **Step 4: Run focused and full verification**

Run:

```powershell
npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check
```

Expected: The assignment suite and full test suite pass, the production build exits successfully, and `git diff --check` reports no whitespace errors.

- [ ] **Step 5: Commit the implementation**

```powershell
git add __tests__/ma-homeassignment.test.tsx app/MA-HomeAssignment/sections/useCaseData.ts
git commit -m "copy: add Hometown friend visit context"
```
