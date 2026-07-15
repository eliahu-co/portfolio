# Card Bounty Copy and Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved guidance copy, compact collection ribbons, repositioned preview CTA, and canonical Spins lightning icon.

**Architecture:** Keep the existing prototype state machine and page structure. Update state-derived copy in `guidanceFor`, adjust only the ribbon visual geometry, reposition the existing CTA inside the existing whole-card link, and extract the duplicated Spin lightning SVG into a shared primitive.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Tailwind utility classes, Jest, Testing Library.

## Global Constraints

- Do not change Bounty progress, pricing, rewards, or reducer transitions.
- Use the exact approved guidance strings.
- Keep collection portraits and the entire prototype-preview link unchanged.
- Reuse the canonical Spin lightning path and palette.
- Preserve responsive behavior and prevent horizontal overflow.

---

### Task 1: Guidance copy

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`

**Interfaces:**
- Consumes: existing `guidanceFor(overlay, baseScreen, eventCompleted, completesCollection, targetId, threshold)` state mapping
- Produces: exact guidance text rendered by `DemoShell`

- [ ] **Step 1: Write failing happy-path assertions**

Assert the Prototype controls aside contains `Buy Chests to progress the meter` in the Bounty state, `Continue` in the chest-opening state, and `Collect your target Card` in the guarantee state. Assert the three replaced strings are absent.

```tsx
const prototypeControls = screen.getByText('Interactive concept').closest('aside')!
expect(within(prototypeControls).getByText('Buy Chests to progress the meter')).toBeInTheDocument()
expect(within(prototypeControls).getByText('Continue')).toBeInTheDocument()
expect(within(prototypeControls).getByText('Collect your target Card')).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

Expected: FAIL because `guidanceFor` still returns the old strings.

- [ ] **Step 3: Update the mapping**

Replace the Bounty, chest-opening, and guarantee return values in `guidanceFor`. Remove the Whale Boat-only Bounty copy branch while leaving the function signature stable unless TypeScript identifies unused parameters.

```tsx
case 'bounty': return 'Buy Chests to progress the meter'
case 'chest-opening': return 'Continue'
case 'guarantee': return 'Collect your target Card'
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: PASS.

### Task 2: Compact collection ribbons

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css`

**Interfaces:**
- Consumes: existing `.ribbon`, tail pseudo-elements, and `.ribbon strong`
- Produces: a non-overlapping nameplate envelope while retaining the existing medallion dimensions

- [ ] **Step 1: Add a failing CSS contract**

Assert `.ribbon` uses `width: 100%`, `min-height: 32px`, `margin-top: -27px`, and `padding: 5px 9px 6px`; assert tails use `14px x 20px` with `-7px` offsets; assert the label uses `clamp(11px, 3.4cqw, 15px)`.

```tsx
expect(css).toMatch(/\.ribbon\s*{[\s\S]*?width:\s*100%;[\s\S]*?min-height:\s*32px/)
expect(css).toMatch(/\.ribbon::before,[\s\S]*?\.ribbon::after\s*{[\s\S]*?width:\s*14px;[\s\S]*?height:\s*20px/)
expect(css).toMatch(/\.ribbon strong\s*{[\s\S]*?font-size:\s*clamp\(11px,\s*3\.4cqw,\s*15px\)/)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`

Expected: FAIL against the current oversized ribbon values.

- [ ] **Step 3: Apply the compact geometry**

Update only the ribbon body, tails, and label sizing. Leave `.collectionList`, `--medallion-size`, and `.portrait` unchanged.

