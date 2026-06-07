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
        { label: 'Review' },
        { label: 'Issue Found' },
        { label: 'Rework' },
        { label: 'Review Again' },
      ],
      footer: 'Repeated Review Cycles',
    },
    proposed: {
      steps: [
        { label: 'Design Change' },
        { label: 'Change Validation', kind: 'ai' },
        { label: 'Issue Found' },
        { label: 'Correction' },
        { label: 'Review', kind: 'approve' },
      ],
      footer: 'First-Pass Approval',
    },
  },
  'use-case-2': {
    current: {
      steps: [
        { label: 'Issue Identified' },
        { label: 'RFI Submitted' },
        { label: 'Designer Tries to Guess Context' },
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
        { label: 'Discipline A Changes Design' },
        { label: 'Impact Not Visible' },
        { label: 'Conflict Discovered Later' },
        { label: 'Coordination Rework' },
      ],
      footer: 'Hidden Dependencies',
    },
    proposed: {
      steps: [
        { label: 'Discipline A Changes Design' },
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
        { label: 'Design Progresses' },
        { label: 'Manual Program Review' },
        { label: 'Limited Review Capacity' },
        { label: 'Inconsistent Enforcement' },
      ],
      footer: 'Periodic Validation',
    },
    proposed: {
      steps: [
        { label: 'Design Progresses' },
        { label: 'Program Continuously Evaluated', kind: 'ai' },
        { label: 'Requirements Tracked' },
        { label: 'Consistent Enforcement', kind: 'approve' },
      ],
      footer: 'Continuous Validation',
    },
  },
}
