// app/HA-DrawingAnalyzer/sections/useCaseData.ts
// Content for the three use-case blocks. Edit copy here without touching layout.
// Use Cases 2 & 3 are placeholders (TODO) following the same structure.

import type { UseCaseData } from './UseCase'

export const USE_CASE_1: UseCaseData = {
  id:      'use-case-1',
  eyebrow: 'Use Case 1',
  title:   'Change Validation\n("Drawing Pull Requests")',

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
    intro: 'Designers frequently introduce unintended changes while modifying complex drawings.',
    consequences: [
      'Reviewers spend time identifying changes rather than evaluating design decisions',
      'Additional review cycles are required when unintended changes are discovered late',
      'Designers receive feedback after they have already switched context to other work',
    ],
  },

  currentWorkflow: {
    stat: 'Repeated review cycles',
    steps: [
      { label: 'Designer modifies drawing' },
      { label: 'Uploads drawing', note: 'New version created' },
      { label: 'Designer manually compares drawings', note: 'Mistake not caught' },
      { label: 'Designer submits for review', emphasis: true },
      { label: 'Reviewer identifies unintended changes', kind: 'catch', actor: 'reviewer', note: 'Caught late — at human review' },
      { label: 'Review sent back to initiator', kind: 'reject' },
      { label: 'Designer modifies drawing' },
      { label: 'Uploads drawing', note: 'New version created' },
      { label: 'Designer submits for review again', kind: 'repeat', note: 'Second review round' },
      { label: 'Review approved', kind: 'approve', actor: 'reviewer', note: 'Two rounds review' },
    ],
  },
  proposedWorkflow: {
    stat: 'First-pass approval',
    steps: [
      { label: 'Designer modifies drawing' },
      { label: 'Uploads drawing' },
      { label: 'Change Validation Review', kind: 'ai', note: 'Preview + Description' },
      { label: 'Designer catches unintended changes', kind: 'catch', emphasis: false, note: 'Caught early — before review\nNo new version created' },
      { label: 'Designer modifies drawing' },
      { label: 'Uploads drawing' },
      { label: 'Change Validation Review', kind: 'ai', note: 'Preview + Description' },
      { label: 'Designer submits for review', emphasis: true },
      { label: 'Review approved', kind: 'approve', actor: 'reviewer', note: 'Single review pass\nNew version created' },
    ],
  },

  opportunity: {
    image: '/drawinganalyzer/use-case-1.png',
    statement:
      'Generate reviewable change sets that can be validated and documented before entering the formal approval process. This creates a reusable change-intelligence capability for design reviews, coordination workflows, and project documentation.',
  },

  value: [
    {
      primary: true,
      title: 'Fewer Review Cycles',
      body: 'Catch unintended changes before submission, reducing rejected revisions and resubmissions.',
    },
    {
      title: 'Faster Approvals',
      body: 'Higher-quality revisions reach reviewers, increasing first-pass approval rates.',
    },
    {
      title: 'Reduced Reviewer Effort',
      body: 'Reviewers spend less time finding differences and more time evaluating design decisions.',
    },
    {
      title: 'Structured Change History',
      body: 'Every revision generates a searchable record of what changed and why.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'False Confidence',
      body: 'Designers may assume the change set is complete and overlook modifications that were not detected by the AI.',
    },
    {
      title: 'Change Noise',
      body: 'Cosmetic or low-value modifications may generate unnecessary alerts, making it harder to identify meaningful design changes.',
    },
    {
      title: 'Workflow Friction',
      body: 'The validation step is introduced into every revision submission. If users perceive the review as slow, noisy, or low-value, it may become an annoyance rather than a productivity aid.',
    },
  ],

  tradeoff: { gain: 'Fewer review cycles', cost: 'Added submission step' },
}

