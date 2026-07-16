# MA Home Assignment Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, presenter-led 21-slide web deck at `/MA-HomeAssignment/presentation/` that tells the approved decision-led story in the existing Moon Active visual language without changing the source assignment or prototype.

**Architecture:** Extract assignment facts that currently live inside section components into typed shared content modules, then compose presentation-only narrative data from those canonical exports. Build the deck as a fixed 1280x720 stage with a registry-derived slide sequence, pure navigation helpers, data-driven repeated visuals, explicit one-off narrative slides, and one registry-rendered tree whose transient state resets on navigation. Keep inactive screen slides inert, and let print CSS reflow that same tree so all slides and static supporting details print without mounting a second deck.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, CSS Modules for stage/print rules, `next/font/local`, Jest 29, React Testing Library, and existing local Coin Master/Card Bounty assets.

**Scope update (2026-07-16):** The user explicitly deprioritized browser Print / Save as PDF and physical-paper output. Existing lightweight print fallbacks may remain, but any print-only work named below is non-blocking and should not displace screen presentation, interaction, keyboard, responsive desktop, or localhost quality.

## Global Constraints

- Work only on branch `presentation`; never merge to `main` or `master`, never deploy, and never alter hosting without explicit user authorization.
- Preserve `/MA-HomeAssignment` and `/MA-HomeAssignment/demo` rendered behavior. Refactors may only replace module-local content constants with imports of byte-equivalent strings and values.
- The presentation contains exactly 21 slides in the approved order. Counts, hashes, neighboring labels, and closing-menu links derive from one registry; no duplicated manual total or name array.
- Present Hometown, Card Bounty, and Hot Trail as product theses and monetization mechanisms. Do not add artificial problem slides and do not render legacy AEC-specific fields from `UseCaseData`.
- Do not add a separate prioritization-criteria or modified-RICE slide. The comparative table itself must expose the current criterion definition and 5/3/1 rubric for every score by hover, keyboard focus, and pinning.
- Keep the About slide's existing content, photograph, timeline, six bullets, and Brazil-to-Eduardo interaction. Restyle only.
- Use only existing local assets and local fonts; no runtime fetches, iframes, trackers, third-party packages, or invented Moon Active data.
- Use the approved palette exactly: cream `#FFF9EE`, violet `#2A1B54`, gold `#F5A800`, crimson `#C8102E`, blue `#1E7BA8`, wood `#903900`, ink `#1A1A1A`, charcoal `#666666`.
- Author at 1280x720. At viewports at least 960x540, scale the stage by `min(viewportWidth / 1280, viewportHeight / 720)` and center it without clipping. Below either threshold, show the branded desktop notice and a return link.
- Essential claims are always visible. Hover/focus/click reveals supporting detail only.
- Interactive descendants consume their own Space, Enter, Escape, and arrow input. The deck ignores `defaultPrevented` events and events from buttons, links, inputs, textareas, selects, summaries, and elements inside `[data-deck-interactive]`.
- Inactive slides must not remain keyboard-focusable. Transient reveal/pin state resets on slide change.
- Metadata is unlisted and protected with `robots: { index: false, follow: false }`; the prototype link is `/MA-HomeAssignment/demo`, opens a new tab, and includes `noopener noreferrer`.
- Follow test-driven development: add the named failing test before implementation, confirm the intended failure, write the smallest implementation, re-run the focused test, and commit only passing work.

---

## Task 1: Extract canonical assignment content without changing the source page

**Files:**

- Create: `app/MA-HomeAssignment/content/assumptions.ts`
- Create: `app/MA-HomeAssignment/content/prioritization.ts`
- Create: `app/MA-HomeAssignment/content/mvp.ts`
- Create: `app/MA-HomeAssignment/content/validation.ts`
- Create: `app/MA-HomeAssignment/content/index.ts`
- Modify: `app/MA-HomeAssignment/sections/AssumptionsSources.tsx`
- Modify: `app/MA-HomeAssignment/sections/Prioritization.tsx`
- Modify: `app/MA-HomeAssignment/sections/MVP.tsx`
- Modify: `app/MA-HomeAssignment/sections/FeatureValidation.tsx`
- Test: `__tests__/ma-homeassignment-content.test.ts`
- Regression test: `__tests__/ma-homeassignment.test.tsx`

