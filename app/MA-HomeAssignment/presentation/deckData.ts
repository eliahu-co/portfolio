import { ASSUMPTIONS } from '@/app/MA-HomeAssignment/content/assumptions'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import { SCORE_ROWS, type ScoreRow } from '@/app/MA-HomeAssignment/content/prioritization'
import type { TitledItem, Workflow } from '@/app/MA-HomeAssignment/sections/UseCase'
import {
  USE_CASE_1,
  USE_CASE_2,
  USE_CASE_3,
} from '@/app/MA-HomeAssignment/sections/useCaseData'

export type RevealRationale = {
  readonly label: string
  readonly detail: string
}

export type PresentationConcept = {
  readonly id: string
  readonly title: string
  readonly mockup: string
  readonly strategy: string
  readonly loop: Workflow
  readonly values: TitledItem[]
  readonly risks: TitledItem[]
  readonly thesis: string
  readonly arpdauPath: string
  readonly monetizationSummary: string
  readonly loopImplications: readonly string[]
  readonly reveals: readonly RevealRationale[]
}

/**
 * Presentation concepts deliberately select only the assignment's game-facing
 * fields. The legacy schema also contains unused AEC workflow fields; keeping
 * those out of this shape prevents presentation components from reaching them.
 */
export const CONCEPTS = [
  {
    id: USE_CASE_1.id,
    title: USE_CASE_1.title,
    mockup: USE_CASE_1.mockup!,
    strategy: USE_CASE_1.monetizationStrategy!,
    loop: USE_CASE_1.currentWorkflow,
    values: USE_CASE_1.value,
    risks: USE_CASE_1.tradeoffs,
    thesis: 'Turn Village progress into a permanent space players can own, customize, and show.',
    arpdauPath: 'New spend surface',
    monetizationSummary: 'Create a persistent Coin spend surface tied to expression, status, and Village progress.',
    loopImplications: [
      'Village completion supplies recognizable items and keeps Hometown connected to progression.',
      'Unlocks turn existing progress into a growing customization inventory.',
      'Construction creates a repeatable Coin spend surface outside the next Village upgrade.',
      'The discount returns value to Village progression and reduces the feeling of paying twice.',
    ],
    reveals: [
      {
        label: 'Progression',
        detail: 'Completed Village items become lasting proof of progress instead of disappearing after advancement.',
      },
      {
        label: 'Customization',
        detail: 'A familiar five-slot space combines unlocked backdrops and item variants into personal expression.',
      },
      {
        label: 'Friend visits',
        detail: 'Visits gain a purpose through visible status, daily Gifts, reactions, and snapshots.',
      },
    ],
  },
  {
    id: USE_CASE_2.id,
    title: USE_CASE_2.title,
    mockup: USE_CASE_2.mockup!,
    strategy: USE_CASE_2.monetizationStrategy!,
    loop: USE_CASE_2.currentWorkflow,
    values: USE_CASE_2.value,
    risks: USE_CASE_2.tradeoffs,
    thesis: 'Turn every Chest into visible progress toward the missing Card a player chooses.',
    arpdauPath: 'Increased resource demand',
    monetizationSummary: 'Increase Coin demand by making repeated Chest purchases advance a chosen guarantee.',
    loopImplications: [
      'Regular Spins keep the event supplied by the familiar core economy.',
      'Target selection concentrates existing near-completion intent on one meaningful Card.',
      'Every Chest converts Coin consumption into visible progress instead of pure chance.',
      'The guarantee closes the loop with a predictable result the player selected.',
      'Collection rewards return Spins to the core loop and create another reason to repeat it.',
    ],
    reveals: [
      {
        label: 'Choose a target',
        detail: 'Players select one eligible missing Card from a Collection, turning broad desire into a specific goal.',
      },
      {
        label: 'Advance the meter',
        detail: 'Coin-purchased Chests add progress, with higher-value Chests contributing more.',
      },
      {
        label: 'Guarantee the Card',
        detail: 'Filling the meter grants the chosen target and makes repeated Chest opening feel cumulative.',
      },
    ],
  },
  {
    id: USE_CASE_3.id,
    title: USE_CASE_3.title,
    mockup: USE_CASE_3.mockup!,
    strategy: USE_CASE_3.monetizationStrategy!,
    loop: USE_CASE_3.currentWorkflow,
    values: USE_CASE_3.value,
    risks: USE_CASE_3.tradeoffs,
    thesis: 'Turn the frustration of a Raid into an urgent reason to return, Spin, and retaliate.',
    arpdauPath: 'Purchase frequency through re-engagement',
    monetizationSummary: 'Create an additional return session and more exposure to existing Spin offers.',
    loopImplications: [
      'Village progression creates the Coin balance and PvP exposure that make a Raid meaningful.',
      'The loss creates an emotionally salient trigger without adding a new entry behavior.',
      'A short activation window converts that trigger into urgency to return.',
      'Regular Spins preserve the existing core-loop path to the Counter-Raid.',
      'Capped recovery provides revenge and closure while limiting economy inflation.',
    ],
    reveals: [
      {
        label: 'One-hour activation',
        detail: 'A recently Raided player has one hour to activate Hot Trail.',
      },
      {
        label: 'Six-hour target',
        detail: 'The raider becomes the next Raid target for six hours after activation.',
      },
      {
        label: 'Capped recovery',
        detail: 'The Counter-Raid adds a capped recovery based on the original loss to the standard Raid reward.',
      },
      {
        label: 'Anti-loop limits',
        detail: 'Only one trail can be active, and a Counter-Raid cannot trigger another trail.',
      },
    ],
  },
] as const satisfies readonly PresentationConcept[]

