// app/MA-HomeAssignment/sections/useCaseData.ts
// Content for the three feature blocks. Edit copy here without touching layout.

import type { UseCaseData } from './UseCase'

export const USE_CASE_1: UseCaseData = {
  id:      'feature-1',
  eyebrow: 'Feature 1',
  title:   'Hometown',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature1.png',
  monetizationStrategy: 'New spend surface.\nTargets high-progression, socially engaged players.',
  metrics: {
    primary: 'ARPDAU',
    supporting: [
      'Coin spend on Hometown per DAU',
      'Repeat customization',
      'Return sessions per Hometown user',
    ],
  },

  constructionPhase: {
    name: 'Project Conception, Design & Planning / Building Permits',
    description:
      'Frequent drawing revisions and review cycles across evolving project documentation.',
  },

  primaryUser: {
    pill: 'Designer',
    role: 'Architect / Structural Engineer / MEP Designer',
    description: 'Creates and submits drawing revisions.',
  },
  secondaryUser: {
    pill: 'Reviewer',
    role: 'Senior Architect / Discipline Lead',
    description: 'Approves drawing revisions and ensures design quality.',
  },

  problem: {
    heading: 'Concept',
    intro: 'Friend visits currently display the friend’s active Village and offer no interaction. Villages show progression, not ownership: completed items disappear once the player advances.',
    body: 'Hometown gives them lasting utility through a familiar five-slot space that they can customize and gives friend visits a purpose. Building items costs Coins and rewards with a discount on the next Village build. Backdrops and item variants are unlocked through progression, LiveOps or purchase. Visitors can see the player’s Stars, Village level and Team, send the daily Gift and leave a reaction.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Self-reinforcing loop',
    loop: true,
    steps: [
      { label: 'Complete Villages', coreLoop: true, resourceDelta: { resource: 'coin', direction: 'spend' } },
      { label: 'Unlock Hometown items' },
      { label: 'Build new Items', resourceDelta: { resource: 'coin', direction: 'spend' } },
      { label: 'Get Village build discount!', resourceDelta: { resource: 'coin', direction: 'gain' } },
    ],
  },
  proposedWorkflow: {
    stat: 'First-pass approval',
    steps: [
      { label: 'Uploads modified drawing' },
      { label: 'Submits for review' },
      { label: 'Change Validation', kind: 'ai', note: 'Compares to current approved version' },
      { label: 'Catches unintended changes', kind: 'catch', emphasis: false, note: 'Cancels submission for correction' },
      { label: 'Uploads modified drawing' },
      { label: 'Submits for review' },
      { label: 'Change Validation', kind: 'ai', note: 'Compares to current approved version' },
      { label: 'Review approved', kind: 'approve', actor: 'reviewer', note: 'First-pass approval' },
    ],
  },

  opportunity: {
    statement:
      'A customizable town built from items the player has unlocked across Villages.',
  },

  value: [
    {
      title: 'Expression and Ownership',
      body: 'A permanent space that feels personal.',
    },
    {
      title: 'Progress and Status',
      body: 'High-level Village items become proof of progress.',
    },
    {
      title: 'Social Recognition',
      body: 'Visits, reactions and snapshots create an audience.',
    },
  ],

  tradeoffs: [
    {
      title: 'Core Cannibalization',
      body: 'May slow Village progression.',
    },
    {
      title: 'Paying Twice',
      body: 'Charging for Village built items may feel unfair.',
    },
    {
      title: 'Weak Customization Demand',
      body: 'Customization value depends on audience.',
    },
  ],
}