- [ ] Add a failing content-contract test that imports the new modules and asserts the five assumptions; all four scoring criteria and their 5/3/1 rubrics; the `5/5/4/3 -> 33.3`, `4/5/3/3 -> 20`, and `4/3/3/4 -> 9` rows; all eight in-scope and five out-of-scope MVP strings; protocol; metrics; guardrails; and three follow-up experiments.
- [ ] Export narrow readonly types (`Criterion`, `ScoreRow`, `MetricGroup`, `Experiment`) and `as const` data. Preserve every current display string, target, order, winner flag, and formula exactly. Keep feature-source data in `sections/useCaseData.ts`; do not duplicate it.
- [ ] Replace each section's module-local constant with the corresponding import. Preserve all existing markup and output aside from import lines and local type annotations.
- [ ] Run `npx jest __tests__/ma-homeassignment-content.test.ts __tests__/ma-homeassignment.test.tsx --runInBand` and confirm both the new contract and current source-page regression pass.
- [ ] Commit with message `refactor: share MA assignment content`.

## Task 2: Build tested navigation, stage, and presentation primitives

**Files:**

- Create: `app/MA-HomeAssignment/presentation/nav.ts`
- Create: `app/MA-HomeAssignment/presentation/primitives.tsx`
- Create: `app/MA-HomeAssignment/presentation/PresentationStage.module.css`
- Create: `app/MA-HomeAssignment/presentation/useDeckReset.ts`
- Test: `__tests__/ma-presentation-nav.test.ts`
- Test: `__tests__/ma-presentation-primitives.test.tsx`

- [ ] Write failing pure-helper tests for `clampIndex`, `stepIndex`, `hashForIndex`, and `indexFromHash`. Invalid, malformed, zero, negative, decimal, and out-of-range hashes must resolve to index `0`; valid `#slide-n` hashes resolve to zero-based indices; clamping must use the supplied registry length.
- [ ] Implement the helpers without a hard-coded total. Export `isDeckInteractiveTarget(target)` so the deck can ignore interactive descendants, including any element below `[data-deck-interactive]`.
- [ ] Write failing primitive tests for semantic headings, the `n / total` counter, focusable reveal controls, visible default summaries, and print-only supporting detail.
- [ ] Implement typed `SlideShell`, `SlideTitle`, `Eyebrow`, `Panel`, `Pill`, `StageCounter`, `RevealControl`, and `PrintDetails`. Keep projection copy at least 14px and use accessible focus-visible styling.
- [ ] Implement `useDeckReset(reset, slideKey)` as a small hook driven by the active slide key, so interactive visuals reset without global custom events.
- [ ] Add CSS module rules for the 1280x720 stage, 250ms opacity transition, reduced-motion override, desktop notice, focus rings, and page-sized print output. Do not mount separate print and screen component trees.
- [ ] Run `npx jest __tests__/ma-presentation-nav.test.ts __tests__/ma-presentation-primitives.test.tsx --runInBand`.
- [ ] Commit with message `feat: add MA presentation foundation`.

## Task 3: Compose typed presentation data and reusable concept visuals

**Files:**

- Create: `app/MA-HomeAssignment/presentation/deckData.ts`
- Create: `app/MA-HomeAssignment/presentation/components/EconomyMap.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/ConceptOverview.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/ConceptThesis.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/MechanicsLoop.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/InteractiveCallout.tsx`
- Test: `__tests__/ma-presentation-data.test.ts`
- Test: `__tests__/ma-presentation-concepts.test.tsx`

