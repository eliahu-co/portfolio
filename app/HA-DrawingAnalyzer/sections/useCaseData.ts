// app/HA-DrawingAnalyzer/sections/useCaseData.ts
// Content for the three use-case blocks. Edit copy here without touching layout.
// Use Cases 2 & 3 are placeholders (TODO) following the same structure.

import type { UseCaseData } from './UseCase'

export const USE_CASE_1: UseCaseData = {
  id:      'use-case-1',
  eyebrow: 'Use Case 1',
  title:   'Change Validation\n("Drawing Pull Requests")',

  constructionPhase: {
    name: 'Project conception, design and planning / Building Permits',
    description:
      'This phase involves frequent revisions across architectural, structural, and MEP drawings, requiring multiple review and approval cycles.',
  },

  primaryUser: {
    pill: 'Designer',
    role: 'Architect / Structural Engineer / MEP Designer',
    description: 'The person creating and submitting drawing revisions.',
  },
  secondaryUser: {
    pill: 'Reviewer',
    role: 'Senior Architect / Discipline Lead',
    description: 'The reviewer responsible for approving revisions and ensuring design quality.',
  },

  problem: {
    intro: 'Designers frequently introduce unintended changes while modifying complex drawings.',
    examples: [
      'Accidentally moving objects',
      'Modifying a room boundary',
      'Removing equipment',
      'Changing dimensions or annotations',
    ],
    consequences: [
      'Reviews become diff-finding exercises instead of design validation',
      'Senior reviewers spend time identifying changes rather than evaluating decisions',
      'Multiple review rounds are required',
      'Designers receive feedback after they have already switched context',
      'Drawing revision disconnected to file version',
    ],
  },

  currentWorkflow: {
    stat: 'Repeated review cycles',
    steps: [
      { label: 'Designer modifies drawing' },
      { label: 'Uploads drawing', note: 'New version created' },
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

  whyAnalyzer: {
    intro: [
      'Traditional document comparison tools compare visual or vector-level differences and often generate excessive noise.',
      'The AI Drawing Analyzer compares the semantic structure of the drawing.',
    ],
    examples: [
      'Moving a room label within the same room does not create a meaningful change',
      'Repositioning views on a sheet without modifying them does not trigger unnecessary alerts',
      'Changes are identified based on geometry, objects, and their relationships rather than visual movement on the sheet',
    ],
    body: [
      'This allows designers to focus on actual design modifications rather than document noise.',
      'In addition, the analyzer can automatically generate a human-readable summary of detected modifications, such as:',
    ],
    quotes: [
      'Added two doors to Corridor A',
      'Room 105 area increased by 8%',
      'Relocated HVAC Unit 12',
    ],
    closing:
      'This transforms drawing revisions from simple file versions into structured change records that can be understood, reviewed, and searched by project stakeholders.',
  },

  value: [
    {
      title: 'Reduced Review Cycles',
      body: 'Issues are identified before reaching formal review, reducing the number of rejected revisions and resubmissions.',
    },
    {
      title: 'Faster Approval Process',
      body: 'Higher-quality revisions are submitted to reviewers, increasing the likelihood of first-pass approval.',
    },
    {
      title: 'Reduced Reviewer Effort',
      body: 'Reviewers spend less time identifying differences and more time evaluating design decisions.',
    },
    {
      title: 'Reduced Context Switching',
      body: 'Designers discover mistakes immediately after making changes rather than days later after receiving review feedback.',
    },
    {
      title: 'Cleaner Version History',
      body: 'Only validated revisions enter the formal review process, reducing version noise and unnecessary document churn.',
    },
    {
      title: 'Structured Change Audit Trail',
      body: 'Each revision automatically generates a machine-readable and human-readable record of what changed. Over time, this creates a searchable history of design decisions that can support:',
      bullets: [
        'Design reviews',
        'Coordination meetings',
        'Compliance documentation',
        'Project handoffs',
        'Root-cause analysis when issues are discovered later in the project lifecycle',
      ],
    },
  ],

  tradeoffs: [
    {
      title: 'Missed Changes',
      body: 'If the AI fails to identify a change, users may gain false confidence in the revision.',
    },
    {
      title: 'Incorrect Classification',
      body: 'The AI may incorrectly classify objects or generate inaccurate descriptions of modifications.',
    },
    {
      title: 'Noise From Low-Value Changes',
      body: 'Formatting, annotations, or sheet-level modifications may generate unnecessary alerts if not properly filtered.',
    },
    {
      title: 'User Trust',
      body: 'The workflow depends on designers trusting the generated change set enough to incorporate it into their review process.',
    },
    {
      title: 'Additional Review Step',
      body: 'The workflow introduces a validation step before submission. If the detected changes are not sufficiently accurate or valuable, users may perceive the process as slowing them down rather than helping them.',
    },
  ],
}

/* ─── placeholders — same structure, swap in real content later ───────────── */

const PLACEHOLDER = (id: string, n: number, title: string): UseCaseData => ({
  id,
  eyebrow: `Use Case ${n}`,
  title,
  constructionPhase: { name: 'TODO: Construction phase', description: 'TODO: Phase description.' },
  primaryUser:   { role: 'TODO: Primary persona', description: 'TODO: What they do.' },
  secondaryUser: { role: 'TODO: Secondary persona', description: 'TODO: What they do.' },
  problem: {
    intro: 'TODO: Describe the core problem.',
    examples: ['TODO: Example', 'TODO: Example'],
    consequences: ['TODO: Consequence', 'TODO: Consequence'],
  },
  currentWorkflow: {
    stat: 'TODO: N review cycles',
    steps: [{ label: 'TODO: Step' }, { label: 'TODO: Step' }, { label: 'TODO: Step', kind: 'reject' }],
  },
  proposedWorkflow: {
    stat: 'TODO: N review cycles',
    steps: [{ label: 'TODO: Step' }, { label: 'TODO: Step', kind: 'ai' }, { label: 'TODO: Step', kind: 'approve', actor: 'reviewer' }],
  },
  whyAnalyzer: {
    intro: ['TODO: Why traditional tools fall short.'],
    examples: ['TODO: Example of semantic understanding'],
    body: ['TODO: What the analyzer enables.'],
    quotes: ['TODO: Example generated change summary'],
    closing: 'TODO: Closing statement.',
  },
  value: [
    { title: 'TODO: Value', body: 'TODO: Description.' },
    { title: 'TODO: Value', body: 'TODO: Description.' },
  ],
  tradeoffs: [
    { title: 'TODO: Risk', body: 'TODO: Description.' },
    { title: 'TODO: Risk', body: 'TODO: Description.' },
  ],
})

export const USE_CASE_2: UseCaseData = {
  id:      'use-case-2',
  eyebrow: 'Use Case 2',
  title:   'RFI Spatial Link',

  constructionPhase: {
    name: 'Construction',
    description:
      'During construction, field teams frequently encounter issues that require clarification from designers, consultants, or project stakeholders. Speed and context are critical to avoid delays.',
  },

  primaryUser: {
    pill: 'Field user',
    role: 'Field Superintendent / Foreman',
    description: 'Responsible for identifying issues onsite and creating RFIs, often from a mobile device in time-constrained conditions.',
  },
  secondaryUser: [
    {
      pill: 'Designer',
      role: 'Architect / Structural Engineer / MEP Designer',
      description: 'Responsible for reviewing RFIs and resolving design-related questions.',
    },
    {
      pill: 'Project stakeholders',
      role: 'Subcontractors / Project Manager / Owners',
      description: 'Stakeholders who depend on timely RFI resolution to maintain project progress and coordination.',
    },
  ],

  problem: {
    intro:
      'Field teams often struggle to provide complete context when creating RFIs. Identifying the correct drawing sheet, room, object, schedule entry, and specification section requires navigating large drawing sets from a mobile device while working onsite.',
    consequences: [
      'RFIs are submitted with incomplete information',
      'Designers request clarification',
      'Resolution cycles increase',
      'Construction work may be delayed while waiting for answers',
      'Industry RFI turnaround times frequently exceed 7 days',
      'Autodesk customer forums contain requests for drawing-aware RFIs and automatic specification linkage',
      'Autodesk’s Quick Create RFI improves text generation but does not understand drawing content',
    ],
  },

  currentWorkflow: {
    stat: 'Repeated RFI cycles',
    steps: [
      { label: 'Issue identified onsite' },
      { label: 'Open Forma mobile' },
      { label: 'Describe issue using text or voice' },
      { label: 'Locate correct drawing sheet' },
      { label: 'Locate room / object' },
      { label: 'Manually pin location' },
      { label: 'Add drawing references' },
      { label: 'Add schedule / specification references' },
      { label: 'Submit RFI', emphasis: true },
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
      { label: 'Spatial Link suggests context', kind: 'ai', note: 'Room • Object • Sheet • Schedule • Specification' },
      { label: 'User confirms context' },
      { label: 'Submit RFI', emphasis: true },
      { label: 'RFI answered without clarification cycle', kind: 'approve', actor: 'designer', note: 'Higher first-pass resolution' },
    ],
  },

  whyAnalyzer: {
    intro: [
      'This workflow requires the system to understand the contents of construction drawings rather than simply storing files.',
      'The AI Drawing Analyzer enables:',
    ],
    examples: [
      'Room and space detection',
      'Object and equipment detection',
      'Text-to-geometry association',
      'Drawing-to-schedule relationships',
      'Structured drawing representation',
    ],
    body: [
      'Unlike a traditional PDF viewer, the system can resolve natural-language references such as:',
    ],
    quotes: [
      'Window in Conference Room A on Level 3',
    ],
    closing:
      'It resolves this into the correct room, the relevant drawing sheet, the associated window type, related schedule entries, and applicable specification sections. The system can then present candidate matches transparently and allow the user to confirm the correct context before submission. This extends Autodesk’s existing Quick Create RFI workflow by adding drawing intelligence rather than replacing it.',
  },

  value: [
    {
      title: 'Higher First-Pass Resolution',
      body: 'RFIs arrive with richer spatial and document context, reducing clarification requests and rework.',
    },
    {
      title: 'Reduced RFI Cycle Time',
      body: 'Complete context enables faster responses from designers and consultants.',
    },
    {
      title: 'Improved Field Productivity',
      body: 'Field users spend less time navigating drawings and gathering supporting information. The workflow is mobile-friendly, voice-friendly, and better suited to field conditions.',
    },
    {
      title: 'Strategic Platform Value',
      body: 'Demonstrates how the structured drawing representation created by the AI Drawing Analyzer can be reused beyond drawing review workflows. The same room, object, drawing, schedule, and specification relationships used to enrich RFIs can support additional workflows across Autodesk Construction Cloud, increasing the value of the underlying AI Drawing Analyzer investment.',
    },
  ],

  tradeoffs: [
    {
      title: 'Natural Language Ambiguity',
      body: 'Descriptions such as “the window near the conference room” may refer to multiple drawing elements.',
    },
    {
      title: 'Drawing Register Accuracy',
      body: 'Incorrect room, object, or schedule associations may lead to incomplete or inaccurate RFIs.',
    },
    {
      title: 'User Adoption',
      body: 'Some users may prefer existing pin-based workflows and may not trust AI-assisted context generation.',
    },
    {
      title: 'False Confidence',
      body: 'Users may accept incorrect AI suggestions without sufficient verification.',
    },
  ],
}

export const USE_CASE_3: UseCaseData = PLACEHOLDER(
  'use-case-3',
  3,
  'TODO: Third Use Case (TBD)',
)
