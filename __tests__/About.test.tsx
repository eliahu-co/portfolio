// __tests__/About.test.tsx
import { render, screen } from '@testing-library/react'
import About from '@/components/About'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders the profile photo', () => {
  render(<About />)
  expect(screen.getByRole('img', { name: 'Eliahu Cohen' })).toBeInTheDocument()
})

it('renders bio paragraph', () => {
  render(<About />)
  expect(screen.getByText(/after a decade spanning/i)).toBeInTheDocument()
})

it('renders all skill tags', () => {
  render(<About />)
  const tags = ['Architecture', 'Product Manager', 'Full Stack', 'BIM', 'ConTech']
  tags.forEach((tag) => {
    expect(screen.getByText(tag)).toBeInTheDocument()
  })
})
