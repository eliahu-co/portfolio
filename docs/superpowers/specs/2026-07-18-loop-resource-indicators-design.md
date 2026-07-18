# Loop Resource Indicators Design

## Scope

Apply the approved inside-right resource indicator to the Hot Trail presentation loop only. Preserve the existing loop container, colors, arrows, return arrow, and hover behavior.

## Presentation

- Shorten the affected action labels so resource words are not repeated.
- Render a fixed right-edge slot inside relevant loop containers.
- Show a mathematical `−` for resource consumption and `+` for resource recovery.
- Use the existing transparent Coin and Spin emoji assets at equal visual height.
- Keep the action label optically centered and reserve no visible slot on neutral steps.

## Data model

Add an optional resource delta to `WorkflowStep`. `FeatureSlide` renders it; Hot Trail supplies the initial values. This shared contract allows a later data-only rollout to the other concepts.

## Accessibility

The emoji is decorative. The resource delta exposes an accessible label such as “Spend Coins” or “Gain Coins.”

## Verification

Test the Hot Trail labels, signs, assets, accessible descriptions, and absence of indicators on neutral steps. Verify the full suite and production build.
