// __tests__/Contact.test.tsx
import { render, screen } from '@testing-library/react'
import Contact from '@/components/Contact'

it('renders heading', () => {
  render(<Contact />)
  expect(screen.getByText("Let's build something.")).toBeInTheDocument()
})

it('renders email link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /hi@eliahu\.co/i })
  expect(link).toHaveAttribute('href', 'mailto:hi@eliahu.co')
})

it('renders LinkedIn link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /linkedin/i })
  expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/eliahu-cohen-b32374114')
  expect(link).toHaveAttribute('target', '_blank')
})

it('renders CV download link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /download cv/i })
  expect(link).toHaveAttribute('href', '/cv.pdf')
  expect(link).toHaveAttribute('download')
})
