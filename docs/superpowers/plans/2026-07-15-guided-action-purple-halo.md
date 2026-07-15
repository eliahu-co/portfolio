# Guided Action Purple Halo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the faint yellow next-action shadow with a larger, bolder purple ring and halo across all guided Card Bounty controls.

**Architecture:** Keep the existing `guided.attention` class assignments and component flow untouched. Implement the new treatment entirely in the shared CSS Module using a raised control and a pointer-transparent pseudo-element, with a focused CSS contract test to protect palette, geometry, stacking, animation, and reduced-motion behavior.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Jest.

## Global Constraints

- Apply the treatment uniformly through the existing `attention` class; do not edit its eight component call sites.
- Use a purple ring and halo, not the existing yellow filter.
- Preserve native control shadows, hover brightness, focus-visible outlines, clicks, and prototype state transitions.
- The halo must not intercept pointer input or cover control content.
- Reduced motion must retain a bold static purple cue with no animation or transform.
- Preserve the already-reviewed inert X and 1.4-second Card Bounty badge cadence.

---

### Task 1: Replace the shared yellow shadow with a raised purple halo

**Files:**
- Create: `app/MA-HomeAssignment/demo/__tests__/GuidedAction.test.ts`
- Modify: `app/MA-HomeAssignment/demo/GuidedAction.module.css`

**Interfaces:**
- Consumes: the existing `guided.attention` class on all eight next-action controls
- Produces: `guidedAction` control-lift animation and `guidedHalo` ring/halo animation

- [ ] **Step 1: Write the failing CSS contract**

Create a source-level test that locks the raised control, purple pseudo-element, absent yellow/filter treatment, and static reduced-motion cue.

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('GuidedAction attention treatment', () => {
  it('uses a raised purple halo with a static reduced-motion cue', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/GuidedAction.module.css'),
      'utf8',
    )

    expect(css).toMatch(
      /\.attention\s*{[^}]*position:\s*relative;[^}]*z-index:\s*3;[^}]*animation:\s*guidedAction 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(
      /\.attention::after\s*{[^}]*z-index:\s*3;[^}]*inset:\s*-6px;[^}]*border:\s*4px solid #c86cff;[^}]*border-radius:\s*inherit;[^}]*pointer-events:\s*none;[^}]*animation:\s*guidedHalo 1\.4s ease-in-out infinite;/,
    )
    expect(css).toMatch(/@keyframes guidedHalo/)
    expect(css).not.toContain('255, 213, 61')
    expect(css).not.toMatch(/filter:\s*drop-shadow/)
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*{[\s\S]*?\.attention,\s*\.attention::after\s*{[^}]*animation:\s*none;/,
    )
  })
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/GuidedAction.test.ts`

Expected: FAIL because the stylesheet still uses a yellow animated drop shadow and has no purple `::after` halo.

- [ ] **Step 3: Implement the shared purple treatment**

Replace `GuidedAction.module.css` with:

```css
.attention {
  position: relative;
  z-index: 3;
  isolation: isolate;
  transform-origin: center;
  animation: guidedAction 1.4s ease-in-out infinite;
}

.attention::after {
  content: "";
  position: absolute;
  z-index: 3;
  inset: -6px;
  border: 4px solid #c86cff;
  border-radius: inherit;
  box-shadow:
    0 0 0 2px rgba(93, 28, 127, .85),
    0 0 16px 5px rgba(185, 76, 255, .72);
  opacity: .62;
  pointer-events: none;
  transform: scale(.98);
  animation: guidedHalo 1.4s ease-in-out infinite;
}

@keyframes guidedAction {
  0%, 100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.03);
  }
}

@keyframes guidedHalo {
  0%, 100% {
    box-shadow:
      0 0 0 2px rgba(93, 28, 127, .85),
      0 0 16px 5px rgba(185, 76, 255, .72);
    opacity: .62;
    transform: scale(.98);
  }

  50% {
    box-shadow:
      0 0 0 3px rgba(93, 28, 127, .96),
      0 0 24px 9px rgba(185, 76, 255, .9);
    opacity: 1;
    transform: scale(1.045);
  }
}

@media (prefers-reduced-motion: reduce) {
  .attention,
  .attention::after {
    animation: none;
  }

  .attention {
    transform: none;
  }

  .attention::after {
    box-shadow:
      0 0 0 2px rgba(93, 28, 127, .9),
      0 0 18px 6px rgba(185, 76, 255, .78);
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 4: Run focused and existing happy-path tests and verify GREEN**

Run:

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/GuidedAction.test.ts app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
```

Expected: the new contract and the complete guided happy path pass.

- [ ] **Step 5: Run the full suite and commit**

Run `npm.cmd test -- --runInBand`. Expected: 24 suites and 151 tests pass.

```powershell
git add app/MA-HomeAssignment/demo/GuidedAction.module.css app/MA-HomeAssignment/demo/__tests__/GuidedAction.test.ts
git commit -m "style: strengthen guided actions with purple halo"
```

### Task 2: Integrated verification and delivery

**Files:**
- Verify the complete `main...HEAD` branch diff

**Interfaces:**
- Produces: a reviewed and deployable combined Card Bounty polish branch

- [ ] **Step 1: Run the full automated gate**

Run `npm.cmd test -- --runInBand`, `npm.cmd run build`, and `git diff --check main...HEAD`. Expected: 24 passing suites, 151 passing tests, a successful build, and no diff-check errors.

- [ ] **Step 2: Inspect desktop and mobile behavior**

Verify the inert Cards Center X, the 1.4-second Card Bounty badge shake, and representative purple guided controls at desktop and mobile sizes. Confirm the ring stays above button/card surfaces, does not block clicks, retains rounded geometry, and remains visible in modal and reward-screen containers.

- [ ] **Step 3: Request independent whole-branch review**

Review the net branch diff against both design documents, test evidence, accessibility, and scope. Fix every confirmed issue and rerun affected verification.

- [ ] **Step 4: Integrate, push, and verify production**

Merge into `main` under the user's standing authorization, rerun the full gate on the merge commit, push `main`, and inspect the production demo at desktop and mobile sizes.
