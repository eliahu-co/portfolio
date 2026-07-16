# MA Presentation Interaction Fidelity Design

## Direction

Use the HA DrawingAnalyzer presentation as the behavioral source of truth and the MA HomeAssignment page as the visual source of truth. This pass changes presentation components only. It does not change the assignment page, print behavior, deployment, or branch integration.

## Shared typography and navigation

- Eyebrows use black, lightweight HA-style labeling: `font-sans uppercase tracking-[0.14em] text-black mb-1`.
- Previous/next navigation remains uppercase but drops its current heavy weight and uses the same lighter black sans treatment.
- Existing slide title geometry remains unchanged.

## Shared arrows

- Replace text glyph arrows and inconsistent connector SVGs with one presentation arrow primitive derived from `CoreLoopDiagram`: thin rounded stroke, open chevron head, proportional SVG geometry, and configurable orientation/color.
- Use it in Approach, About journey, feature loops, and presentation-owned player-flow connectors.
- Preserve semantic relationships and existing color roles; geometry, cap, join, and arrowhead treatment become consistent.
- Make the Core Loop and Meta diagram smaller while preserving its exact source design.

## Feature slides

- All three feature slides use the same composition: loop and trade-off interaction on the left, screenshot on the right.
- The screenshot frame hugs the portrait image without wide white side gutters and retains the MA page's thin wood stroke and shallow drop edge.
- Monetization copy remains visible with no bold left edge.
- Loop steps use MA plaques and the shared SVG arrow primitive. The loop is visually closer to HA's compact workflow density.
- Player motivations and risks are hidden initially.
- A keyboard-accessible `Trade-off` control follows the HA SlideUseCase interaction: activating it reveals motivation and risk labels while fading the loop and image. Activating again hides them. Hover and focus behavior remain equivalent, and slide navigation resets the reveal.
- Remove bold left edges from the feature content and reveal lists.

## Comparative scoring

- Replace the winner star with rank medals for all three rows.
- Idle state highlights the winning row in gold.
- Hover/focus moves the gold highlight from the winner row to the active score column, matching HA. The exact score becomes visually larger and heavier without changing cell or row dimensions and without underline.
- Non-active rows fade while a score is active; the active row remains fully legible.
- Leaving/blurring restores the idle winner state.
- Existing rationale/rubric content and fixed-height disclosure geometry remain.

## Player flow and prototype

- Recompose the original MA `PlayerFlow` for the 1280x720 canvas: larger labels and pills, clearer phase separation, and a denser but intelligible resolution tree. Relationships and branch semantics remain unchanged.
- Use the shared arrow primitive throughout presentation-owned flow connectors.
- Reduce the interactive prototype miniature modestly while retaining its MA frame and working CTA.

## Metrics interaction

- Hover/focus on a metric makes the active row bolder and fades the other metric rows.
- The fixed detail rail remains mounted and all canonical rows remain visible.
- Leaving/blurring restores the full table.

## Verification

- Add focused regressions for typography, shared arrows, feature layout/reveal/reset, score medals and HA hover behavior, player-flow bounds, prototype size, and metric fade/focus behavior.
- Run all presentation tests, TypeScript, and `git diff --check`.
- Visually inspect every affected slide and representative interaction state at 1280x720.

## Constraints

- Branch remains `presentation`.
- Do not merge, push, create a PR, or deploy.
- Do not add print-specific work.
