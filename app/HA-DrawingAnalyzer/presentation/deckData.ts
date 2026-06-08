// app/HA-DrawingAnalyzer/presentation/deckData.ts
// Real content for the deck. USE_CASES are imported from the live source of
// truth. The remaining blocks are COPIED from module-local consts in the
// section files (which must stay untouched) — keep them in sync by hand.

import { USE_CASE_1, USE_CASE_2, USE_CASE_3, USE_CASE_4 } from '@/app/HA-DrawingAnalyzer/sections/useCaseData'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export const USE_CASES: UseCaseData[] = [USE_CASE_1, USE_CASE_2, USE_CASE_3, USE_CASE_4]

// One-line problem statement shown on the intro slide before each use case.
export const USE_CASE_PROBLEMS = [
  'Changes are often submitted with unintended modifications.',
  'RFIs often lack the context needed for a timely response.',
  'Design dependencies are difficult to track across disciplines.',
  'Program compliance relies on manual review.',
]

// phrase within each problem to highlight (revealed on hover)
export const USE_CASE_PROBLEM_HL = [
  'unintended modifications',
  'lack the context',
  'difficult to track',
  'manual review',
]

// SOURCE: sections/Prioritization.tsx CRITERIA / ROWS — keep in sync.
export const CRITERIA = ['Impact', 'Platform Leverage', 'Confidence', 'Feasibility'] as const

export type ScoreRow = { useCase: string; scores: number[]; total: number; winner?: boolean }
export const SCORE_ROWS: ScoreRow[] = [
  { useCase: 'Change Validation',          scores: [5, 5, 5, 3], total: 18, winner: true },
  { useCase: 'Context Link',               scores: [5, 5, 4, 3], total: 17 },
  { useCase: 'Coordination Lock',          scores: [5, 5, 3, 2], total: 15 },
  { useCase: 'Program Conformance Review', scores: [4, 5, 2, 2], total: 13 },
]

// per-cell rationale, indexed [SCORE_ROWS row][criteria col]
export const SCORE_NOTES: string[][] = [
  [ // Change Validation
    'High-frequency workflow affecting nearly every design revision.',
    'Impossible without object-level change detection.',
    'Clear pain point and minimal workflow change.',
    'Requires reliable object matching across revisions.',
  ],
  [ // Context Link
    'RFIs are common and delays are expensive.',
    'Relies on mapping issue descriptions to project objects and locations.',
    'The effort and the value are realized by different users.',
    'Requires linking issue descriptions to relevant objects, sheets, and project data.',
  ],
  [ // Coordination Lock
    'Coordination issues frequently create costly rework.',
    'Depends on understanding relationships between objects across disciplines.',
    'Requires teams to adopt a new coordination workflow.',
    'Requires maintaining an object dependency graph across sheets over time.',
  ],
  [ // Program Conformance Review
    'High value, but applicable to a narrower set of stakeholders.',
    'Depends on understanding drawing content and spatial relationships.',
    'Requires teams to maintain structured program requirements.',
    'Requires structured program definitions and rule evaluation.',
  ],
]

export type CriterionDef = { title: string; body: string; rubric: [string, string][] }
export const CRITERIA_DEFS: CriterionDef[] = [
  { title: 'Impact', body: 'Value × Number of Users', rubric: [['5', 'Significant impact'], ['3', 'Meaningful, but limited'], ['1', 'Nice-to-have improvement']] },
  { title: 'Platform Leverage', body: 'Dependence on Drawing Intelligence', rubric: [['5', 'Impossible without it'], ['3', 'Benefits from it'], ['1', 'Mostly unrelated']] },
  { title: 'Confidence', body: 'Likelihood of Adoption', rubric: [['5', 'Obvious value, min. behaviour change'], ['3', 'Some adoption risk'], ['1', 'Significant uncertainty']] },
  { title: 'Feasibility', body: 'Effort to Deliver', rubric: [['5', 'Low effort, limited dependencies'], ['3', 'Moderate effort, coordination required'], ['1', 'Significant effort, high complexity']] },
]

