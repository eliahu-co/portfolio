// app/MA-HomeAssignment/sections.ts
// Single source of truth for the page's sections + sticky-nav.
// Keep this in sync with the components rendered in page.tsx — the SideNav
// and the IntersectionObserver active-state both read from here.

export interface PageSection {
  id:    string // anchor id (also used as #hash target)
  label: string // short label shown in the sticky side-nav
}

export const SECTIONS: PageSection[] = [
  { id: 'hero',          label: 'Intro' },
  { id: 'use-case-1',    label: 'Use Case 1' },
  { id: 'use-case-2',    label: 'Use Case 2' },
  { id: 'use-case-3',    label: 'Use Case 3' },
  { id: 'use-case-4',    label: 'Use Case 4' },
  { id: 'prioritization', label: 'Prioritization' },
  { id: 'mvp',           label: 'MVP' },
  { id: 'prototype',     label: 'Prototype' },
  { id: 'unknowns',      label: 'Key Unknowns' },
  { id: 'assumptions',   label: 'Assumptions' },
  { id: 'approach',      label: 'Approach' },
]
