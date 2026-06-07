// app/HA-DrawingAnalyzer/presentation/execWorkflows.ts
// Simplified, executive Current-vs-Proposed workflows for the use-case slides.
// Keyed by use-case id. These are a deliberately condensed set (distinct from the
// detailed workflows in sections/useCaseData.ts).
import type { ExecLane } from './ExecWorkflow'

export const EXEC_WORKFLOWS: Record<string, { current: ExecLane; proposed: ExecLane }> = {
  'use-case-1': {
    current: {
      steps: [
        { label: 'Design Change' },
        { label: 'Self-check' },
        { label: 'Review', actor: 'Reviewer' },
        { label: 'Issue Found' },
        { label: 'Rework' },
        { label: 'Review Again', kind: 'repeat', actor: 'Reviewer' },
      ],
      footer: 'Repeated Review Cycles',
    },
    proposed: {
      steps: [
        { label: 'Design Change' },
        { label: 'Self-check', kind: 'ai' },
        { label: 'Issue Found' },
        { label: 'Correction' },
        { label: 'Review', kind: 'approve', actor: 'Reviewer' },
      ],
      footer: 'First-Pass Approval',
    },
  },
  'use-case-2': {
    current: {
      steps: [
        { label: 'Issue Identified' },
        { label: 'RFI Submitted' },
        { label: 'Designer Tries to Guess Context', actor: 'Designer' },
        { label: 'Clarification Required' },
        { label: 'Back and Forth' },
        { label: 'Response' },
      ],
      footer: 'Missing Context',
    },
    proposed: {
      steps: [
        { label: 'Issue Identified' },
        { label: 'Context Link', kind: 'ai' },
        { label: 'RFI Submitted' },
        { label: 'Response', kind: 'approve' },
      ],
      footer: 'Complete Context',
    },
  },
  'use-case-3': {
    current: {
      steps: [
        { label: 'Disciplines coordinated' },
        { label: 'Design change', actor: 'Designer' },
        { label: 'Impact Not Visible' },
        { label: 'Conflict Discovered Later' },
        { label: 'Coordination Rework' },
      ],
      footer: 'Hidden Dependencies',
    },
    proposed: {
      steps: [
        { label: 'Disciplines coordinated' },
        { label: 'Design change', actor: 'Designer' },
        { label: 'Impacted Dependencies Identified', kind: 'ai' },
        { label: 'Teams Notified' },
        { label: 'Issue Resolved Early', kind: 'approve' },
      ],
      footer: 'Visible Dependencies',
    },
  },
  'use-case-4': {
    current: {
      steps: [
        { label: 'Requirements defined' },
        { label: 'Design Progresses', actor: 'Designer' },
        { label: 'Manual Program Review' },
        { label: 'Limited Review Capacity' },
        { label: 'Inconsistent Enforcement' },
      ],
      footer: 'Periodic Validation',
    },
    proposed: {
      steps: [
        { label: 'Requirements defined', kind: 'ai' },
        { label: 'Design Progresses', actor: 'Designer' },
        { label: 'Program Continuously Evaluated', kind: 'ai' },
        { label: 'Requirements Tracked' },
        { label: 'Consistent Enforcement', kind: 'approve' },
      ],
      footer: 'Continuous Validation',
    },
  },
}