- [ ] Write failing data tests proving the three concepts reference `USE_CASE_1`, `USE_CASE_2`, and `USE_CASE_3`; preserve their current strategy, loops, values, risks, and mockup paths; and contain no AEC labels such as Change Validation, Context Link, Coordination Lock, or Conformance Review.
- [ ] In `deckData.ts`, add only presentation-specific theses, monetization summaries, loop-step implications, reveal rationales, approach annotations, assumption consequences, recommendation evidence, score rationales, flow branch notes, scope rationales, and closing groups. Derive assignment values from shared modules instead of copying them.
- [ ] Write failing interaction tests proving each reusable concept visual keeps its thesis/loop visible, shows supporting detail on hover and focus, and resets when `slideKey` changes.
- [ ] Implement `EconomyMap` with visible Spins, Coins, Villages, Chests, Collections, LiveOps, Social, and PvP relationships plus the three visible ARPDAU paths. Interaction may emphasize connections but cannot hide the complete map.
- [ ] Implement neutral `ConceptOverview`, image-led `ConceptThesis`, and data-driven `MechanicsLoop`. Use real buttons for label/step reveals and a shared `InteractiveCallout`; no ranking cues appear in the overview.
- [ ] Run `npx jest __tests__/ma-presentation-data.test.ts __tests__/ma-presentation-concepts.test.tsx --runInBand`.
- [ ] Commit with message `feat: add MA presentation story data`.

## Task 4: Implement slides 1 through 11, including the preserved About interaction

**Files:**

- Create: `app/MA-HomeAssignment/presentation/slides/Slide01Cover.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide02About.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide03Approach.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide04Economy.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide07HometownMechanics.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide09CardBountyMechanics.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide11HotTrailMechanics.tsx`
- Test: `__tests__/ma-presentation-opening.test.tsx`

- [ ] Write failing slide tests for the exact sequence and headline contracts. Assert Cover copy, all six About bullets, the Brazil/Holland/Israel timeline, the family photo, Eduardo reveal parity on hover/focus, six approach steps, neutral three-bet ordering, and thesis/mechanics framing for all three features.
- [ ] Build the Cover with `/coinmaster-sky.webp`, a dominant `Increasing ARPDAU` title, `Product Manager - Home Assignment`, author name, and restrained local Coin Master imagery. Keep the opening state free of controls beyond deck chrome.
- [ ] Port the About content and Brazil-to-Eduardo behavior from the HA presentation while restyling its frame, markers, and typography with the approved MA palette. The interaction must be a keyboard-focusable control and preserve the normal Eliahu state by default/print.
- [ ] Build Approach, Economy, and Three Bets as distinct pacing slides: process ribbon, dominant economy system, then a neutral three-column concept overview with no medals, totals, or winner styling.
- [ ] Compose the six thesis/mechanics slides from the reusable components. Each thesis slide uses the existing mockup as its dominant visual; each mechanics slide keeps the full loop, monetization mechanism, motivations, and current risks visible.
- [ ] Run `npx jest __tests__/ma-presentation-opening.test.tsx --runInBand`.
- [ ] Commit with message `feat: build MA presentation concept chapter`.

## Task 5: Implement assumptions, interactive comparative scoring, and recommendation

**Files:**

- Create: `app/MA-HomeAssignment/presentation/components/AssumptionGrid.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/ScoreMatrix.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/RecommendationReasons.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide12Assumptions.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide13ComparativeScoring.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide14Recommendation.tsx`
- Test: `__tests__/ma-presentation-scoring.test.tsx`

- [ ] Write failing tests for all five assumptions and consequences, all visible table values/totals, Card Bounty's default winner band, criterion-column/feature-row active state, and the compact formula below the table.
- [ ] For every numeric criterion cell, test pointer hover and keyboard focus parity, feature-specific rationale, current criterion definition, and all current 5/3/1 rubric lines. Test Enter/click pinning, active-cell toggle, Escape clear, total-cell formula detail, and reset after `slideKey` changes.
- [ ] Implement a semantic table. Numeric cells are buttons with descriptive `aria-label`s. Use one controlled active state `{ rowId, criterionId, mode: 'hover' | 'focus' | 'pinned' }`; pinned state wins over incidental hover/focus until cleared.
- [ ] Keep Card Bounty's winner row and all three totals visible in every state. Add a separate static print criterion/rubric summary below the printed table. Do not add another criteria slide.
- [ ] Implement the recommendation as an unmistakable visible conclusion: familiar Chest/Collection behavior, added Coin demand, bounded repeatable LiveOps validation, and the guarantee/economy risk plus mitigation direction.
- [ ] Run `npx jest __tests__/ma-presentation-scoring.test.tsx --runInBand`.
- [ ] Commit with message `feat: add MA presentation decision chapter`.

