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
    intro: 'Villages show progression, but not ownership: every player builds the same five items, then leaves them behind. Hometown gives that progress a permanent, personal display.',
    body: 'Using the familiar five-slot Village layout, players can mix items unlocked from completed Villages. The first build in each slot is free; constructing a new item later costs Coins and grants a small, non-stackable discount on the next Village upgrade. Built items remain available for free rearrangement. Players can also customize the setting with backdrops unlocked through Village progression, or purchase. Friends can visit, react, and share the result.',
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
  title:   'RFI Context Link',

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
    intro:
      'Field teams often struggle to provide complete context when creating RFIs. Work is performed at the construction site, often from mobile devices, under time pressure.',
    consequences: [
      'RFIs are submitted with incomplete context, leading to clarification requests and longer resolution cycles',
      'Construction work may be delayed while waiting for answers, particularly when RFIs affect critical-path activities',
      'Teams spend additional time investigating and re-establishing context that could have been captured during RFI creation',
    ],
  },

  currentWorkflow: {
    stat: 'Repeated RFI cycles',
    steps: [
      { label: 'Identifies issue onsite' },
      { label: 'Initiates RFI' },
      { label: 'Describes issue using text or voice' },
      { label: '(Optional) Attaches photo and files' },
      { label: 'Submits RFI', emphasis: true },
      { label: 'Designer investigates issue', actor: 'designer', emphasis: true, note: 'Attempts to reconstruct context' },
      { label: 'Designer requests clarification', kind: 'catch', actor: 'designer', note: 'Incomplete context' },
      { label: 'RFI cycle restarts', kind: 'repeat' },
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
    image: '/drawinganalyzer/use-case-2.png',
    imageAside: true,
    statement:
      'Automatically connect RFIs to the relevant drawings, objects, schedules, specifications, and locations by identifying the project elements referenced in the issue description and linking them to structured drawing data. This capability can later support punch items, observations, and other issue-management workflows.',
  },

  value: [
    {
      primary: true,
      title: 'Improved Field Productivity',
      body: 'Less time waiting for answers and more time progressing work.',
    },
    {
      title: 'Faster Issue Resolution',
      body: 'Reduces clarification cycles and accelerates responses to field issues.',
    },
    {
      title: 'Higher-Quality RFIs',
      body: 'Improves the completeness and consistency of submitted RFIs.',
    },
    {
      title: 'Reduced Investigation Effort',
      body: 'Reduces the effort required to understand and resolve issues.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Incorrect Context Association',
      body: 'Suggested context may be incorrect, leading to confusion and misdirected investigation.',
    },
    {
      title: 'Natural Language Ambiguity',
      body: 'Some issue descriptions may not provide enough information to identify a single, reliable match.',
    },
    {
      title: 'False Confidence',
      body: 'Users may trust generated context without verification, increasing the risk of inaccurate RFIs.',
    },
    {
      title: 'Workflow Noise',
      body: 'Excessive low-confidence suggestions may reduce trust and adoption over time.',
    },
  ],

  tradeoff: { gain: 'Faster issue resolution', cost: 'Occasional incorrect context associations' },
}

export const USE_CASE_3: UseCaseData = {
  id:      'feature-3',
  eyebrow: 'Feature 3',
  title:   'Cross-Discipline Coordination Lock',

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
    intro:
      'Related design decisions across architectural, structural, and MEP drawings are not formally connected. Once coordination issues are resolved, those relationships are rarely maintained as persistent project knowledge.',
    consequences: [
      'Resolved coordination issues can reappear later',
      'Teams rely on memory and manual follow-up',
      'Changes in one discipline may not trigger review in another',
      'Conflicts may reach the field, where they are significantly more expensive to fix',
    ],
  },

  legendAiOnly: true,

  currentWorkflow: {
    stat: 'Dependencies forgotten',
    steps: [
      { label: 'Reviews discipline drawings' },
      { label: 'Identifies relationships between objects' },
      { label: 'Relies on memory to track relationships' },
      { label: 'MEP drawing is updated', actor: 'designer' },
      { label: 'Checks for coordination impacts manually' },
      { label: 'Misses dependency impact', note: 'Forgets relationship' },
      { label: 'Issue is discovered in the field', kind: 'catch' },
      { label: 'High-cost rework', kind: 'reject' },
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
    image: '/drawinganalyzer/use-case-3.png',
    statement:
      'Transform temporary coordination decisions into persistent, traceable dependencies that can be monitored as drawings evolve across disciplines.',
  },

  value: [
    {
      primary: true,
      title: 'Earlier Conflict Detection',
      body: 'Potential coordination issues are surfaced before they reach the field.',
    },
    {
      title: 'Persistent Coordination History',
      body: 'Coordination decisions remain accessible as project knowledge over time.',
    },
    {
      title: 'Better Change Impact Awareness',
      body: 'Improves visibility into how changes affect previously coordinated work.',
    },
    {
      title: 'Reduced Coordination Effort',
      body: 'Less time spent manually reviewing and revalidating coordination decisions.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Relationship Ambiguity',
      body: 'Some dependencies may be difficult to identify reliably, reducing trust in the results.',
    },
    {
      title: 'Over-Constraining Future Changes',
      body: 'Outdated dependencies may continue triggering reviews after they are no longer relevant.',
    },
    {
      title: 'Coordination Noise',
      body: 'Excessive coordination alerts may reduce attention to important issues.',
    },
    {
      title: 'Process Overhead',
      body: 'Maintaining coordination dependencies may require additional effort from project teams.',
    },
  ],

  tradeoff: { gain: 'Persistent dependency tracking', cost: 'Additional coordination setup effort' },
}
