# MA Home Assignment Presentation — Design Spec

**Date:** 2026-07-16  
**Branch:** `presentation`  
**Route:** `/MA-HomeAssignment/presentation/`

## Goal

Create a presenter-led, approximately 30-minute web presentation that converts the existing Moon Active home assignment into a clear executive product narrative. The deck must preserve the assignment's facts, decisions, prototype, and Coin Master-inspired visual identity while adopting the pacing, projection scale, navigation, and progressive-disclosure discipline of `/HA-DrawingAnalyzer/presentation/`.

The presentation is an additive interview deliverable. It must not merge to `main`, deploy, or become publicly discoverable without explicit user authorization.

## Approved direction

- Use a **decision-led deep dive**: establish the game and opportunity space, present all three concepts, show the comparative decision, then spend the second half proving Card Bounty through flow, MVP scope, prototype, validation, metrics, and follow-up tests.
- Target **21 slides** for a roughly 30-minute live presentation.
- Present Hometown, Card Bounty, and Hot Trail as **product theses and monetization mechanisms**. Do not force an artificial problem/solution structure onto the three concepts.
- Do not create a standalone prioritization-criteria or modified-RICE slide. Put the criteria explanation and rubric into hover/focus interactions on the comparative table itself. Keep the formula as a compact note beneath that table.
- Keep the current About Me slide's content, photograph, timeline, bullets, and Brazil/Eduardo interaction. Restyle it with the MA presentation's typography and colors.
- Keep essential claims visible without interaction. Hover, focus, and click reveal supporting depth only.

## Safety and scope guardrails

- Work only on the `presentation` branch.
- Do not merge to `main` or `master`.
- Do not deploy or alter hosting without explicit user authorization.
- Keep `/MA-HomeAssignment` and `/MA-HomeAssignment/demo` visually and behaviorally unchanged. Existing components may be refactored to consume shared content constants, but their rendered output must remain equivalent.
- Keep the new route unlisted and protected with `noindex`, `nofollow`, and `nocache` metadata consistent with the existing assignment route.
- Use existing local Coin Master and Card Bounty assets. The presentation must not depend on runtime network requests.

### Scope update — print output

The user clarified on 2026-07-16 that browser Print / Save as PDF and physical-paper output are not relevant to the presentation. Existing lightweight print fallbacks may remain, but print-specific layout polish is not a delivery priority or completion gate. Screen presentation quality, interactions, keyboard control, responsive desktop behavior, and localhost QA govern tradeoffs.

## Narrative principles

1. **Show the economic system before the ideas.** The audience should understand how Spins, Coins, Villages, Chests, Collections, LiveOps, social systems, and PvP connect before evaluating features.
2. **Give the three concepts fair airtime.** The opportunity overview must not show medals, totals, or a winner before the decision slide.
3. **Separate concept appeal from decision quality.** Each concept gets a thesis slide and a mechanics/economy slide. The comparison comes only after assumptions are explicit.
4. **Make the recommendation unmistakable.** Card Bounty receives a dedicated recommendation slide; the conclusion is never hidden behind an interaction.
5. **End with learning, not polish.** The prototype demonstrates the idea, while experiment design, guardrails, and follow-up tests demonstrate product judgment.
6. **Alternate density.** Low-density thesis slides create breathing room between denser mechanics, scoring, flow, and validation slides.

## Slide map

