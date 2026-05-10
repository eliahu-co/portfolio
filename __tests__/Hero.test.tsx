// __tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

jest.mock('next/dynamic', () => () => () => null)

it('renders name', () => {
  render(<Hero />)
  expect(screen.getByText('Eliahu Cohen')).toBeInTheDocument()
})

it('renders tagline', () => {
  render(<Hero />)
  expect(screen.getByText(/architect\. developer\. builder\./i)).toBeInTheDocument()
})

it('renders scroll CTA', () => {
  render(<Hero />)
  expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument()
})
