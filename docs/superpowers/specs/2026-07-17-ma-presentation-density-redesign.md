# MA Presentation Density Redesign

## Scope

Redesign only slides 11 and 15 of the MA presentation. The MA assignment page and its shared player-flow section remain unchanged.

## Slide 11: Phase focus

- Show four horizontal phase controls: Entry, Target, Progress, Resolution.
- Place presentation-style arrows between adjacent phase controls.
- On hover or keyboard focus, the active phase stays fully opaque and the other phases fade to 20% opacity.
- Reveal the active phase's steps directly beneath it as a vertical stack of blue MA containers.
- Place matching downward arrows between revealed steps.
- Keep the layout footprint stable so hover never moves the title or navigation.
- Reset to the four-phase overview when the pointer leaves the flow or focus leaves a phase.

## Slide 15: Primary metric plus tabs

- Keep ARPDAU permanently visible as the dominant, full-width primary-metric table row.
- Add Supporting metrics and Guardrails as accessible tab controls beneath it.
- Show one conventional three-column table at a time; Supporting metrics is the default.
- Preserve the current row interaction: hovering or focusing a row emphasizes it, fades its peers, and reveals its explanatory note beneath the table.
- Tabs switch content without changing the slide's outer geometry.
- Use the MA presentation palette and typography; do not introduce cards.

## Accessibility and motion

- Phase controls and tabs are native buttons with visible focus treatment.
- Hover behavior is mirrored by keyboard focus.
- Transitions use the deck's 250–300ms opacity language and respect reduced motion.

## Verification

- Component tests cover phase fading/reveal and metric tab switching.
- Existing presentation tests, full Jest suite, and production build remain green.