| # | Slide | Visible story | Supporting interaction |
|---|---|---|---|
| 1 | Cover | “Increasing ARPDAU,” Product Manager · Home Assignment, Eliahu Cohen, Coin Master identity | None; clean opening state |
| 2 | About | Existing name, “Architect, Product Manager,” family photo, Brazil → Holland → Israel, and the six existing personal/career bullets | Hover/focus Brazil crossfades Eliahu to Eduardo, matching the current HA deck behavior |
| 3 | Approach | Play the game → map systems/economy → research advanced play → benchmark competitors → generate concepts → filter and validate | Hover/focus a step reveals the source or decision produced by that step |
| 4 | Coin Master economy | Core loop and meta systems, plus the three ARPDAU paths: new spend surface, increased resource demand, and purchase frequency through re-engagement | Hover/focus a system highlights its inputs, outputs, and relevant monetization path |
| 5 | Three bets | Hometown, Card Bounty, and Hot Trail shown neutrally with their one-line thesis and ARPDAU mechanism | Hover/focus a concept previews its core loop; no ranking is shown |
| 6 | Hometown thesis | A persistent customizable town built from unlocked Village items; mockup and the concept's lasting ownership/social utility | Hover/focus labels reveal progression, customization, and friend-visit details |
| 7 | Hometown mechanics | Complete Villages → unlock items → spend Coins → receive the next-Village discount; new spend surface | Hover/focus loop steps reveal monetization implication; motivation/risk labels reveal their current source-page explanations |
| 8 | Card Bounty thesis | A limited LiveOps event that gives a visible path to a missing Card; mockup and guarantee proposition | Hover/focus labels reveal target selection, meter progression, and guarantee details |
| 9 | Card Bounty mechanics | Earn Coins → select missing Card → buy Chests → fill meter → receive target → progress Collection → earn Spins; increased resource demand | Hover/focus loop steps reveal economy implication; motivation/risk labels reveal their current source-page explanations |
| 10 | Hot Trail thesis | A time-limited Counter-Raid that converts a loss into an urgent reason to return and Spin; mockup and revenge/recovery proposition | Hover/focus labels reveal activation window, target duration, recovery cap, and anti-loop limits |
| 11 | Hot Trail mechanics | Progress Village → get Raided → activate trail → use Spins → trigger Counter-Raid → recover part of loss; re-engagement and offer exposure | Hover/focus loop steps reveal monetization implication; motivation/risk labels reveal their current source-page explanations |
| 12 | Assumptions | The five current assumptions, including ARPDAU as the outcome, long-term demand/loop health as constraints, familiar-mechanic extension, platform capability, and directional values without internal data | Hover/focus one assumption emphasizes it and reveals its practical consequence for the decision |
| 13 | Comparative scoring | Current three-row table, totals 33/20/9, Card Bounty highlighted, plus a compact modified-RICE formula note | Every score cell supports hover/focus/click detail as specified below |
| 14 | Recommendation | Card Bounty wins because it extends familiar Chest/Collection behavior, creates additional Coin demand, and can be validated as a bounded repeatable LiveOps event; the guarantee/economy risk remains visible | Hover/focus each reason reveals the supporting assignment evidence; risk reveals the mitigation direction |
| 15 | Expanded player flow | Entry → target selection → progress → Chest results → target/meter decision → Collection update | Hover/focus a node highlights the active path and reveals branch logic without hiding the full flow |
| 16 | MVP scope | Current in-scope and out-of-scope boundaries, preserving all source requirements | Hover/focus an item emphasizes it and reveals the learning objective or boundary rationale |
| 17 | Interactive prototype | Card Bounty prototype preview and a prominent link to `/MA-HomeAssignment/demo` in a new tab | Preview has an explicit open action; no iframe is embedded in the deck |
| 18 | A/B-test design | Population, control, treatment, and the current hypothesis | Hover/focus control or treatment emphasizes the single experimental difference; hypothesis remains visible |
| 19 | Success metrics and guardrails | Primary ARPDAU target, supporting monetization/economy/funnel metrics, and long-term guardrails with their current proposed targets | Hover/focus a metric reveals definition, denominator, target, and why it is primary/supporting/guardrail |
| 20 | Follow-up experiments | Meter Goal Calibration, Paid Progress Carryover, and Chest Tier Weighting | Hover/focus a test reveals its treatment, uncertainty, and the decision the result would enable |
| 21 | Thank you | Closing message and concise jump menu to the deck's major sections | Real links update the slide hash without reloading |

## Comparative scoring interaction

The comparative table replaces a separate criteria-explanation slide.

- Default state: Card Bounty's winner row is highlighted with a warm gold band. All feature names, scores, totals, and the compact formula note are visible.
- Hover or keyboard focus on any numeric criterion cell:
  - emphasizes the active feature row and criterion column;
  - makes the active number the strongest typographic element;
  - shows a consistent detail panel containing the criterion title, its current definition, and the current 5/3/1 rubric from `/MA-HomeAssignment`;
  - shows a concise feature-specific rationale for the displayed score, derived only from the assignment's concept, monetization, risk, and recommendation copy.
