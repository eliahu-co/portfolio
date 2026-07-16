# MA Presentation HA Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refit all 17 MA presentation slides to the HA Drawing Analyzer deck’s spacing, hierarchy, density, navigation, and interaction grammar while preserving MA’s fonts, colors, image frames, pills, shadows, content, and diagrams.

**Architecture:** Centralize HA-derived layout and typography in the MA presentation primitives and stage chrome, then refit slide groups around those primitives. Keep complex source artifacts imported from the original MA page. Interactive evidence components use fixed-height detail rails so hover and focus never shift layout.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, CSS Modules, Jest, Testing Library.

## Global Constraints

- Work only on branch `presentation`.
- Never merge to `main` or `master` without explicit user confirmation.
- Do not push, create a PR, or deploy without explicit user authorization.
- Native presentation canvas is 1280×720; scale may shrink below 1 but never exceed 1.
- Retain MA Nunito/Nunito Sans fonts, colors, image frames, flow pills, strokes, and shadows.
- Use HA’s anchored spacing, typography hierarchy, information density, navigation alignment, and progressive-disclosure behavior.
- Use 250ms slide crossfades and 250–300ms opacity/background transitions; no scale, bounce, expanding cards, or layout shifts.
- Hover and keyboard focus must have equivalent behavior and transient states reset on slide navigation.
- No print or PDF-specific work.

---

### Task 1: Shared HA-derived slide frame and navigation

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/primitives.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationStage.module.css`
- Modify: `app/MA-HomeAssignment/presentation/PresentationDeck.tsx`
- Test: `__tests__/ma-presentation-primitives.test.tsx`
- Test: `__tests__/ma-presentation-deck.test.tsx`

**Interfaces:**
- Produces: `SlideShell`, `Eyebrow`, `SlideTitle`, and `StageCounter` with HA-aligned default geometry.
- Produces: stage navigation aligned to the same 80px content margins as `SlideShell`.
- Preserves: `SlideShellProps`, `SlideTitleProps`, `data-slide-shell`, and deck navigation APIs.

- [ ] **Step 1: Write failing primitive geometry tests**

Add assertions that default primitives expose the HA relationships:

```tsx
expect(shell).toHaveClass('px-20', 'pt-20', 'pb-16')
expect(screen.getByText('Decision')).toHaveClass('text-[12px]', 'mb-4')
expect(screen.getByRole('heading', { name: 'Comparative scoring' }))
  .toHaveClass('text-[64px]', 'leading-[1.04]')
```

Update the deck test to assert the scale cap and 80px chrome margins:

```tsx
expect(viewport).toHaveStyle('--deck-scale: 1')
expect(screen.getByRole('navigation', { name: 'Presentation controls' }))
  .toHaveClass('left-20', 'right-20')
```

- [ ] **Step 2: Run tests and confirm the old geometry fails**

Run:

```powershell
npx.cmd jest __tests__/ma-presentation-primitives.test.tsx __tests__/ma-presentation-deck.test.tsx --runInBand
```

Expected: FAIL because the current shell uses 64px/48px spacing, the eyebrow is 14px, and titles default to 56px.

- [ ] **Step 3: Implement shared geometry and restrained chrome**

Change primitive defaults to:

```tsx
<div className="mx-auto flex h-full w-full max-w-[1280px] flex-col overflow-hidden bg-cm-cream px-20 pb-16 pt-20 font-sans text-[16px] leading-relaxed text-[#1A1A1A]">
```

Use:

```tsx
// Eyebrow
'mb-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-cm-crimson'