## Task 6: Implement Card Bounty player flow, MVP scope, and prototype slides

**Files:**

- Create: `app/MA-HomeAssignment/presentation/components/PlayerFlow.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/ScopeBoard.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/PrototypeCard.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide16MvpScope.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide17Prototype.tsx`
- Test: `__tests__/ma-presentation-deep-dive.test.tsx`

- [ ] Write failing tests for the six visible flow stages, branch detail on focus/hover, all eight in-scope and five out-of-scope requirements, scope rationale reveals, and the prototype link contract.
- [ ] Implement the player flow as a complete visible left-to-right path with accessible node controls. Highlight the active path/branch without removing other nodes; print shows branch notes beneath the flow.
- [ ] Implement a two-column MVP scope board from canonical `SCOPE_IN` and `SCOPE_OUT`. Presentation-only rationales explain learning objective or boundary, never replace the source requirement.
- [ ] Implement an image-led prototype card using existing `/coinmaster-sky.webp` and `/coinmaster/prototype.webp`. The CTA opens `/MA-HomeAssignment/demo` in a new tab with `rel="noopener noreferrer"`; do not embed an iframe.
- [ ] Run `npx jest __tests__/ma-presentation-deep-dive.test.tsx --runInBand`.
- [ ] Commit with message `feat: add Card Bounty deep dive slides`.

## Task 7: Implement experiment design, metrics, follow-up tests, and closing

**Files:**

- Create: `app/MA-HomeAssignment/presentation/components/ExperimentDesign.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/MetricMatrix.tsx`
- Create: `app/MA-HomeAssignment/presentation/components/FollowUpExperiments.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide18ExperimentDesign.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide19Metrics.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide20FollowUpExperiments.tsx`
- Create: `app/MA-HomeAssignment/presentation/slides/Slide21ThankYou.tsx`
- Test: `__tests__/ma-presentation-validation.test.tsx`

- [ ] Write failing tests for canonical Population, Control, Treatment, and Hypothesis copy; primary/supporting/guardrail metric targets; metric definition/denominator rationale reveal parity; all three follow-up experiments and their setup/outcome; and closing links to the approved chapter slide hashes.
- [ ] Implement experiment design so Control and Treatment are visually comparable and the single experimental difference is clear. Keep the hypothesis visible at all times.
- [ ] Implement metric cards with ARPDAU as the dominant primary metric; organize monetization, economy, and funnel support separately from long-term guardrails. A metric control reveals definition, denominator, target, and classification rationale; print exposes all notes.
- [ ] Implement the three follow-up experiment cards with visible names and compact setup/outcome, plus optional treatment/uncertainty/decision detail.
- [ ] Build the Thank You slide with concise chapter jump links. Use real anchors to `#slide-3`, `#slide-5`, `#slide-13`, `#slide-15`, and `#slide-18`; no reload and no out-of-deck targets.
- [ ] Run `npx jest __tests__/ma-presentation-validation.test.tsx --runInBand`.
- [ ] Commit with message `feat: complete MA presentation validation chapter`.

## Task 8: Integrate the 21-slide registry, deck controller, route, and metadata

**Files:**

- Create: `app/MA-HomeAssignment/presentation/slideRegistry.tsx`
- Create: `app/MA-HomeAssignment/presentation/PresentationDeck.tsx`
- Create: `app/MA-HomeAssignment/presentation/page.tsx`
- Modify: `app/MA-HomeAssignment/presentation/PresentationStage.module.css`
- Test: `__tests__/ma-presentation-registry.test.ts`
- Test: `__tests__/ma-presentation-deck.test.tsx`
- Test: `__tests__/ma-presentation-page.test.tsx`

