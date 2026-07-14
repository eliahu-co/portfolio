// __tests__/WhatIDo.test.tsx
import { render, screen } from '@testing-library/react'
import WhatIDo from '@/components/WhatIDo'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders all four card titles', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Product & Dev')).toBeInTheDocument()
  expect(screen.getByText('Architecture')).toBeInTheDocument()
  expect(screen.getByText('Research & Dev')).toBeInTheDocument()
  expect(screen.getByText('Research & Development')).toBeInTheDocument()
  expect(screen.getByText('Design')).toBeInTheDocument()
})

it('renders all four category tags', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Strategy · Full-Stack')).toBeInTheDocument()
  expect(screen.getByText('Construction · BIM')).toBeInTheDocument()
  expect(screen.getByText('Innovation · Problem-Solving')).toBeInTheDocument()
  expect(screen.getByText('Product · Furniture')).toBeInTheDocument()
})
