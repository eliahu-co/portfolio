// __tests__/PanelScene.test.tsx
import { render } from '@testing-library/react'
import PanelScene from '@/components/PanelScene'

// Three.js and GSAP are mocked via __mocks__/
jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {
    create: jest.fn(() => ({ kill: jest.fn() })),
    kill: jest.fn(),
  },
}))

it('mounts without errors', () => {
  const { container } = render(<PanelScene />)
  expect(container.firstChild).toBeInTheDocument()
})

it('unmounts without errors', () => {
  const { unmount } = render(<PanelScene />)
  expect(() => unmount()).not.toThrow()
})