export type ApproachStep = {
  readonly label: string
  readonly annotation: string
  readonly output: string
}

export const APPROACH_STEPS = [
  {
    label: 'Play',
    annotation: 'Experience the first-time and returning-player loops directly.',
    output: 'A grounded view of moment-to-moment motivation and friction.',
  },
  {
    label: 'Map',
    annotation: 'Trace how Spins, Coins, Villages, Chests, Collections, LiveOps, Social, and PvP exchange value.',
    output: 'Three credible paths to ARPDAU rather than isolated feature ideas.',
  },
  {
    label: 'Research',
    annotation: 'Study the goals and constraints that emerge after the introductory loop.',
    output: 'Concepts aimed at progression, near-completion intent, and return behavior.',
  },
  {
    label: 'Benchmark',
    annotation: 'Use category patterns to challenge mechanics and identify familiar interaction models.',
    output: 'Reference points for ownership, guarantees, and loss-driven re-engagement.',
  },
  {
    label: 'Create',
    annotation: 'Explore distinct spend, resource-demand, and re-engagement mechanisms.',
    output: 'Hometown, Card Bounty, and Hot Trail as three different economic bets.',
  },
  {
    label: 'Decide',
    annotation: 'Compare opportunity, loop fit, confidence, and effort under explicit assumptions.',
    output: 'A bounded recommendation with explicit trade-offs.',
  },
  {
    label: 'Test',
    annotation: 'Define the MVP, experiment design, success criteria, and guardrails.',
    output: 'A measurable validation plan for the recommended feature.',
  },
] as const satisfies readonly ApproachStep[]

export type AssumptionStory = {
  readonly assumption: (typeof ASSUMPTIONS)[number]
  readonly consequence: string
}

export const ASSUMPTION_STORIES = [
  {
    assumption: ASSUMPTIONS[0],
    consequence: 'Treat engagement and consumption as leading signals, not success unless revenue follows.',
  },
  {
    assumption: ASSUMPTIONS[1],
    consequence: 'Use economy, progression, and post-event guardrails alongside the ARPDAU target.',
  },
  {
    assumption: ASSUMPTIONS[2],
    consequence: 'Favor concepts that reuse familiar actions and feed value back into the core loop.',
  },
  {
    assumption: ASSUMPTIONS[3],
    consequence: 'Frame the recommendation as a segmented, time-limited experiment rather than a universal launch.',
  },
  {
    assumption: ASSUMPTIONS[4],
    consequence: 'Use scores and targets to compare directionally, then calibrate them with internal data.',
  },
] as const satisfies readonly AssumptionStory[]

export type RecommendationEvidence = {
  readonly reason: string
  readonly evidence: string
}

export const RECOMMENDATION = {
  title: 'Recommend Card Bounty',
  evidence: [
    {
      reason: 'Familiar behavior',
      evidence: 'It extends the existing Chest and Collection loop around a goal players already understand.',
    },
    {
      reason: 'Additional Coin demand',
      evidence: 'Each Chest purchase advances a chosen guarantee, connecting visible progress to Coin consumption.',
    },
    {
      reason: 'Bounded validation',
      evidence: 'A time-limited LiveOps event can test adoption, incremental spend, and economy effects before expansion.',
    },
  ],
  risk: {
    reason: 'Guarantee and economy risk',
    evidence: 'The guarantee could accelerate Collections or shift existing Chest spend instead of increasing it.',
    mitigation: 'Calibrate the meter and monitor Collection completion, Village progression, and post-event spend.',
  },
} as const satisfies {
  readonly title: string
  readonly evidence: readonly RecommendationEvidence[]
  readonly risk: RecommendationEvidence & { readonly mitigation: string }
}