// h2 title
'text-[64px] font-black leading-[1.04] tracking-[-0.01em] text-cm-violet-deep'
```

Align `.deckChrome` to `left: 80px; right: 80px; bottom: 48px;`, use 12px uppercase labels, and retain the 250ms crossfade. Keep `Math.min(1, width / 1280, height / 720)` unchanged.

- [ ] **Step 4: Run focused tests**

Run the command from Step 2.

Expected: both suites PASS.

- [ ] **Step 5: Commit shared frame changes**

```powershell
git add app/MA-HomeAssignment/presentation/primitives.tsx app/MA-HomeAssignment/presentation/PresentationStage.module.css app/MA-HomeAssignment/presentation/PresentationDeck.tsx __tests__/ma-presentation-primitives.test.tsx __tests__/ma-presentation-deck.test.tsx
git commit -m "refactor: align MA deck frame with HA presentation"
```

### Task 2: Precise progressive-disclosure interactions

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/components/ScoreMatrix.tsx`
- Modify: `app/MA-HomeAssignment/presentation/components/ValidationTable.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide12Assumptions.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide19Metrics.tsx`
- Test: `__tests__/ma-presentation-scoring.test.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`

**Interfaces:**
- `ScoreMatrix({ slideKey })` preserves its public signature.
- `ValidationTable({ slideKey })` preserves its public signature.
- Active score state is `{ row: number; criterion: CriterionKey } | null` and is shared by hover/focus handlers.

- [ ] **Step 1: Write failing interaction tests**

Add score assertions:

```tsx
fireEvent.focus(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
expect(screen.getByTestId('score-column-coreLoopFit')).toHaveAttribute('data-active', 'true')
expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent('Hot Trail')
expect(screen.getByRole('status', { name: 'Score detail' })).toHaveTextContent('Core-Loop Fit')
fireEvent.blur(screen.getByRole('button', { name: /Hot Trail: Core-Loop Fit score 5/i }))
expect(screen.queryByTestId('score-column-coreLoopFit')).not.toHaveAttribute('data-active', 'true')
```

Add assumptions focus behavior:

```tsx
fireEvent.mouseEnter(screen.getByText(ASSUMPTION_STORIES[1]))
expect(screen.getByText(ASSUMPTION_STORIES[0]).closest('[data-assumption]')).toHaveClass('opacity-20')
```

Add metric focus/blur parity and ensure the detail rail remains mounted.

- [ ] **Step 2: Run interaction tests and confirm failures**

```powershell
npx.cmd jest __tests__/ma-presentation-scoring.test.tsx __tests__/ma-presentation-validation.test.tsx --runInBand
```

Expected: FAIL because scoring lacks HA-style column test hooks/fading and assumptions are currently static.

- [ ] **Step 3: Implement HA scoring behavior with MA colors**

Use a single active state. Apply the active criterion background to header and cells with `bg-[#1E7BA8]/10`; emphasize the exact cell with `font-black text-cm-crimson underline decoration-cm-gold decoration-4 underline-offset-4`; mark the active row with a 3px sky-blue left rule. Preserve the winner’s gold wash only when no cell is active.

Replace the current subtitle and formula-only bottom area with:

```tsx
<div className="mt-8 min-h-[150px]">
  <div className="min-h-10">{active && <ExactRationale />}</div>
  <div className={active ? 'opacity-20' : 'opacity-100'}>
    <DecisionSummary />
  </div>
</div>
```

The active detail uses one flat composition: criterion definition and exact rationale on the left; 5/3/1 rubric on the right; a single gold left rule separates it from the canvas.

- [ ] **Step 4: Implement assumptions and metrics focus behavior**

For assumptions, track `hovered: number | null`, add `data-assumption`, and apply `opacity-20` to non-active items. For metrics, keep the detail rail always mounted with a fixed minimum height; only replace its text and emphasis state.

- [ ] **Step 5: Run interaction tests**

Run the Step 2 command.

Expected: both suites PASS with pointer/focus parity.

- [ ] **Step 6: Commit interactions**

```powershell
git add app/MA-HomeAssignment/presentation/components/ScoreMatrix.tsx app/MA-HomeAssignment/presentation/components/ValidationTable.tsx app/MA-HomeAssignment/presentation/slides/Slide12Assumptions.tsx app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring.tsx app/MA-HomeAssignment/presentation/slides/Slide19Metrics.tsx __tests__/ma-presentation-scoring.test.tsx __tests__/ma-presentation-validation.test.tsx
git commit -m "feat: apply HA interaction grammar to MA evidence slides"
```