// SOURCE: sections/MVP.tsx METRICS — success metrics + their type for the deck.
export const METRICS = [
  { title: 'First-Pass Approval Rate', type: 'Business\noutcome', signal: 'Increasing compared to baseline.' },
  { title: 'Pre-Review Revision Rate', type: 'Usage', signal: 'Positive and sustained — issues identified before submission.' },
  { title: 'Change Validation Satisfaction', type: 'Quality', signal: 'High and increasing over time.' },
  { title: 'Review Submission Volume', type: 'Guardrail', signal: 'Stable relative to baseline — the added step is not reducing adoption.' },
]

// SOURCE: sections/MVP.tsx SCOPE_IN / SCOPE_OUT — keep in sync.
export const SCOPE_IN = [
  'Compare two versions of a single drawing sheet.',
  'Detect added, removed, and modified objects.',
  'Generate visual previews of detected changes.',
  'Approve detected changes and submit review.',
  'Cancel review submission and return to editing.',
]
export const SCOPE_OUT = [
  'Manual addition of undetected changes.',
  'Approval or rejection of individual detected changes.',
  'Generate human-readable change descriptions.',
  'Automatic filtering of cosmetic or low-impact changes.',
  'Change severity scoring and risk classification.',
  'Historical change reports.',
  'Multi-sheet drawing sets.',
]

// Executive assumptions — each completes the title "The Drawing Analyzer is…".
export const ASSUMPTIONS = [
  'Able to identify and relate objects across files and revisions',
  'Probabilistic and requires human verification',
  'Fast enough to fit within existing workflows',
  'Augmenting drawings, not replacing them as the source of truth',
  'Analyzing designs, not modifying them',
  'Integrated into Forma',
  'Compatible with standard industry drawings',
]

// SOURCE: sections/KeyUnknowns.tsx VARIABLES — keep in sync.
export const VARIABLES = [
  { label: 'Accuracy', body: 'What confidence threshold should be required before a detected change is surfaced to the user?' },
  { label: 'Latency',  body: 'What response time is required for Change Validation to fit naturally into the review submission workflow?' },
  { label: 'Cost',     body: 'Can change validation run on every review initiated while remaining economically viable at project scale?' },
]

// Construction lifecycle for slide 3 — phases (initials + name) and the
// higher-level stage groups that bracket them (modeled on the AEC reference).
export type LifecyclePhase = { initials: string; name: string; muted?: boolean }
export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  { initials: 'PD', name: 'Pre Design' },
  { initials: 'SD', name: 'Schematic Design' },
  { initials: 'DD', name: 'Design Development' },
  { initials: 'BP', name: 'Building Permit', muted: true },
  { initials: 'CD', name: 'Construction Documents' },
  { initials: 'BN', name: 'Bidding & Negotiation', muted: true },
  { initials: 'CA', name: 'Construction Administration' },
]

export type LifecycleGroup = { label: string; start: number; span: number; muted?: boolean }
export const LIFECYCLE_GROUPS: LifecycleGroup[] = [
  { label: 'Conception', start: 0, span: 1 },
  { label: 'Design + Coordination + Planning', start: 1, span: 4 },
  { label: 'Pricing', start: 5, span: 1, muted: true },
  { label: 'Construction', start: 6, span: 1 },
]

export const APPROACH_FLOW = ['Lifecycle', 'Bottlenecks', 'Use Cases', 'Prioritization', 'MVP']

// Recommendation pillars (titles from brief; supporting lines adjustable).
export const RECOMMENDATION_PILLARS = [
  { title: 'Highest Confidence', body: 'Clear pain point, obvious value, minimal behavior change.' },
  { title: 'Highest Platform Leverage', body: 'Depends directly on object-level change detection.' },
  { title: 'Fastest Learning', body: 'Lowest-effort MVP that validates the core hypothesis quickly.' },
]

// Demo assets (already committed under /public).
export const DEMO_POSTER = '/drawinganalyzer/ha-drawing-analyzer-poster.jpg'
export const DEMO_HREF = '/HA-DrawingAnalyzer/demo'
