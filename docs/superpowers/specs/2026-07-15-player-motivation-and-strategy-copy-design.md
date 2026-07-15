# Player Motivation and Monetization Strategy Copy Design

## Goal

Reframe the positive feature outcomes as player motivations and simplify each feature's monetization strategy to the approved regular-weight copy.

## Shared presentation

- Rename `Value delivered & risks` to `Player motivation & risks` in every feature section.
- Preserve the current positive-card and risk-card visual treatments, layout, spacing, typography, and responsive behavior.
- Preserve every existing risk title and description exactly.
- Replace only the positive-card content listed below.
- Render every Monetization Strategy paragraph as regular 14px charcoal body text with no bold text.

## Approved player motivation copy

### Hometown

- **Expression and Ownership** — *A permanent space that feels personal.*
- **Progress and Status** — *High-level Village items become proof of progress.*
- **Social Recognition** — *Visits, reactions and snapshots create an audience.*

### Card Bounty

- **Agency** — *Choose the Card that matters most.*
- **Visible Progress** — *Every Chest advances toward a guaranteed result.*

### Hot Trail

- **Urgency** — *A limited window creates a reason to return.*
- **Recovery and Revenge** — *Respond directly to a Raid and recover part of the loss.*

## Approved monetization strategy copy

### Hometown

`New spend surface`

The exact text has no terminal period.

### Card Bounty

`Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.`

### Hot Trail

`Purchase frequency through re-engagement.`

No additional strategy sentence follows any of these strings.

## Data and component design

Simplify the optional `UseCaseData.monetizationStrategy` field from:

```ts
{
  lead: string
  body: string
}
```

to:

```ts
string
```

The `MonetizationStrategy` renderer accepts the string and outputs it directly inside the existing body paragraph. Remove the `<strong>` element and bold class because none of the three approved strategies contains emphasized text.

Keep the existing `value` data key and positive-card variant. This is a copy/framing change rather than a new domain model, and retaining the current key avoids unrelated component churn.

## Testing and verification

Add regression coverage that verifies:

- All three feature sections display `Player motivation & risks` and none displays `Value delivered & risks`.
- The exact motivation titles and descriptions render for each feature.
- Every existing risk title and description remains unchanged.
- Each exact monetization strategy renders as a plain paragraph with no `<strong>` descendant.
- The previous strategy copy no longer renders.

Run the focused assignment suite, full suite, production build, and `git diff --check`. Visually inspect all three sections at desktop and mobile widths, confirming the existing card layout remains stable and the strategy paragraphs do not appear bold.

## Out of scope

- Changes to Metrics, Loop, Concept, prioritization, MVP, Success Metrics, mockups, or the interactive prototype.
- Renaming the internal `value` field or positive-card styling variant.
- Any changes to risk content or styling.
