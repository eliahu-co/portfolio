# Task 6 RED/GREEN report

## Scope

- Branch: `presentation`
- Base: `869832405797e56c96c2209f21ec86d15eea37e0`
- Commit message: `feat: add Card Bounty deep dive slides`
- Implementation is limited to slides 15–17, their three presentation components, and the focused test.

## RED

1. Added a focused assertion that the six requested chapter modules exist.
2. `npx.cmd jest __tests__/ma-presentation-deep-dive.test.tsx --runInBand` failed with one expected assertion diff: all six module paths returned `exists: false`.
3. Added minimal `null`-rendering module stubs, observed the module-existence assertion pass, then replaced it with the final behavioral contract.
4. The behavioral run failed 4/4 tests because the stubs exposed no headings, flow stages, scope requirements, print notes, images, or CTA. This confirmed the contract failed for the missing feature rather than a test typo.

PowerShell could not execute the `npx.ps1` shim under the machine execution policy, so all executable verification used the equivalent Windows `npx.cmd` shim.

## GREEN

- `npx.cmd jest __tests__/ma-presentation-deep-dive.test.tsx --runInBand`
  - 1 suite passed
  - 4 tests passed
- `npx.cmd tsc --noEmit`
  - Exit code 0
- Adjacent regression run:
  - `npx.cmd jest __tests__/ma-presentation-deep-dive.test.tsx __tests__/ma-presentation-data.test.ts __tests__/ma-presentation-primitives.test.tsx --runInBand --modulePathIgnorePatterns=.superpowers/worktrees`
  - 3 suites passed
  - 16 tests passed

## Contract covered

- Six canonical `PLAYER_FLOW` stages remain visible in a left-to-right path.
- Hover and keyboard focus reveal/highlight the corresponding branch note without removing any stage.
- Every branch note is present in print-only detail markup.
- All eight canonical `SCOPE_IN` and five canonical `SCOPE_OUT` strings remain visible; rationales are additive hover/focus details.
- Prototype uses `/coinmaster-sky.webp` and `/coinmaster/prototype.webp`.
- The only prototype CTA targets `/MA-HomeAssignment/demo` with `_blank` and `noopener noreferrer`; no iframe is rendered.
- No assignment content, demo source, deployment, merge, or push changes were made.

## Concern

The exact focused Jest command passes, but Jest prints duplicate-manual-mock warnings because it also scans the unrelated shared checkout at `.superpowers/worktrees/card-bounty-entry-attention`. The regression command ignores `.superpowers/worktrees` and is warning-free. No repository configuration was changed for this environment-only warning.