export type ScoreStory = {
  readonly row: ScoreRow
  readonly rationales: readonly [string, string, string, string]
}

export const SCORE_STORIES = [
  {
    row: SCORE_ROWS[0],
    rationales: [
      'Directly increases demand for Coins and Chests, with a clear path to existing offers.',
      'Reinforces the established Spins, Coins, Chests, Collections, and reward loop.',
      'Near-completion intent is clear, while incremental spend and guarantee balance still need testing.',
      'A bounded LiveOps extension still requires meter tuning, eligibility rules, and economy safeguards.',
    ],
  },
  {
    row: SCORE_ROWS[1],
    rationales: [
      'Adds return sessions and offer exposure, but monetization is less direct than resource demand.',
      'Uses existing Raids, Spins, targeting, and rewards as the full interaction path.',
      'Loss and revenge are strong triggers, with meaningful frustration and retaliation uncertainty.',
      'Timers, targeting, recovery rules, and anti-loop limits add moderate product and balance work.',
    ],
  },
  {
    row: SCORE_ROWS[2],
    rationales: [
      'Creates a new Coin spend surface with longer-term customization and content upside.',
      'Connects to Villages and Coins but asks players to adopt a new persistent-space behavior.',
      'Expression and status are credible, while customization demand depends on a meaningful audience.',
      'A persistent space, content variants, social visits, and economy integration make this the largest build.',
    ],
  },
] as const satisfies readonly ScoreStory[]

export type FlowStory = {
  readonly label: string
  readonly branchNote: string
}

export const PLAYER_FLOW = [
  {
    label: 'Entry',
    branchNote: 'Only eligible players enter from the Cards Center while the LiveOps event is active.',
  },
  {
    label: 'Target selection',
    branchNote: 'The player chooses one eligible missing Card; changing target resets current meter progress.',
  },
  {
    label: 'Progress',
    branchNote: 'Coin-purchased Chests advance the meter, with contribution weighted by Chest value.',
  },
  {
    label: 'Chest results',
    branchNote: 'A Chest can contain the target naturally before the guarantee is reached.',
  },
  {
    label: 'Target / meter decision',
    branchNote: 'A natural target drop allows a new target; a full meter awards the selected Card and ends the event.',
  },
  {
    label: 'Collection update',
    branchNote: 'The awarded Card advances its Collection, and completed Collections return Spins to the loop.',
  },
] as const satisfies readonly FlowStory[]

export type ScopeStory = {
  readonly requirement: string
  readonly rationale: string
}

const SCOPE_IN_RATIONALES = [
  'Makes event availability and urgency clear without adding a new destination.',
  'Keeps player intent and the guarantee easy to understand.',
  'Creates a balance lever tied to Card value.',
  'Connects progress directly to the existing Chest economy.',
  'Prevents target switching from becoming free progress optimization.',
  'Avoids punishing a natural target drop with a dead-end state.',
  'Provides a clear completion state and bounded reward release.',
  'Preserves LiveOps urgency and prevents permanent stored progress.',
] as const

const SCOPE_OUT_RATIONALES = [
  'Protects scarce Card categories until the base guarantee is understood.',
  'Isolates the value of the target guarantee from extra milestone rewards.',
  'Tests demand without changing the underlying Chest system.',
  'Separates incremental resource demand from a new offer-design variable.',
  'Keeps the MVP inside a familiar, measurable Chest-opening flow.',
] as const

export const SCOPE_STORIES = {
  in: SCOPE_IN.map((requirement, index) => ({
    requirement,
    rationale: SCOPE_IN_RATIONALES[index],
  })),
  out: SCOPE_OUT.map((requirement, index) => ({
    requirement,
    rationale: SCOPE_OUT_RATIONALES[index],
  })),
} as const satisfies {
  readonly in: readonly ScopeStory[]
  readonly out: readonly ScopeStory[]
}

export type ClosingGroup = {
  readonly label: string
  readonly slide: 3 | 4 | 8 | 9 | 12
}

export const CLOSING_GROUPS = [
  { label: 'Approach', slide: 3 },
  { label: 'Concepts', slide: 4 },
  { label: 'Decision', slide: 8 },
  { label: 'Deep dive', slide: 9 },
  { label: 'Validation', slide: 12 },
] as const satisfies readonly ClosingGroup[]