### Task 3: Opening slides 1–5

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide01Cover.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide02About.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide04Economy.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets.tsx`
- Test: `__tests__/ma-presentation-opening.test.tsx`

**Interfaces:**
- Slides preserve `OpeningSlideProps` and existing interactive labels.
- About retains the Brazil name-swap interaction.
- Core loop retains the original `CoreLoopDiagram` import.

- [ ] **Step 1: Write failing structure tests**

Assert About has `Product Manager`, one MA-framed photo, three equal-fill journey pills, and six flat facts. Assert Approach has six connected pills and no numbered badges. Assert Three Bets has three headings and no buttons or subtitle.

- [ ] **Step 2: Run opening tests and confirm failures where geometry changed**

```powershell
npx.cmd jest __tests__/ma-presentation-opening.test.tsx --runInBand
```

- [ ] **Step 3: Refit cover and About**

Keep the cover minimal. Position its content on the shared 80px inset and remove any decoration that intersects the navigation or title. On About, use a two-line HA-style identity block, MA-framed photo, MA journey pills with edge-touching SVG arrows, and unboxed facts with 18px body type.

- [ ] **Step 4: Refit Approach, core loop, and Three Bets**

Use the shared title anchor. Remove redundant subtitles. Bound the original core-loop diagram beneath the title. Keep Three Bets as three flat columns with only feature names and monetization sentences.

- [ ] **Step 5: Run opening tests**

Run Step 2. Expected: PASS.

- [ ] **Step 6: Commit opening slides**

```powershell
git add app/MA-HomeAssignment/presentation/slides/Slide01Cover.tsx app/MA-HomeAssignment/presentation/slides/Slide02About.tsx app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx app/MA-HomeAssignment/presentation/slides/Slide04Economy.tsx app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets.tsx __tests__/ma-presentation-opening.test.tsx
git commit -m "refactor: refit MA presentation opening to HA density"
```

### Task 4: Feature and decision slides 6–11

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/components/FeatureSlide.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide14Recommendation.tsx`
- Test: `__tests__/ma-presentation-concepts.test.tsx`
- Test: `__tests__/ma-presentation-scoring.test.tsx`

**Interfaces:**
- `FeatureSlide` continues to consume `concept`, `loop`, and `title` props used by slides 6–8.
- Feature images retain original MA frame styling.

- [ ] **Step 1: Write failing density tests**

Assert each feature slide has exactly one primary image, one loop region, one motivation region, and one risk region; no preview controls or nested panel containers. Assert Recommendation contains one image, three evidence reasons, and one primary-risk statement.

- [ ] **Step 2: Run tests and confirm failures for the new flat-layout contracts**

```powershell
npx.cmd jest __tests__/ma-presentation-concepts.test.tsx __tests__/ma-presentation-scoring.test.tsx --runInBand
```

- [ ] **Step 3: Refit feature composition**

Use a stable three-column grid beneath the shared title: `0.82fr 0.9fr 1fr`. Preserve the MA image frame and MA flow pills. Use flat motivation/risk lists with no outer cards; hierarchy comes from type, spacing, and restrained left rules.

- [ ] **Step 4: Refit Recommendation**

Use image plus evidence, not cards. Tighten quote and evidence spacing to match HA. Keep the winner image prominent and the risk as the final supporting line.

- [ ] **Step 5: Run tests and commit**

Run Step 2; expected PASS.

```powershell
git add app/MA-HomeAssignment/presentation/components/FeatureSlide.tsx app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis.tsx app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis.tsx app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis.tsx app/MA-HomeAssignment/presentation/slides/Slide14Recommendation.tsx __tests__/ma-presentation-concepts.test.tsx __tests__/ma-presentation-scoring.test.tsx
git commit -m "refactor: align MA feature and decision slides with HA structure"
```

