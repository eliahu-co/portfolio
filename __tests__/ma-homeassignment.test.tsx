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