- [ ] Write failing registry tests for 21 unique IDs in exact order, component presence, short neighbor labels, registry-derived count, and unique closing-menu targets.
- [ ] Write failing controller tests for initial/invalid hash behavior, hash changes, browser history, next/previous button labels, ArrowRight/ArrowLeft/Space/Shift+Space, boundary clamping, `defaultPrevented`, interactive descendants, and Escape. First Escape clears a pinned/reveal interaction when consumed; otherwise Escape returns to `/MA-HomeAssignment`.
- [ ] Test that only the active screen slide is focusable, changing slides resets local interactions, the counter remains `n / 21`, reduced-motion styling is present, and screen/print are derived from one mounted registry tree without a second hidden deck.
- [ ] Implement `slideRegistry.tsx` as the single ordered source of `{ id, title, shortTitle, chapter, Component }`. Render all 21 registry entries exactly once: active screen content is visible, inactive sections are `aria-hidden` and `inert`, and print CSS flows every section with static supporting details visible.
- [ ] Implement the viewport observer and scaled 1280x720 stage. Show the notice below 960x540. Add/remove a `ma-presentation-active` body class so the portfolio's coarse-pointer landscape guard is disabled only while this route is mounted.
- [ ] Synchronize state and `#slide-n` safely with `history.replaceState` for deck moves and `hashchange`/`popstate` for browser navigation. Jump anchors update the active slide without a document reload.
- [ ] Scope existing Nunito and Nunito Sans local variable fonts in `page.tsx`; add accurate presentation metadata, canonical URL, `robots` noindex/nofollow, and cache-control/no-cache protection consistent with the MA source route.
- [ ] Run `npx jest __tests__/ma-presentation-registry.test.ts __tests__/ma-presentation-deck.test.tsx __tests__/ma-presentation-page.test.tsx --runInBand`.
- [ ] Commit with message `feat: add MA presentation route`.

## Task 9: Verify visual quality, accessibility, regressions, and production behavior

**Files:**

- Modify as findings require: `app/MA-HomeAssignment/presentation/**`
- Modify as findings require: `__tests__/ma-presentation-*.test.ts*`
- Create: `docs/superpowers/verification/2026-07-16-ma-homeassignment-presentation.md`

- [ ] Run focused presentation coverage: `npx jest __tests__/ma-presentation-*.test.ts* --runInBand`.
- [ ] Run source-page and prototype regression coverage: `npx jest __tests__/ma-homeassignment.test.tsx __tests__/ma-homeassignment-content.test.ts app/MA-HomeAssignment/demo/__tests__ --runInBand`.
- [ ] Run the full test suite: `npm test -- --runInBand`.
- [ ] Run `npx tsc --noEmit`, `npx next build`, and `git diff --check`. Use `npx next build`, not `npm run build`, because the repository prebuild mutates image assets.
- [ ] Launch the local app and inspect all 21 slides at 1280x720, 1440x900, and a short desktop viewport at least 960x540. Confirm stage centering/scaling, title anchors, projection legibility, image cropping, no overflow, and no accidental ranking on slide 5.
- [ ] Perform a keyboard-only walkthrough of navigation, About, approach/economy reveals, concept loops, scoring hover/focus/pin parity, player flow, scope, metrics, experiments, prototype CTA, and closing jump links.
- [ ] Inspect below-threshold desktop notice, reduced-motion mode, browser back/forward, invalid hashes, route Escape behavior, source assignment, and demo.
- [ ] Perform only a basic browser-print smoke check if the existing fallback remains; print layout polish is not a completion gate.
- [ ] Record exact commands, pass/fail evidence, viewport findings, and any residual non-blocking limitations in the verification note. Fix all Critical/Important findings and re-run the covering checks.
- [ ] Commit with message `test: verify MA presentation experience`.

## Completion Gate

- [ ] Request a whole-branch code review against the merge base and resolve every Critical or Important finding.
- [ ] Re-run all Task 9 verification after review fixes.
- [ ] Confirm `git status --short --branch` shows branch `presentation` with no unintended changes.
- [ ] Stop with the branch unmerged and undeployed. Offer only `Push and create a PR` or `Keep as-is`; do not merge autonomously.