- Click or Enter pins the detail panel for presenter control. Escape, clicking the active cell again, or leaving the slide clears the pinned state.
- Hover/focus on Total explains that it is a relative opportunity score and shows the compact formula, not a fabricated precision claim.
- Card Bounty's ranking and the three final totals remain visible in every state.
- Print/PDF shows the table plus a static criteria-and-rubric summary beneath it.

## Visual identity

### Color roles

- Cream canvas: `#FFF9EE`
- Deep violet headings: `#2A1B54`
- Gold value/progression: `#F5A800`
- Crimson risk/decision: `#C8102E`
- System blue: `#1E7BA8`
- Wood/border brown: `#903900`
- Ink: `#1A1A1A`
- Secondary charcoal: `#666666`
- Sky/cloud imagery: `/coinmaster-sky.webp`, reserved for the cover and restrained chapter accents

Gold and crimson may be paired in short progress rules or comparison accents. Blue is functional and should identify systems, information, or flow relationships. Violet remains the primary headline color. Cream dominates the presentation canvas.

### Typography

- Display/title face: the existing local Nunito variable font, weight 800–900.
- Body/label face: the existing local Nunito Sans variable font, weight 400–700.
- Cover title: approximately 72–84 px at the 1280×720 design stage.
- Slide titles: approximately 48–64 px.
- Body copy: 16–18 px where possible, never below 14 px at the design stage.
- Eyebrows and compact labels: 11–13 px, uppercase, tracked, and high-contrast.

### Layout and graphics

- Author against a fixed 1280×720, 16:9 stage.
- Use a consistent anchored title position and shared horizontal margins.
- Use rounded Coin Master-style panels, layered borders, small ribbons, stars, coins, and controlled shadows selectively. These elements support hierarchy; they do not fill empty space decoratively.
- Favor one dominant graphic per slide: a mockup, loop, table, flow, prototype preview, or metric system.
- Keep generous negative space and projection-scale copy. Dense source-page tables are redesigned for staged disclosure rather than copied at page scale.
- The About slide retains its existing content and photo. Its frame, timeline, markers, and hover colors change to violet/gold/crimson/cream without changing the message.

## Interaction model

- Desktop navigation: ArrowRight or unmodified Space advances; ArrowLeft or Shift+Space goes back; Escape returns to `/MA-HomeAssignment` unless an interaction first consumes Escape to close pinned detail.
- Previous/next controls use the neighboring slide's short title and sit in consistent bottom corners. A centered slide counter shows `n / 21`.
- Each slide has a stable `#slide-n` hash. Browser back/forward and closing-menu links update the active slide.
- Slides crossfade in approximately 250 ms. `prefers-reduced-motion` disables nonessential motion.
- Essential meaning is present in the default state. Interaction may reveal explanations, rationales, mitigations, definitions, targets, or branch detail.
- Every interactive reveal uses a real button or focusable semantic control. Keyboard focus produces the same information as hover.
- Space, Enter, and arrow keys used inside a slide control must not also navigate the deck. The deck respects `event.defaultPrevented` and ignores events from interactive descendants.
- Inactive slides are unfocusable through `inert` or by rendering only the active interactive tree.
- Transient hover/pinned/reveal state resets when the deck changes slide.

## Responsive behavior

- Viewports at least 960 px wide and 540 px tall render the 1280×720 stage, scaled by the smaller width or height ratio so short desktops and capable landscape tablets do not clip dense slides.
- Viewports below either 960 px wide or 540 px tall show a branded notice that the presentation is designed for desktop, plus a link back to `/MA-HomeAssignment`.
- The route must not be blanked by the portfolio's coarse-pointer landscape guard when the viewport can display the scaled presentation.
- A lightweight browser-print fallback may remain if it does not complicate the screen experience, but print/PDF output is not optimized or acceptance-tested.

## Content architecture

The presentation must not repeat the HA deck's manually copied “keep in sync” data pattern.

- Continue using `app/MA-HomeAssignment/sections/useCaseData.ts` as the canonical feature source.
- Extract module-local prioritization, MVP, validation, and assumptions constants into focused shared modules under `app/MA-HomeAssignment/content/`.
- Update the existing MA section components to import those shared constants without changing their rendered output.
- Presentation-only phrasing, score rationales, slide labels, and interaction summaries live in `app/MA-HomeAssignment/presentation/deckData.ts` and reference the shared canonical values.
- No AEC-specific legacy fields from the copied use-case schema may appear in the MA presentation.

