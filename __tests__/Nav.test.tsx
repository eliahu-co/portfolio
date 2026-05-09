// __tests__/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

it('renders EC logo', () => {
  render(<Nav />)
  expect(screen.getByText('EC')).toBeInTheDocument()
})

it('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /what i do/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

it('logo links to #hero', () => {
  render(<Nav />)
  expect(screen.getByText('EC').closest('a')).toHaveAttribute('href', '#hero')
})
