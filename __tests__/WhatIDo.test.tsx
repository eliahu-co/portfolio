// __tests__/WhatIDo.test.tsx
import { render, screen } from '@testing-library/react'
import WhatIDo from '@/components/WhatIDo'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders section heading', () => {
  render(<WhatIDo />)
  expect(screen.getByText('What I do')).toBeInTheDocument()
})

it('renders all three card titles', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Development')).toBeInTheDocument()
  expect(screen.getByText('Product & R&D')).toBeInTheDocument()
  expect(screen.getByText('Architecture & Design')).toBeInTheDocument()
})

it('renders all three category tags', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Coding · Full-Stack')).toBeInTheDocument()
  expect(screen.getByText('Research · Strategy')).toBeInTheDocument()
  expect(screen.getByText('Architecture · BIM')).toBeInTheDocument()
})
