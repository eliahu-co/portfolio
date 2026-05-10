// __tests__/FloatNav.test.tsx
import { render, screen } from '@testing-library/react'
import FloatNav from '@/components/FloatNav'

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

it('renders all nav links', () => {
  render(<FloatNav />)
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /what i do/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

it('nav links point to correct section anchors', () => {
  render(<FloatNav />)
  expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about')
  expect(screen.getByRole('link', { name: /what i do/i })).toHaveAttribute('href', '#what-i-do')
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
})

it('renders scroll-to-top button', () => {
  render(<FloatNav />)
  expect(screen.getByRole('button', { name: /scroll to top/i })).toBeInTheDocument()
})