export const USE_CASE_2: UseCaseData = {
  id:      'use-case-2',
  eyebrow: 'Use Case 2',
  title:   'RFI Context Link',

  constructionPhase: {
    name: 'Construction',
    description:
      'Field teams encounter issues that require clarification and resolution to maintain project progress.',
  },

  primaryUser: {
    pill: 'Field user',
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
      { label: 'Issue identified onsite' },
      { label: 'Open Forma mobile' },
      { label: 'Describe issue using text or voice' },
      { label: '(Optional) Attach photo and files' },
      { label: 'Submit RFI', emphasis: true },
      { label: 'Designer investigates issue', actor: 'designer', emphasis: true, note: 'Attempts to reconstruct context' },
      { label: 'Designer requests clarification', kind: 'catch', actor: 'designer', note: 'Incomplete context' },
      { label: 'RFI cycle restarts', kind: 'repeat' },
    ],
  },
  proposedWorkflow: {
    stat: 'First-pass resolution',
    steps: [
      { label: 'Issue identified onsite' },
      { label: 'Open Forma mobile' },
      { label: 'Describe issue using text or voice' },
      { label: 'Context Link suggests context', kind: 'ai', note: 'Room • Object • Sheet • Schedule • Specification' },
      { label: 'User confirms context' },
      { label: 'Submit RFI', emphasis: true },
      { label: 'RFI answered without clarification cycle', kind: 'approve', actor: 'designer', note: 'No clarification required' },
    ],
  },

  opportunity: {
    image: '/drawinganalyzer/use-case-2.png',
    imageAside: true,
    statement:
      'Automatically connect RFIs to the relevant drawings, objects, schedules, specifications, and locations. This creates a reusable context-linking capability that can support punch items and issue management workflows.',
  },

  value: [
    {
      primary: true,
      title: 'Improved Field Productivity',
      body: 'Field teams spend less time gathering, reconstructing, and communicating project context when creating RFIs.',
    },
    {
      title: 'Reduced RFI Cycle Time',
      body: 'Context-rich RFIs reduce the need for clarification and accelerate resolution.',
    },
    {
      title: 'Reduced Designer Investigation Effort',
      body: 'Designers spend less time determining which room, object, drawing, or specification the issue refers to.',
    },
    {
      title: 'Better Project Records',
      body: 'RFIs become automatically linked to rooms, objects, drawings, schedules, and specifications.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Incorrect Context Association',
      body: 'The system may link an issue to the wrong room, object, drawing, or specification, creating confusion and sending designers down the wrong investigation path.',
    },
    {
      title: 'Natural Language Ambiguity',
      body: 'Issue descriptions may be too vague to reliably identify a single object or location, resulting in multiple possible matches.',
    },
    {
      title: 'False Confidence',
      body: 'Field users may accept AI-suggested context without verifying it, increasing the risk of inaccurate RFIs.',
    },
    {
      title: 'Workflow Noise',
      body: 'If the system frequently surfaces low-confidence or irrelevant suggestions, users may begin ignoring the generated context altogether.',
    },
  ],

  tradeoff: { gain: 'Faster RFI cycle', cost: 'Context needs verification' },
}

export const USE_CASE_3: UseCaseData = {
  id:      'use-case-3',
  eyebrow: 'Use Case 3',
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
    pill: 'Design leads',
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

  currentWorkflow: {
    stat: 'Conflicts resurface late',
    steps: [
      { label: 'Coordinator selects discipline drawings' },
      { label: 'Manually compares related sheets' },
      { label: 'Identifies potential cross-discipline conflicts' },
      { label: 'Discusses issue in coordination meeting' },
      { label: 'Teams agree on resolution' },
      { label: 'Resolution tracked manually' },
      { label: 'Related elements change later' },
      { label: 'No automatic notification' },
      { label: 'Conflict may be rediscovered late', kind: 'catch', note: 'Caught late — in the field' },
    ],
  },
  proposedWorkflow: {
    stat: 'Conflicts caught early',
    steps: [
      { label: 'Coordinator selects discipline drawings' },
      { label: 'AI identifies cross-discipline relationships', kind: 'ai' },
      { label: 'Coordinator reviews suggestions' },
      { label: 'Coordination Lock created', emphasis: true, note: 'Persistent dependency' },
      { label: 'Related object changes later' },
      { label: 'Linked elements automatically flagged', kind: 'catch', note: 'Impact detected' },
      { label: 'Cross-discipline conflict caught early', kind: 'approve', note: 'Before construction' },
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
      body: 'Previously coordinated elements are automatically flagged when related objects change.',
    },
    {
      title: 'Persistent Coordination History',
      body: 'Coordination decisions become durable project knowledge rather than disappearing into meetings and email threads.',
    },
    {
      title: 'Better Change Impact Awareness',
      body: 'Teams understand when a modification affects previously coordinated work.',
    },
    {
      title: 'Reduced Coordination Effort',
      body: 'Coordinators spend less time manually rechecking relationships across discipline drawings.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Relationship Ambiguity',
      body: 'Some cross-discipline relationships may be difficult to infer confidently, creating review overhead and reducing trust in the suggested dependencies.',
    },
    {
      title: 'Over-Constraining Future Changes',
      body: 'Persistent coordination dependencies may continue surfacing review requirements even when the original relationship is no longer relevant, creating unnecessary friction.',
    },
    {
      title: 'Coordination Noise',
      body: 'If too many dependencies generate review alerts, teams may begin ignoring coordination flags altogether.',
    },
    {
      title: 'Process Overhead',
      body: 'Creating and maintaining coordination dependencies introduces additional work for coordinators. The workflow must provide enough value to justify that investment.',
    },
  ],

  tradeoff: { gain: 'Coordination awareness', cost: 'Maintenance overhead' },
}

