# Card Bounty final polish design

## Goal

Bring the direct Card Bounty demo into visual alignment with the Moon Active home-assignment page and remove the remaining friction in the guided prototype, without changing the original artwork or the proven interaction sequence.

## Approved direction

The supplied screenshots and follow-up copy are the design authority for this pass. The existing HTML/CSS prototype remains the foundation; this pass changes presentation tokens, responsive geometry, balance, and terminal actions rather than rebuilding the experience as a raster mockup.

## Desktop shell

- Use `#FFF9EE` as the direct demo page background.
- Give both the game viewport and the Interactive concept plaque the home-assignment card treatment: 16px radius, 2px `rgba(144, 57, 0, .5)` border, and `0 3px 0 rgba(144, 57, 0, .28)` shadow.
- Keep the mobile game viewport edge to edge with no outer border, radius, or shadow.
- Round the Home assignment and Restart demo controls to 12px.
- Use the exact initial guidance: `Tap the shaking Card Bounty event`.

## Cards Center and purchase dialog

- Preserve the two-column Cards Center structure, but reduce collection medallions from `min(34cqw, 146px)` to `min(30cqw, 128px)`.
- Keep the Magical Chest behind the red title ribbon for readability, while anchoring its lower edge so the visible chest sits consistently above the ribbon at all acceptance sizes.
- Keep the Quantity label within the green stepper by reducing its compact-container size and tracking while maintaining the existing readability floor.

## Economy and terminal flow

- Set the Bounty threshold to 100.
- Keep a default purchase at 10 Magical Chests, worth 30 progress and 290M Coins.
- Complete the meter in four default batches: 30, 60, 90, 100. The final batch is capped to +10 progress and still charges the quoted batch cost.
- After the Collection reward, the in-game Spin page exposes exactly one interactive control: the fake Spin button. Menu, Shop, and Cards Center controls are removed.
- After Spin is pressed, show `You finished the demo!`; the deterministic reel reset remains replayable.
- The external desktop Home assignment and Restart demo controls remain available because they belong to the prototype shell, not the in-game final screen.

## Hometown copy addition

- Replace `Conversion and purchase frequency.` with `New spend surface`.
- Render this Hometown lead as normal text, not bold, while preserving the existing emphasis for the other two feature strategies.

## Responsive acceptance

Verify the full guided path and visual geometry at 1440x900 and 1366x768 desktop sizes, plus 390x844 and 430x932 mobile sizes. Confirm no clipping, overflow, obscured controls, or unintended navigation on the terminal screen.