export const USE_CASE_2: UseCaseData = {
  id:      'feature-2',
  eyebrow: 'Feature 2',
  title:   'Card Bounty',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature2.png',
  monetizationStrategy: 'Resource demand. Targets players close to completing a Card Collection increasing Coin consumption and demand for existing offers.',
  metrics: {
    primary: 'ARPDAU',
    supporting: [
      'ARPPU by payer tier',
      'Coin Spend on Chests per DAU',
      'Bounty activation',
    ],
  },

  constructionPhase: {
    name: 'Construction',
    description:
      'Questions, discrepancies, and unforeseen conditions frequently surface at the construction site and require clarification before work can proceed.',
  },

  primaryUser: {
    pill: 'Field team',
    role: 'Superintendent / Foreman / Field Engineer',
    description: 'Identifies field issues and creates RFIs, often from a mobile device in time-constrained conditions.',
  },
  secondaryUser: [
    {
      pill: 'Designer',
      role: 'Architect / Structural Engineer / MEP Designer',
      description: 'Reviews RFIs and resolves design-related questions.',
    },
    {
      pill: 'Project stakeholders',
      role: 'Subcontractors / Project Managers / Owners',
      description: 'Depend on timely RFI resolution to maintain project progress and coordination.',
    },
  ],

  problem: {
    heading: 'Concept',
    intro: 'Card Collections create strong intent near completion, but players cannot influence which Card a Chest contains. Card Bounty turns repeated Chest opening into progress toward a guarantee.',
    body: 'During the event, players select a missing Card from a Collection. Coin-purchased Chests advance the Bounty meter; higher-value Chests add more progress and rarer Cards require more. Filling the meter grants the target.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Guaranteed target Card',
    loop: true,
    steps: [
      { label: 'Spin', coreLoop: true, resourceDelta: { resource: 'spin', direction: 'spend' } },
      { label: 'Target a card' },
      { label: 'Buy Chests - fill the meter', resourceDelta: { resource: 'coin', direction: 'spend' } },
      { label: 'Get the card', resourceDelta: { resource: 'card', direction: 'gain' } },
      { label: 'Complete the Collection', resourceDelta: { resource: 'spin', direction: 'gain' } },
    ],
  },
  proposedWorkflow: {
    stat: 'First-pass resolution',
    steps: [
      { label: 'Identifies issue onsite' },
      { label: 'Initiates RFI' },
      { label: 'Describes issue using text or voice' },
      { label: 'Context Link suggests context', kind: 'ai', note: 'Room • Object • Sheet • Schedule • Specification' },
      { label: 'Confirms context' },
      { label: 'Submits RFI', emphasis: true },
      { label: 'RFI answered', kind: 'approve', actor: 'designer', note: 'No clarification required' },
    ],
  },

  opportunity: {
    statement:
      'A limited LiveOps event that gives players a visible path to a missing Card.',
  },

  value: [
    {
      title: 'Agency',
      body: 'Choose the Card that matters most.',
    },
    {
      title: 'Visible Progress',
      body: 'Every Chest advances toward a guaranteed result.',
    },
  ],

  tradeoffs: [
    {
      title: 'System Cannibalization',
      body: 'Reduced value of Jokers, trading and Cards for Chests.',
    },
    {
      title: 'Collection Acceleration',
      body: 'Collection rewards released faster than intended.',
    },
    {
      title: 'Spend Shifting',
      body: 'Chest spending shifts to the event without increasing total spend.',
    },
  ],
}

export const USE_CASE_3: UseCaseData = {
  id:      'feature-3',
  eyebrow: 'Feature 3',
  title:   'Hot Trail',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature3.png',
  monetizationStrategy: 'Purchase frequency through re-engagement.\nAdditional return sessions increase exposure to existing Spin offers.',
  metrics: {
    primary: 'ARPDAU',
    supporting: [
      'Hot Trail activation',
      'Return rate',
      'Spin consumption per exposed DAU',
    ],
  },

  constructionPhase: {
    name: 'Design Coordination / Pre-Construction',
    description:
      'Different disciplines coordinate design decisions and dependencies before construction begins.',
  },

  primaryUser: {
    pill: 'Coordinator',
    role: 'BIM Coordinator / VDC Lead',
    description: 'Coordinates drawings across disciplines and identifies conflicts before they reach the field.',
  },
  secondaryUser: {
    pill: 'Designer',
    role: 'Architects / Structural Engineers / MEP Engineers',
    description: 'Review and resolve coordination issues identified during the coordination process.',
  },

  problem: {
    heading: 'Concept',
    intro: 'After being Raided, players have one hour to activate Hot Trail. The raider then becomes their next Raid target for six hours. The Counter-Raid is triggered through regular Spins and uses the existing digging flow.',
    body: 'Completing it grants the standard Raid reward plus a capped recovery based on the original loss. Only one trail can be active, and Counter-Raids cannot trigger another trail.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Loss-to-return loop',
    loop: true,
    steps: [
      { label: 'Progress the Village', coreLoop: true, resourceDelta: { resource: 'coin', direction: 'spend' } },
      { label: 'Get Raided', resourceDelta: { resource: 'coin', direction: 'spend' } },
      { label: 'Activate Hot Trail' },
      { label: 'Spin to Raid', resourceDelta: { resource: 'spin', direction: 'spend' } },
      { label: 'Counter-Raid', resourceDelta: { resource: 'coin', direction: 'gain' } },
    ],
  },
  proposedWorkflow: {
    stat: 'Dependencies monitored',
    steps: [
      { label: 'Reviews discipline drawings' },
      { label: 'Coordination Lock suggests relationships', kind: 'ai' },
      { label: 'Confirms relationships' },
      { label: 'Coordination Lock records dependencies', kind: 'ai' },
      { label: 'MEP drawing is updated', actor: 'designer' },
      { label: 'Coordination Lock flags dependency impact', kind: 'ai' },
      { label: 'Resolves coordination issue before construction', kind: 'approve' },
    ],
  },

  opportunity: {
    statement:
      'A time-limited counter-Raid that turns a loss into an urgent reason to return and Spin.',
  },

  value: [
    {
      title: 'Urgency',
      body: 'A limited window creates a reason to return.',
    },
    {
      title: 'Recovery and Revenge',
      body: 'Respond directly to a Raid and recover part of the loss.',
    },
  ],

  tradeoffs: [
    {
      title: 'Retaliation Loops',
      body: 'Repeated Counter-Raids between the same players.',
    },
    {
      title: 'Failed Urgency',
      body: 'Spins consumed without landing a Raid before the timer expires.',
    },
    {
      title: 'Economy Distortion',
      body: 'Recovered Coins inflate the economy or weaken core-loop demand.',
    },
  ],
}
