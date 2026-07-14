// __tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

jest.mock('next/dynamic', () => () => () => null)
jest.mock('@/components/Tooltip', () => ({
  showTooltip: jest.fn(),
  hideTooltip: jest.fn(),
}))

it('renders the hero section', () => {
  const { container } = render(<Hero />)
  expect(container.querySelector('#hero')).toBeInTheDocument()
  expect(container.querySelector('.animate-bounce-y')).toBeInTheDocument()
})
