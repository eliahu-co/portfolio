# MA Presentation — HA Skeleton, MA Skin

## Communication job

By the end, Moon Active interviewers should understand why Card Bounty is the strongest ARPDAU opportunity, how it fits Coin Master’s existing systems, and how the recommendation can be tested without damaging the economy.

The deck remains a roughly 30-minute, 17-slide decision story:

1. Establish the candidate and decision approach.
2. Ground the audience in Coin Master’s core loop and meta.
3. Introduce and evaluate three feature bets.
4. Recommend Card Bounty.
5. Show its player flow, MVP, prototype, and validation plan.

## Visual system

The HA Drawing Analyzer presentation is the structural template. The MA presentation inherits its spacing, hierarchy, information density, navigation alignment, and progressive-disclosure patterns. MA’s established brand identity remains the visual skin.

### Layout

- Use one consistent anchored content frame on every non-hero slide.
- Match HA’s centered max-width canvas, 80px desktop side padding, and approximately 80px top anchor.
- Keep eyebrow, title, and body starting positions consistent across adjacent slides.
- Use equal left and right content margins.
- Reserve the bottom navigation zone; content must not compete with it.
- Prefer a flat composition over panels and card grids.
- Use available space deliberately: primary evidence occupies the visual center; supporting evidence sits below it and may begin faded.

### Typography

- Retain the MA Nunito/Nunito Sans font pairing and MA colors.
- Match HA’s relationships: 12px eyebrow, 64px slide title, 16–18px body, 11–12px table labels, and 16–18px table values.
- Use tighter title leading and spacing, with approximately 16px from eyebrow to title and 32px from title to the main composition.
- Remove subtitles that repeat what the slide already demonstrates.
- Keep titles to one line wherever possible.

### MA visual identity

- Background: MA cream for content slides; violet/sky treatments only on true hero slides.
- Type: deep violet and charcoal, with crimson or gold for restrained emphasis.
- Image frames: MA wood-toned stroke and short hard drop shadow.
- Flow pills: original MA fills, strokes, and shadows.
- Decorative elements are used only when they support a hero composition. They are excluded from About, Thank You, and evidence-heavy slides.

## Interaction and motion grammar

Interactions reveal evidence or focus attention; they do not introduce new decoration.

- Slide changes use a 250ms opacity crossfade.
- Within-slide transitions use 250–300ms opacity and background-color changes.
- No scale, bounce, expanding-card, or layout-shifting animations.
- Hover and keyboard focus always produce equivalent states.
- Mouse leave or blur restores the intentional default state unless the interaction is explicitly pinned by click.
- Changing slides resets all transient states.
- Reduced-motion preferences remove transitions without hiding content.

### Comparative scoring

The scoring interaction closely follows the HA ScoreTable behavior:

- Default: Card Bounty’s winning row is emphasized.
- Hover/focus a score: highlight the full criterion column.
- Emphasize the exact active cell typographically.
- Add a restrained row indicator to preserve the active feature context.
- Reveal the exact rationale in one fixed region below the table.
- Show the criterion definition and scoring rubric alongside the rationale.
- Fade secondary decision commentary while a cell is active; restore it on exit.
- Avoid tooltip cards, floating panels, and number containers.

### Other interaction patterns

- About: Brazil focus/hover swaps Eliahu/Eduardo; no other animation.
- Assumptions: hovering one assumption focuses it while the rest fade, matching HA.
- Metrics: hovering/focusing a metric reveals its definition in one fixed detail rail; table geometry does not move.
- Prototype: retain the original MA preview and CTA behavior without adding presentation-specific motion.
- Closing navigation: plain text links with color/underline changes only.

## Slide migration

1. **Cover** — retain MA hero identity; simplify decoration if it competes with the title.
2. **About** — adopt HA title sizing and image/facts density; retain MA image frame and journey pills.
3. **Approach** — use HA spacing with the original MA flow-pill language.
4. **Core loop and meta** — original MA diagram, sized inside the HA content frame.
5. **Three bets** — flat three-column introduction; no preview controls or redundant subtitle.
6–8. **Feature slides** — HA use-case density: framed image, original loop, motivations, and risks in one composition.
9. **Assumptions** — HA focus/fade list behavior, with MA colors.
10. **Comparative scoring** — near-direct structural adaptation of HA scoring and progressive detail.
11. **Recommendation** — image plus flat evidence; no card grid.
12. **Player flow** — original MA diagram inside the HA frame.
13. **MVP scope** — HA flat in/out list structure.
14. **Prototype** — original MA preview, centered and bounded by HA spacing.
15. **A/B-test design** — original MA experiment structure with HA typography and density.
16. **Success metrics** — original MA validation table with HA progressive-detail behavior.
17. **Closing** — resolve the recommendation; remove decorative loop and pill navigation.

## Responsive behavior

- The native presentation canvas is 1280×720.
- It may scale down to fit smaller viewports.
- It must never scale above 1; larger browser windows preserve the native canvas and letterbox it.
- No desktop-warning replacement screen.

## Testing and QA

- Component tests cover the 17-slide registry, navigation, state reset, keyboard parity, and scale cap.
- Interaction tests cover scoring, assumptions, About, and metric details.
- TypeScript and presentation tests must pass.
- Every slide is visually inspected at 1280×720.
- QA checks title anchoring, content density, navigation alignment, wrapping, clipping, overflow, and unintended layout movement.

## Non-goals

- No print or PDF-specific polish.
- No deployment, push, pull request, or merge without explicit authorization.
- No new content, diagrams, features, or visual language beyond the source MA assignment and HA presentation patterns.
