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
  { id: 'feature-1',     label: 'Feature 1' },
  { id: 'feature-2',     label: 'Feature 2' },
  { id: 'feature-3',     label: 'Feature 3' },
  { id: 'prioritization', label: 'Prioritization' },
  { id: 'mvp',           label: 'MVP' },
  { id: 'prototype',     label: 'Prototype' },
  { id: 'unknowns',      label: 'Key Unknowns' },
  { id: 'assumptions',   label: 'Assumptions' },
  { id: 'approach',      label: 'Approach' },
]