### Task 5: Execution, validation, and closing slides 12–17

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide16MvpScope.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide19Metrics.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide21ThankYou.tsx`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`

**Interfaces:**
- Preserve original `PlayerFlow`, `PrototypePreview`, and validation content imports.
- Closing links remain same-deck anchors derived from `closingMenuTargets`.

- [ ] **Step 1: Write failing structure tests**

Assert the player flow and prototype use original MA elements, MVP uses flat In/Out lists, experiment exposes Population/Control/Treatment/Hypothesis, metrics exposes all canonical rows, and closing links have no pill classes (`rounded-full`, filled background, or border box).

- [ ] **Step 2: Run deep-dive and validation tests**

```powershell
npx.cmd jest __tests__/ma-presentation-deep-dive.test.tsx __tests__/ma-presentation-validation.test.tsx --runInBand
```

- [ ] **Step 3: Refit player-flow, MVP, and prototype slides**

Place imported source components inside the shared HA frame with explicit max-width and height bounds. Use the HA two-column flat list for MVP. Do not add presentation-specific cards or motion to the prototype.

- [ ] **Step 4: Refit A/B test, metrics, and closing slides**

Use flat ruled sections for the experiment. Keep the compact metric table and fixed detail rail from Task 2. Remove the Thank You decorative loop; use plain text chapter links with underline/color hover only. Make the closing statement resolve the Card Bounty recommendation.

- [ ] **Step 5: Run tests and commit**

Run Step 2; expected PASS.

```powershell
git add app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow.tsx app/MA-HomeAssignment/presentation/slides/Slide16MvpScope.tsx app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign.tsx app/MA-HomeAssignment/presentation/slides/Slide19Metrics.tsx app/MA-HomeAssignment/presentation/slides/Slide21ThankYou.tsx __tests__/ma-presentation-deep-dive.test.tsx __tests__/ma-presentation-validation.test.tsx
git commit -m "refactor: finish HA-structured MA presentation story"
```

### Task 6: Full verification and visual QA

**Files:**
- Modify only files with verified visual or test defects.
- Test: all `__tests__/ma-presentation-*` suites.

**Interfaces:**
- Final deliverable remains `http://localhost:3010/MA-HomeAssignment/presentation` on branch `presentation`.

- [ ] **Step 1: Run automated verification**

```powershell
npx.cmd tsc --noEmit
npx.cmd jest --testPathPatterns=ma-presentation --runInBand
git diff --check
```

Expected: TypeScript exit 0, all presentation suites PASS, and no whitespace errors.

- [ ] **Step 2: Inspect all slides at 1280×720**

For slides 1–17, verify:

- eyebrow and title share the same anchor;
- title remains one line unless intentionally authored otherwise;
- primary composition fills the central canvas without crowding;
- navigation is aligned and unobstructed;
- no clipping, overflow, wrapping, or unintended overlap;
- no decorative cards or loops were reintroduced;
- interactive detail rails do not move surrounding geometry.

- [ ] **Step 3: Verify interaction states**

Check About Brazil hover/focus, assumptions focus/fade, every scoring criterion column and representative cells, metric hover/focus, slide reset behavior, keyboard navigation, Escape, and reduced motion.

- [ ] **Step 4: Fix only observed defects and rerun verification**

Repeat Step 1 after any change. Expected: all commands exit 0.

- [ ] **Step 5: Commit QA fixes**

```powershell
git add app/MA-HomeAssignment/presentation __tests__/ma-presentation-*.test.ts __tests__/ma-presentation-*.test.tsx
git commit -m "fix: polish HA-aligned MA presentation"
```

- [ ] **Step 6: Stop without integration or deployment**

Report the localhost URL, branch name, verification counts, and latest commit. Do not merge, push, create a PR, or deploy.
