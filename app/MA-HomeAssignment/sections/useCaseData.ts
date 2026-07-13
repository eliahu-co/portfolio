// app/MA-HomeAssignment/sections/useCaseData.ts
// Content for the three feature blocks. Edit copy here without touching layout.

import type { UseCaseData } from './UseCase'

export const USE_CASE_1: UseCaseData = {
  id:      'feature-1',
  eyebrow: 'Feature 1',
  title:   'Hometown',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature1.png',

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
    intro: 'Villages show progression, but not ownership: every player builds the same five items and leaves them behind. Hometown turns completed Village items into a permanent, personal display and gives friend visits a purpose.',
    body: 'Players use the familiar five-slot layout to mix items unlocked from completed Villages. The first item in each slot is free. Constructing another item costs Coins, but once built it remains available for free rearrangement. Each paid construction grants a small, time-limited, non-stackable discount on the next Village upgrade. Backdrops and animated variants are unlocked through progression, LiveOps or purchase.',
    body2: 'Friends can visit, see the player’s Stars, current Village and Team, send the existing daily Gift, and leave a reaction. Visitors can also inspect displayed items to see where they were unlocked or access an available premium variant.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Self-reinforcing loop',
    loop: true,
    steps: [
      { label: 'Complete Villages', coreLoop: true },
      { label: 'Unlock Hometown items' },
      { label: 'Spend Coins to construct new Hometown items' },
      { label: 'Receive a discount on the next Village upgrade' },
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
      'A permanent, customizable town built from items the player has unlocked across Coin Master’s Villages.',
  },

  value: [
    {
      title: 'Expression and Ownership',
      body: 'A permanent space that feels personal.',
    },
    {
      title: 'Lasting Progression',
      body: 'Completed Village items remain useful after the player advances.',
    },
    {
      title: 'Social Value',
      body: 'Visits, reactions, and shareable snapshots give customization an audience.',
    },
    {
      primary: true,
      title: 'Business Value',
      body: 'A new Coin sink and a new cosmetic spend surface.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Core Cannibalization',
      body: 'Players may redirect existing Coins from Village progression instead of purchasing more Spins.',
    },
    {
      title: 'Paying Twice',
      body: 'Players may feel charged again for items they already completed.',
    },
    {
      title: 'Weak Cosmetic Demand',
      body: 'Customization has limited value without an audience.',
    },
  ],
}

export const USE_CASE_2: UseCaseData = {
  id:      'feature-2',
  eyebrow: 'Feature 2',
  title:   'Card Bounty',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature2.png',

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
    intro: 'Card Collections create high intent near completion, but little control: players may keep opening Chests without finding the Card they need. Card Bounty turns that uncertainty into visible progress.',
    body: 'During the event, players choose any eligible missing Card. Each Chest open increases its drop chance and fills a visible meter; higher-value Chests add more progress, and rarer Cards require more. Completing the meter guarantees the target. If the target drops from a Chest, the Bounty completes immediately.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Guaranteed target Card',
    loop: true,
    steps: [
      { label: 'Use Spins to earn Coins', coreLoop: true },
      { label: 'Identify a Card Collection to complete for Spin rewards' },
      { label: 'Choose a missing Card from that Collection' },
      { label: 'Spend Coins to open Chests' },
      { label: 'Increase the Card’s drop chance and fill the Bounty meter' },
      { label: 'Claim the Card and progress the Collection' },
      { label: 'Complete the Collection and receive Spins' },
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
      primary: true,
      title: 'Business Value',
      body: 'A high-intent Coin sink that increases demand for Chests, Spins, and related offers.',
    },
    {
      title: 'Player Agency',
      body: 'Players choose the Card they value instead of relying only on random drops.',
    },
    {
      title: 'Visible Progress',
      body: 'Every Chest moves the player closer to a guaranteed result.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'System Cannibalization',
      body: 'Targeted Cards may reduce the value of Joker Cards, trading, and Cards for Chests.',
    },
    {
      title: 'Collection Inflation',
      body: 'Guaranteed rare Cards may shorten Collection completion and release rewards faster than intended.',
    },
    {
      title: 'Spend Shifting',
      body: 'Players may save Coins and Chest openings for Bounty windows instead of increasing total spend.',
    },
  ],
}

export const USE_CASE_3: UseCaseData = {
  id:      'feature-3',
  eyebrow: 'Feature 3',
  title:   'Hot Trail',
  conceptAsSubtitle: true,
  mockup:  '/coinmaster/feature3.png',

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
    intro: 'When a player is Raided, Hot Trail gives them one hour to return and track the raider. Activating the trail locks that player as the target of their next Raid for six hours. The Raid is triggered through normal Spins and uses the existing digging flow.',
    body: 'Success grants the standard Raid reward plus a capped recovery bonus based on the original loss. Only one trail can be active, and counter-Raids cannot trigger another trail. This creates an additional session and Spin consumption without adding a new game mode.',
    consequences: [],
  },

  currentWorkflow: {
    stat: 'Loss-to-return loop',
    loop: true,
    steps: [
      { label: 'Use Coins to progress the Village', coreLoop: true },
      { label: 'Get Raided and lose Coins' },
      { label: 'Return within one hour to activate Hot Trail' },
      { label: 'Use Spins within six hours to trigger a Raid' },
      { label: 'Counter-Raid the raider and recover part of the loss' },
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
      primary: true,
      title: 'Urgent Return Trigger',
      body: 'Turns a completed Raid into a time-limited reason to reopen the game.',
    },
    {
      title: 'More Spin Consumption',
      body: 'Reaching the Counter-Raid requires returning to the Spinner and landing a Raid, increasing session depth and exposure to existing offers.',
    },
    {
      title: 'Agency After Loss',
      body: 'Gives the raided player a direct response instead of leaving the loss as a passive notification.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Retaliation Loops',
      body: 'Counter-Raids could generate repeated retaliation between the same players.',
    },
    {
      title: 'Failed Urgency',
      body: 'Players may return and spend Spins without landing a Raid before the timer expires.',
    },
    {
      title: 'Economy Distortion',
      body: 'Recovered Coins could create inflation or reduce the need to earn more through the core loop.',
    },
  ],
}
