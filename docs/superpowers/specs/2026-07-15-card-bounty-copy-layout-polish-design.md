# Card Bounty Copy and Layout Polish Design

## Goal

Apply the approved follow-up polish without changing the prototype economy, state machine, or interaction model.

## Guidance copy

The desktop prototype-controls plaque uses these exact strings for the corresponding overlay states:

- Active Bounty: `Buy Chests to progress the meter`
- Duplicate reveal: `Continue`
- Guaranteed Card reveal: `Collect your target Card`

Other targets use the same active-Bounty guidance; target-specific instructional branching is removed because the meter behavior is already visible in the dialog.

## Cards Center ribbons

Keep the collection portraits at `min(30cqw, 128px)`. Make only the collection-name ribbons more compact:

- Ribbon body width: `100%`
- Minimum height: `32px`
- Portrait overlap: `-27px`
- Horizontal padding: `9px`
- Tail size: `14px x 20px`, offset `-7px`
- Label size: `clamp(11px, 3.4cqw, 15px)`

This reduces the visual envelope from approximately portrait width plus 43px to portrait width plus 14px, leaving a visible gutter between neighboring ribbons at 338px, 390px, and 430px game widths.

## Interactive preview CTA

The whole preview remains one accessible link that opens the demo in a new tab. Only the yellow visual CTA moves:

- Small screens: `left: 12px; bottom: 12px`
- `md` and larger: centered at approximately `20%` of preview width and `47%` of preview height
- Hover uses scale/brightness, not Y translation, so the desktop centering transform cannot jump

The phone artwork remains centered and unchanged.

## Spins reward icon

Create a shared `SpinsIcon` primitive with the canonical `24 x 24` lightning path already used by the Spin screen. Use it for both Spin-screen glyphs and the Collection reward. The Collection reward keeps its existing 55px icon column and uses the same cyan fill, cream stroke, rounded join, and blue drop shadow as the Spin screen.

## Verification

- Regression-test all three exact guidance states.
- Lock the compact ribbon geometry in the Cards Center CSS contract test.
- Assert the preview CTA responsive positioning classes and unchanged link semantics.
- Assert the Collection reward uses the canonical lightning path and no star path.
- Run the complete Jest suite and production build.
- Inspect the Cards Center at 338px, 390px, and 430px game widths; inspect the Home Assignment preview at desktop and mobile widths.
