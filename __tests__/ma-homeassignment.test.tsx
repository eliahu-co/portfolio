// __tests__/ma-homeassignment.test.tsx
import { render } from '@testing-library/react'
import MAHomeAssignmentPage from '@/app/MA-HomeAssignment/page'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders every side-nav section anchor', () => {
  render(<MAHomeAssignmentPage />)
  const ids = [
    'hero', 'use-case-1', 'use-case-2', 'use-case-3', 'use-case-4',
    'prioritization', 'mvp', 'prototype', 'unknowns', 'assumptions', 'approach',
  ]
  for (const id of ids) {
    expect(document.getElementById(id)).toBeInTheDocument()
  }
})

it('renders the Coin Master hero banner', () => {
  render(<MAHomeAssignmentPage />)
  const hero = document.getElementById('hero')!
  // full-bleed violet banner
  expect(hero.className).toContain('from-cm-violet-deep')
  // chunky display font applied to the title
  const h1 = hero.querySelector('h1')!
  expect(h1.className).toContain('text-cm-gold-bright')
})
