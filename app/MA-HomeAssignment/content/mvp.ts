export const SCOPE_IN = [
  'Entry point within the Cards Center, with an event countdown.',
  'Target one missing Card at a time.',
  'Meter goal scales with the target Card’s star rating.',
  'Buying Chests advances the meter; higher-value Chests contribute more.',
  'Changing the target resets the meter.',
  'If the target is obtained before the meter is filled, the player can change target.',
  'Reaching the meter goal awards the target, and ends the event for that player.',
  'Uncompleted progress expires when the event ends.',
] as const

export const SCOPE_OUT = [
  'Targeting Gold, Diamond or Seasonal Cards.',
  'Milestone rewards before the target Card.',
  'New Chest types or changes to existing Chest prices, contents or drop rates.',
  'Event-specific purchase bundles.',
  'Gameplay outside the existing Chest-opening flow.',
] as const
