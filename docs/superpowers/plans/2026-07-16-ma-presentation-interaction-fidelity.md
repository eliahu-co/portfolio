# MA Presentation Interaction Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match HA DrawingAnalyzer's feature, scoring, and focus interactions while preserving MA HomeAssignment's visual system and source diagrams.

**Architecture:** Introduce one presentation-owned SVG connector primitive, then reuse it across presentation components. Port HA interaction state machines into the existing MA `FeatureSlide`, `ScoreMatrix`, and `ValidationTable` without changing the registry or content data. Keep the original MA `CoreLoopDiagram`, `PlayerFlow`, and `PrototypePreview` as the visual/content sources and adapt only their presentation wrappers or presentation-safe sizing hooks.

**Tech Stack:** Next.js 14, React, TypeScript, Tailwind CSS, Jest, Testing Library.

## Global Constraints

- Branch remains `presentation`.
- Do not merge, push, create a PR, or deploy.
- Do not add print-specific work.
- Preserve the native 1280x720 canvas and scale cap of 1.
- Modify presentation code and narrowly scoped source-component sizing hooks only.

---

### Task 1: Shared typography and connector geometry

**Files:**
- Create: `app/MA-HomeAssignment/presentation/components/FlowArrow.tsx`
- Modify: `app/MA-HomeAssignment/presentation/primitives.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationDeck.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide02About.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide04Economy.tsx`
- Test: `__tests__/ma-presentation-primitives.test.tsx`
- Test: `__tests__/ma-presentation-opening.test.tsx`

**Interfaces:**
- Produces: `FlowArrow({ direction, color, className })`, using the Core Loop rounded stroke and open-chevron geometry.
- Consumes: existing `Eyebrow`, navigation rendering, and `CoreLoopDiagram`.

- [ ] **Step 1: Write failing tests** asserting black lighter eyebrows/navigation, shared SVG connector markers in About and Approach, and a smaller Core Loop wrapper.
- [ ] **Step 2: Run** `npx.cmd jest __tests__/ma-presentation-primitives.test.tsx __tests__/ma-presentation-opening.test.tsx --runInBand`; expect the new assertions to fail.
- [ ] **Step 3: Implement** `FlowArrow` with a rounded line and open chevron, replace presentation glyph/connectors, update typography classes, and reduce only the diagram wrapper width.
- [ ] **Step 4: Rerun the focused command** and expect all tests to pass.
- [ ] **Step 5: Commit** with `git commit -m "refactor: unify MA presentation typography and arrows"`.

### Task 2: HA-style feature composition and trade-off reveal

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/components/FeatureSlide.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis.tsx`
- Test: `__tests__/ma-presentation-concepts.test.tsx`
- Test: `__tests__/ma-presentation-interactions.test.tsx`

**Interfaces:**
- `FeatureSlide` additionally consumes `slideKey: DeckSlideKey` to reset reveal state.
- Feature screenshot is the right column; loop/trade-off is the left composition.

- [ ] **Step 1: Write failing tests** for right-side screenshot order, tight image frame, no bold left edges, hidden motivation/risk content, `Trade-off` click/focus reveal, faded loop/image, toggle-off, and slide-key reset.
- [ ] **Step 2: Run** `npx.cmd jest __tests__/ma-presentation-concepts.test.tsx __tests__/ma-presentation-interactions.test.tsx --runInBand`; expect failures.
- [ ] **Step 3: Implement** independent hover/focus/click-safe reveal state, HA-style two-column overlay, MA plaques, and `FlowArrow` connectors. Keep all canonical content in the DOM and use opacity/pointer-event states only.
- [ ] **Step 4: Rerun focused tests** and expect all to pass.
- [ ] **Step 5: Commit** with `git commit -m "refactor: port HA trade-off reveal to MA features"`.

### Task 3: HA scoring behavior and metric focus

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/components/ScoreMatrix.tsx`
- Modify: `app/MA-HomeAssignment/presentation/components/ValidationTable.tsx`
- Test: `__tests__/ma-presentation-scoring.test.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`

**Interfaces:**
- Score rows display rank medals and retain the existing fixed rationale rail.
- Metric selection continues to use independent hovered/focused state.

- [ ] **Step 1: Write failing tests** for medals, no star, no underline, fixed-size score controls, gold winner idle state, gold active column, faded inactive rows, and bold active metric/faded peers.
- [ ] **Step 2: Run** `npx.cmd jest __tests__/ma-presentation-scoring.test.tsx __tests__/ma-presentation-validation.test.tsx --runInBand`; expect failures.
- [ ] **Step 3: Implement** HA-equivalent column movement, transform-free centered score emphasis, row fading, medals, and metric peer fading while retaining all rationale and tooltip content.
- [ ] **Step 4: Rerun focused tests** and expect all to pass.
- [ ] **Step 5: Commit** with `git commit -m "refactor: match HA scoring and metric focus behavior"`.

### Task 4: Player flow, prototype size, and final QA

**Files:**
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow.tsx`
- Modify: `app/MA-HomeAssignment/sections/PlayerFlow.tsx`
- Modify: `app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`
- Test: all `__tests__/ma-presentation-*` suites.

**Interfaces:**
- Preserve the original `PlayerFlow` relationship graph and `PrototypePreview` CTA.

- [ ] **Step 1: Write failing tests** for a larger presentation flow scale, preserved phase/branch labels, shared connector geometry, and a smaller prototype maximum width.
- [ ] **Step 2: Run** `npx.cmd jest __tests__/ma-presentation-deep-dive.test.tsx --runInBand`; expect failures.
- [ ] **Step 3: Recompose** the flow within the slide's available height, enlarge critical labels/pills, keep branch relationships intact, and reduce the prototype wrapper modestly.
- [ ] **Step 4: Run** `npx.cmd jest --testPathPatterns=ma-presentation --runInBand`, `npx.cmd tsc --noEmit`, and `git diff --check`; expect exit 0.
- [ ] **Step 5: Visually inspect** all affected slides and representative reveal/hover/focus states at 1280x720, fixing only observed clipping or hierarchy defects.
- [ ] **Step 6: Commit** with `git commit -m "fix: polish MA presentation fidelity interactions"`.

### Task 5: Final review and safe handoff

**Files:**
- Modify only files required by verified Critical or Important review findings.

- [ ] **Step 1: Review** the complete implementation range against the design specification.
- [ ] **Step 2: Fix** all Critical and Important findings and rerun the full verification commands.
- [ ] **Step 3: Confirm** localhost returns HTTP 200 and the browser viewport override is reset.
- [ ] **Step 4: Keep** branch `presentation` as-is; do not merge, push, create a PR, or deploy.
