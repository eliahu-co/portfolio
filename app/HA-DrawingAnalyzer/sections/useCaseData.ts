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
      'Traditional document comparison tools compare visual or vector-level differences and often generate excessive noise. The AI Drawing Analyzer compares the semantic structure of the drawing.',
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
}

export const USE_CASE_2: UseCaseData = {
  id:      'use-case-2',
  eyebrow: 'Use Case 2',
  title:   'RFI Context Link',

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
      'RFIs are submitted with incomplete context, leading to clarification requests and longer resolution cycles',
      'Construction work may be delayed while waiting for answers, especially when RFIs impact critical-path activities',
      'Teams spend additional time coordinating, investigating, and re-establishing context that could have been captured during RFI creation',
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

  whyAnalyzer: {
    intro: [
      'Field users typically describe issues using the language they use on site:',
    ],
    quotes: [
      'Window in Conference Room A on Level 3 doesn’t match spec.',
    ],
    quotesAfterIntro: true,
    body: [
      'The challenge is not capturing the issue description, but connecting it to the relevant project context.',
      'The AI Drawing Analyzer enables the system to resolve that description into the appropriate room, drawing sheet, object, schedule entry, and specification section, allowing RFIs to be submitted with richer context and reducing the need for clarification cycles.',
    ],
    closing:
      'This extends Autodesk’s existing Quick Create RFI workflow by adding drawing intelligence rather than replacing it.',
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
}

export const USE_CASE_3: UseCaseData = {
  id:      'use-case-3',
  eyebrow: 'Use Case 3',
  title:   'Cross-Discipline Coordination Lock',

  constructionPhase: {
    name: 'Design Coordination / Preconstruction',
    description:
      'This phase requires architectural, structural, and MEP teams to coordinate design intent before construction begins.',
  },

  primaryUser: {
    pill: 'Coordinator',
    role: 'BIM Coordinator / VDC Lead',
    description: 'Responsible for coordinating drawings across disciplines and identifying conflicts before they reach the field.',
  },
  secondaryUser: {
    pill: 'Design leads',
    role: 'Design Leads / Discipline Engineers',
    description: 'Architects, structural engineers, and MEP engineers responsible for responding to coordination issues.',
  },

  problem: {
    intro:
      'Different discipline drawings describe the same physical space but are not formally connected. When an architectural element changes, related MEP or structural elements may not be flagged automatically. Coordination is handled through meetings, manual drawing review, clash detection, and email threads. Once a conflict is resolved, the relationship between the elements is rarely stored as a persistent dependency.',
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

  whyAnalyzer: {
    intro: [
      'The value of this workflow comes from creating and maintaining relationships between coordinated elements across discipline drawings.',
    ],
    body: [
      'Without drawing understanding, coordination decisions remain isolated to meetings, markups, and email threads. The system has no way to recognize when a future drawing change impacts a previously coordinated element.',
    ],
    closing:
      'The AI Drawing Analyzer enables those relationships to be captured from the drawings themselves and monitored as designs evolve.',
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
      title: 'Project Complexity Dependency',
      body: 'Smaller projects may not justify the additional coordination workflow.',
    },
    {
      title: 'Data Coverage',
      body: 'The workflow depends on all relevant discipline drawings being available.',
    },
    {
      title: 'Relationship Ambiguity',
      body: 'Some cross-discipline relationships may be difficult to infer confidently.',
    },
    {
      title: 'Workflow Adoption',
      body: 'Teams may view the solution as competing with existing coordination practices.',
    },
  ],
}
