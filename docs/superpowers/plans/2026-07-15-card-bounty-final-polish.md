# Card Bounty final polish implementation plan

## 1. Lock the requirements with tests

- Update shell presentation contracts for `#FFF9EE`, wood borders, 16px frames, 12px controls, and exact guidance copy.
- Update Cards Center scale contracts to `min(30cqw, 128px)`.
- Add purchase-dialog contracts for bottom-anchored chest art and the compact Quantity label.
- Update reducer and integration expectations for a 100-point threshold and four default Magical Chest batches.
- Update final-screen tests to require a single Spin button, no navigation controls, and `You finished the demo!` after activation.
- Update the Hometown strategy test to require `New spend surface` without a `strong` wrapper.

## 2. Implement the approved presentation

- Apply the warm shell and home-assignment wood-frame tokens.
- Reduce medallion sizing and preserve the two-column layout.
- Anchor the purchase hero to the frame top boundary and contain the Quantity label.

## 3. Implement balance, terminal behavior, and copy

- Change the shared Bounty threshold to 100.
- Remove the return-to-Cards-Center action, prop, button, Shop button, and menu button from the final screen.
- Change the post-Spin status message and retain deterministic fake Spin behavior.
- Add an opt-out for monetization lead emphasis and use it for Hometown.

## 4. Verify and ship

- Run focused tests after each change, then the complete test suite and production build.
- Inspect the full flow at 1440x900, 1366x768, 430x932, and 390x844.
- Request an independent review, fix any confirmed issues, and commit the feature branch. Then stop and obtain explicit user confirmation before any merge to `main`; only after that confirmation, merge the approved result, push, and verify the production URL.
