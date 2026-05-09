// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('next/dynamic', () => () => () => null)
jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
  },
}))

it('renders all four sections', () => {
  render(<Home />)
  expect(document.getElementById('hero')).toBeInTheDocument()
  expect(document.getElementById('about')).toBeInTheDocument()
  expect(document.getElementById('what-i-do')).toBeInTheDocument()
  expect(document.getElementById('contact')).toBeInTheDocument()
})
