// __tests__/About.test.tsx
import { render, screen } from '@testing-library/react'
import About from '@/components/About'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders section heading', () => {
  render(<About />)
  expect(
    screen.getByText(/the intersection of design thinking/i)
  ).toBeInTheDocument()
})

it('renders bio paragraph', () => {
  render(<About />)
  expect(screen.getByText(/after a decade spanning/i)).toBeInTheDocument()
})

it('renders all skill tags', () => {
  render(<About />)
  const tags = ['Product', 'BIM', 'ConTech', 'React · Node.js', 'Digital Twin', 'CAD-to-CAM']
  tags.forEach((tag) => {
    expect(screen.getByText(tag)).toBeInTheDocument()
  })
})