```css
.ribbon {
  width: 100%;
  min-height: 32px;
  margin-top: -27px;
  padding: 5px 9px 6px;
}

.ribbon::before,
.ribbon::after {
  width: 14px;
  height: 20px;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: PASS.

### Task 3: Preview CTA placement

**Files:**
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Modify: `app/MA-HomeAssignment/sections/PrototypePreview.tsx`

**Interfaces:**
- Consumes: the existing `/MA-HomeAssignment/demo` whole-card anchor
- Produces: responsive CTA placement without changing link semantics

- [ ] **Step 1: Add a failing responsive-position contract**

Assert the CTA has a stable selector and classes for `left-3 bottom-3`, plus `md:left-[20%] md:top-[47%] md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2`. Assert it no longer uses `left-1/2 bottom-4` or hover Y translation.

```tsx
const cta = previewLink.querySelector('[data-prototype-cta]')!
expect(cta.className).toContain('left-3')
expect(cta.className).toContain('bottom-3')
expect(cta.className).toContain('md:left-[20%]')
expect(cta.className).toContain('md:top-[47%]')
expect(cta.className).not.toContain('group-hover:-translate-y-0.5')
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand __tests__/ma-homeassignment.test.tsx`

Expected: FAIL because the CTA is still centered over the phone.

- [ ] **Step 3: Reposition the CTA**

Add `data-prototype-cta`, apply the approved responsive classes, and preserve the anchor target, rel, accessible label, phone image, and visual button copy.

```tsx
<span
  data-prototype-cta
  className="absolute bottom-3 left-3 ... md:bottom-auto md:left-[20%] md:top-[47%] md:-translate-x-1/2 md:-translate-y-1/2 group-hover:scale-[1.025]"
>
  ...
</span>
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: PASS.

### Task 4: Shared Spins icon

**Files:**
- Modify: `app/MA-HomeAssignment/demo/GamePrimitives.tsx`
- Modify: `app/MA-HomeAssignment/demo/RewardSequence.tsx`
- Modify: `app/MA-HomeAssignment/demo/SpinReturnScreen.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css`
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

**Interfaces:**
- Produces: `SpinsIcon(): JSX.Element` with canonical path `m13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z`
- Consumes: parent CSS selectors that size and color the SVG

- [ ] **Step 1: Add a failing reward-icon assertion**

In the Collection Completed state, assert the Collection reward SVG uses the canonical lightning path and does not contain the old star path.

```tsx
const reward = screen.getByText('Collection reward').closest('div')!
expect(reward.querySelector('path')).toHaveAttribute(
  'd',
  'm13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z',
)
expect(reward.querySelector('path[d^="m18 3.5"]')).not.toBeInTheDocument()
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

Expected: FAIL because the reward still contains the gold star.

- [ ] **Step 3: Extract and reuse `SpinsIcon`**

Add the primitive to `GamePrimitives.tsx`; replace the two inline Spin-screen bolts and the Collection reward star. Update `.spinReward svg` to cyan `#61e9ff`, cream `#fff9b9` stroke, rounded joins, `.9` stroke width, blue drop shadow, and centered 49px geometry.

```tsx
export function SpinsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z" />
    </svg>
  )
}
```

```css
.spinReward svg {
  width: 49px;
  height: 49px;
  justify-self: center;
  fill: #61e9ff;
  stroke: #fff9b9;
  stroke-linejoin: round;
  stroke-width: .9;
  filter: drop-shadow(0 1px #174d93);
}
```

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the Card Bounty prototype and SpinReturnScreen focused suites. Expected: PASS.

### Task 5: Integrated verification and delivery

**Files:**
- Verify all modified source and test files

**Interfaces:**
- Produces: reviewed, deployable branch with no unrelated changes

- [ ] **Step 1: Run the full automated gate**

Run `npm.cmd test -- --runInBand`, `npm.cmd run build`, and `git diff --check`. Expected: zero test failures, successful production build, and clean diff check.

- [ ] **Step 2: Run responsive browser QA**

Inspect the demo at 338px, 390px, and 430px game widths. Confirm adjacent ribbons have a visible gap and long names remain legible. Inspect the Home Assignment preview at 1440x900, 1366x768, 430x932, and 390x844; confirm the CTA is left of the phone, inside the preview, non-overlapping, and stable on hover.

- [ ] **Step 3: Request independent review**

Review the net diff against this design and fix every confirmed issue.

- [ ] **Step 4: Integrate and deploy**

After the user-authorized merge, refresh `origin/main`, merge the reviewed branch, rerun the full gate on the merged commit, push `main`, and verify the production URLs show the new copy, layout, CTA, and lightning icon.
