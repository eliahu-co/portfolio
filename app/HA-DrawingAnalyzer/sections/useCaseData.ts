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
      { label: 'RFI answered without clarification cycle', kind: 'approve', actor: 'designer', note: 'No clarification required' },
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
      'This workflow requires the system to understand relationships between objects across multiple discipline drawings rather than treating each sheet as an independent document.',
    ],
    body: [
      'Unlike a traditional PDF viewer, the AI Drawing Analyzer can identify when objects on different sheets are likely referring to the same physical space, equipment, or coordinated design decision. It can then surface those relationships for review and maintain them over time as drawings evolve.',
    ],
    closing:
      'For example, a ceiling-mounted unit shown on an architectural reflected ceiling plan and a related electrical junction box shown on an electrical plan may represent a coordinated design decision. Once confirmed by the coordinator, that relationship can be monitored across future revisions and automatically flagged when either side changes.',
  },

  value: [
    {
      title: 'Earlier Conflict Detection',
      body: 'Cross-discipline issues are flagged before they reach the field, where fixes are significantly more expensive.',
    },
    {
      title: 'Persistent Coordination History',
      body: 'Confirmed relationships become a living record of coordination decisions rather than disappearing into meetings, markups, and email threads.',
    },
    {
      title: 'Better Change Impact Awareness',
      body: 'When one coordinated object changes, related objects are automatically flagged for review, reducing the likelihood of downstream conflicts.',
    },
    {
      title: 'Works on Issued 2D Drawings',
      body: 'The workflow operates on the drawing set that teams actually build from, including projects where BIM models are incomplete, outdated, or not consistently maintained.',
    },
  ],

  tradeoffs: [
    {
      title: 'Project Complexity Dependency',
      body: 'The use case is most valuable on large, complex projects with many cross-discipline dependencies. Simpler projects may not justify the coordination overhead.',
    },
    {
      title: 'Data Coverage',
      body: 'The workflow depends on relevant discipline sheets being available within Autodesk’s environment. Missing disciplines limit the value of the coordination graph.',
    },
    {
      title: 'Usability Complexity',
      body: 'Coordinators need to compare relationships across multiple sheets while clearly distinguishing high-confidence matches from lower-confidence suggestions.',
    },
    {
      title: 'AI Ambiguity',
      body: 'Some relationships are obvious (e.g., matching equipment tags), while others require spatial inference and may be inherently ambiguous.',
    },
    {
      title: 'Workflow Adoption',
      body: 'BIM coordination workflows are already established. The product must be positioned as a coordination layer for issued 2D documents rather than a replacement for 3D clash detection.',
    },
  ],
}