export const USE_CASE_4: UseCaseData = {
  id:      'use-case-4',
  eyebrow: 'Use Case 4',
  title:   'Program Conformance Review',

  constructionPhase: {
    name: 'Project Conception, Design & Planning / Pre-Construction',
    description:
      'Design submissions are reviewed against owner-defined requirements and standards before approval.',
  },

  primaryUser: {
    pill: 'Owner',
    role: 'Developer / Standards Lead / Program Manager',
    description: 'Validates submitted designs against organizational requirements, standards, and project programs.',
  },
  secondaryUser: {
    pill: 'Designer',
    role: 'Architect',
    description: 'Designs against program requirements and may perform self-validation before submission.',
  },

  problem: {
    intro: 'Validating that submitted designs conform to owner-defined requirements and standards is largely a manual review process. Requirements such as room counts, areas, adjacencies, equipment, accessibility, and design standards often require manual verification.',
    consequences: [
      'Reviewers spend time verifying objective criteria rather than evaluating design quality and intent',
      'Standards are applied inconsistently across reviewers and projects',
      'Design deviations are often discovered late, increasing review cycles and rework',
      'Standards teams become bottlenecks as project volume grows',
    ],
  },

  opportunity: {
    image: '/drawinganalyzer/use-case-4.png',
    statement:
      'Automatically validate submitted designs against owner-defined program requirements and standards.',
    outro: 'This creates a reusable foundation for standards enforcement and prototype validation across projects.',
  },

  currentWorkflow: {
    stat: 'Inconsistent manual review',
    steps: [
      { label: 'Owner defines program brief' },
      { label: 'Architect submits design' },
      { label: 'Owner manually validates requirements', actor: 'owner' },
      { label: 'Objective criteria verified manually', actor: 'owner', emphasis: true, note: 'Manual validation creates bottlenecks' },
      { label: 'Owner checks design quality and intent', actor: 'owner', emphasis: true },
      { label: 'Standards applied inconsistently', emphasis: true },
      { label: 'Review quality depends on reviewer expertise', emphasis: true },
    ],
  },
  proposedWorkflow: {
    stat: 'Faster, consistent reviews',
    steps: [
      { label: 'Owner defines structured program criteria' },
      { label: 'Architect submits design' },
      { label: 'Program Conformance Review generated', kind: 'ai', note: 'Rooms, Areas, Adjacencies, Equipment' },
      { label: 'Owner focuses on design quality and intent', actor: 'owner', emphasis: true },
      { label: 'Consistent standards enforcement', kind: 'approve', note: 'Scalable review process' },
    ],
  },

  value: [
    {
      primary: true,
      title: 'Consistent Standards Enforcement',
      body: 'Every design is evaluated against the same criteria, reducing reviewer variance and standards drift across projects.',
    },
    {
      title: 'Faster Reviews',
      body: 'Objective criteria are evaluated automatically, allowing reviewers to focus on higher-value decisions.',
    },
    {
      title: 'Earlier Feedback',
      body: 'Architects can identify deviations before formal review, reducing downstream rework.',
    },
    {
      title: 'Scalable Review Process',
      body: 'Organizations can review more projects without proportionally increasing standards-review effort.',
    },
  ],

  tradeoffs: [
    {
      primary: true,
      title: 'Structured Criteria Adoption',
      body: 'Organizations must invest effort upfront to translate program requirements into structured, reviewable criteria before automated validation can provide value.',
    },
    {
      title: 'False Confidence / Criteria Coverage',
      body: 'Reviewers may assume the system evaluated the entire program, even when some requirements are subjective, ambiguous, or outside the system’s scope.',
    },
    {
      title: 'Standards Rigidity',
      body: 'Over-reliance on automated conformance checks may discourage legitimate design variation and reduce flexibility where deviations are intentional or context-specific.',
    },
    {
      title: 'Rule Quality',
      body: 'Poorly defined, outdated, or overly granular criteria may generate low-value findings and reduce trust in the review output.',
    },
  ],

  tradeoff: { gain: 'Consistent standards', cost: 'Flexibility & setup effort' },
}