## Component architecture

Create an additive presentation package under `app/MA-HomeAssignment/presentation/`:

- `page.tsx`: server metadata, local font scoping, and the presentation entry point.
- `PresentationDeck.tsx`: active-slide state, hash synchronization, keyboard navigation, viewport stage, print mode, and deck chrome.
- `slideRegistry.tsx`: the single ordered registry for component, ID, title, short navigation label, and closing-menu grouping. Total slide count and navigation derive from this registry.
- `nav.ts`: pure hash/index/clamping helpers.
- `deckData.ts`: presentation-specific copy and score rationales composed with canonical shared content.
- `primitives.tsx`: slide shell, eyebrow, stage counter, panel, pill, and common focus/reveal treatments.
- `components/`: focused interactive visuals for the game economy, concept mechanics, score matrix, player flow, scope, metric matrix, and experiments.
- `slides/`: small slide components corresponding to the approved 21-slide map.

Each component has one visual responsibility and receives typed data. Repeated slide patterns are data-driven; unique narrative slides remain explicit components.

## Error handling and fallbacks

- Missing, malformed, zero, negative, or out-of-range slide hashes resolve to the cover without throwing.
- Hash changes from browser history and jump links update the active slide safely.
- Local asset paths are verified in tests/build. Missing required presentation imagery is a verification failure, not a silent runtime fallback.
- The prototype action points only to the local `/MA-HomeAssignment/demo` route and uses `noopener noreferrer`.
- Interaction state resets on navigation so revisiting a slide starts from its intentional default state.
- The presentation has no runtime data fetching and therefore no network loading/error state.

## Testing and verification

Automated coverage must include:

- navigation clamping, hash parsing, hash generation, and registry-derived total;
- one-to-one uniqueness of slide IDs and closing-menu targets;
- keyboard navigation, including interactive descendants and `defaultPrevented` events;
- inactive-slide focus protection;
- scoring-cell hover/focus/pin parity and correct criterion/rubric content;
- reveal-state reset on slide navigation;
- canonical shared content used by both the current page and the presentation;
- prototype link target and route metadata;
- reduced-motion and print-state class behavior where practical in jsdom.

Final verification commands:

- targeted presentation Jest tests;
- existing MA Home Assignment and Card Bounty tests;
- full `npm test`;
- `npx tsc --noEmit`;
- `npx next build` to avoid the repository's image-optimization prebuild mutating unrelated assets;
- `git diff --check`;
- browser QA at 1280×720, 1440×900, and a shorter desktop viewport;
- keyboard-only walkthrough of every interaction;
- regression checks for `/MA-HomeAssignment` and `/MA-HomeAssignment/demo`.

## Acceptance criteria

- `/MA-HomeAssignment/presentation/` presents all 21 approved slides in the approved order.
- The deck supports presenter navigation, stable hashes, a closing jump menu, and a 250 ms crossfade with reduced-motion fallback.
- The About slide preserves its current content and Brazil/Eduardo interaction while matching the MA visual identity.
- Feature slides use concept-thesis and mechanics/economy framing, not artificial problem slides.
- The comparative table contains the current scores and totals, with per-number hover/focus explanations based on the current criterion tooltips and feature-specific score rationale.
- Card Bounty's recommendation is visible on its own slide.
- Existing MA content, prototype, MVP boundaries, validation targets, guardrails, and follow-up tests are represented accurately.
- Essential information is visible by default; supporting information is accessible by pointer and keyboard.
- The presentation uses the MA cream/violet/gold/crimson/blue/wood system and local Nunito/Nunito Sans fonts.
- The existing MA assignment and demo retain their rendered behavior.
- Type checking, tests, production build, browser QA, and print inspection pass.
- Work remains on `presentation`; nothing is merged or deployed.

## Out of scope

- Changing the underlying product recommendation or source assignment conclusions.
- Adding new feature concepts, new economy claims, or invented internal Moon Active data.
- Embedding the full interactive prototype in an iframe.
- Redesigning `/MA-HomeAssignment` or `/MA-HomeAssignment/demo`.
- Publishing, deploying, merging, or making the route publicly discoverable.
