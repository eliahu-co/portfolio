# Card Bounty Entry Attention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Cards Center X visually present but inert and make the Card Bounty LiveOps badge shake every 1.4 seconds.

**Architecture:** Preserve the existing `CardsCenterScreen` component and CSS Module. Replace only the close anchor's semantics, retarget its existing styles to a decorative display class, and adjust only the existing nudge animation duration; do not alter prototype state, layout, artwork, or navigation outside the game viewport.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Jest, Testing Library.

## Global Constraints

- The top-right X must remain visually identical and expose no link, button, focus, navigation, or event-handler behavior.
- The active Card Bounty badge must use `bountyNudge 1.4s ease-in-out infinite`.
- Completed-state and `prefers-reduced-motion` behavior must remain unchanged.
- Do not change prototype economy, state transitions, collection layout, or assignment navigation controls outside the game viewport.
- Preserve unrelated workspace changes.

---

### Task 1: Make the Cards Center X decorative and inert

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css`

**Interfaces:**
- Consumes: the existing Cards Center header markup and circular close styling
- Produces: `.closeDisplay`, a visual-only `span` with `aria-hidden="true"`

- [ ] **Step 1: Write the failing semantics regression test**

Capture the render container in the first test and assert that no close link or button exists while the X display remains in the header.

```tsx
const { container } = render(
  <CardsCenterScreen countdown={85_272} onOpenBounty={onOpenBounty} />,
)

expect(screen.queryByRole('link', { name: 'Close Cards Center' })).not.toBeInTheDocument()
expect(screen.queryByRole('button', { name: 'Close Cards Center' })).not.toBeInTheDocument()
const closeDisplay = container.querySelector('.closeDisplay')
expect(closeDisplay).toHaveAttribute('aria-hidden', 'true')
expect(closeDisplay?.querySelector('svg')).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`

Expected: FAIL because the header still exposes the `Close Cards Center` anchor and has no `.closeDisplay` element.

- [ ] **Step 3: Replace the anchor and retarget its styles**

Use a decorative span with no handler or navigation target:

```tsx
<span className={styles.closeDisplay} aria-hidden="true">
  <svg viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17" /></svg>
</span>
```

Retarget the shared geometry, red background, and SVG selectors from `.header a` to `.closeDisplay`. Remove the close-link focus selector while leaving `.bountyButton:focus-visible` unchanged.

```css
.info,
.closeDisplay {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  justify-self: center;
  border: 3px solid #ffe68a;
  border-radius: 50%;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, .45),
    0 3px 0 rgba(79, 33, 8, .72),
    0 5px 10px rgba(0, 31, 51, .35);
}

.closeDisplay {
  color: #fff;
  background: linear-gradient(180deg, #f47a45, #c42e25);
}

.bountyButton:focus-visible {
  outline: 4px solid #fff;
  outline-offset: 3px;
}

.closeDisplay svg {
  width: 23px;
  height: 23px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 3.4;
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: PASS.

- [ ] **Step 5: Commit the inert-close behavior**

```powershell
git add app/MA-HomeAssignment/demo/CardsCenterScreen.tsx app/MA-HomeAssignment/demo/CardsCenterScreen.module.css app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx
git commit -m "fix: keep Cards Center close display inert"
```

### Task 2: Increase the Card Bounty shake cadence

**Files:**
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css`

**Interfaces:**
- Consumes: existing `bountyNudge` keyframes, `bountyGlow`, completed-state classes, and reduced-motion media query
- Produces: a nudge burst every `1.4s` with all existing safeguards retained

- [ ] **Step 1: Add a failing cadence contract**

Extend the existing attention-cue test with the exact approved duration:

```tsx
expect(css).toMatch(
  /\.bountyButton\s*\{[\s\S]*?animation:\s*bountyNudge 1\.4s ease-in-out infinite/,
)
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`

Expected: FAIL because `.bountyButton` still uses `2.4s`.

- [ ] **Step 3: Apply the minimal cadence change**

Change only the duration on `.bountyButton`:

```css
animation: bountyNudge 1.4s ease-in-out infinite;
```

Keep the current keyframes, glow duration, completed-state rule, and reduced-motion rule unchanged.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the command from Step 2. Expected: PASS.

- [ ] **Step 5: Commit the cadence change**

```powershell
git add app/MA-HomeAssignment/demo/CardsCenterScreen.module.css app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx
git commit -m "style: increase Card Bounty shake cadence"
```

### Task 3: Integrated verification and delivery

**Files:**
- Verify all files modified by Tasks 1 and 2

**Interfaces:**
- Produces: a reviewed, deployable branch with no unrelated changes

- [ ] **Step 1: Run the full automated gate**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
git diff --check main...HEAD
```

Expected: 23 passing suites, 150 passing tests with the new assertions included in existing test cases, a successful production build, and no diff-check errors.

- [ ] **Step 2: Inspect responsive behavior**

At desktop and mobile sizes, confirm the initial Cards Center X does not navigate when clicked, the Bounty badge starts moving within about 0.8 seconds and repeats every 1.4 seconds, and the surrounding layout remains unchanged. Verify reduced-motion disables animation.

- [ ] **Step 3: Request independent review**

Review `main...HEAD` against the design, tests, branch cleanliness, and accessibility intent. Fix each confirmed issue and rerun affected verification.

- [ ] **Step 4: Integrate and deploy only after explicit user confirmation**

After the user explicitly confirms the `main` merge and deployment at execution time, refresh `origin/main`, merge the reviewed branch into `main`, rerun the full test/build gate on the merged commit, push `main`, and verify the production demo's initial screen at desktop and mobile sizes.
