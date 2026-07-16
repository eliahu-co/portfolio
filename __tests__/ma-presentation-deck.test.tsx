import { readFileSync } from 'fs'
import { resolve } from 'path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import PresentationDeck from '@/app/MA-HomeAssignment/presentation/PresentationDeck'
import { slideCount } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
}

function setRoute(hash = '') {
  window.history.replaceState({}, '', `/MA-HomeAssignment/presentation/${hash}`)
}

function activeSlide(container: HTMLElement): HTMLElement {
  const slide = container.querySelector<HTMLElement>('[data-active-slide="true"]')
  expect(slide).not.toBeNull()
  if (!slide) throw new Error('Missing active slide')
  return slide
}

describe('MA presentation deck', () => {
  beforeEach(() => {
    mockPush.mockReset()
    setViewport(1280, 720)
    setRoute()
    document.body.classList.remove('ma-presentation-active')
  })

  afterEach(() => {
    document.body.classList.remove('ma-presentation-active')
  })

  it('starts from a valid hash and canonicalizes an invalid hash to the cover', () => {
    setRoute('#slide-5')
    const first = render(<PresentationDeck />)

    expect(activeSlide(first.container)).toHaveAttribute('id', 'slide-5')
    expect(screen.getByRole('status', { name: 'Slide 5 of 21' })).toHaveTextContent('5 / 21')
    first.unmount()

    setRoute('#slide-999')
    const second = render(<PresentationDeck />)
    expect(activeSlide(second.container)).toHaveAttribute('id', 'slide-1')
    expect(window.location.hash).toBe('#slide-1')
  })

  it('uses registry neighbor labels and clamps button and keyboard navigation', () => {
    const { container } = render(<PresentationDeck />)

    expect(screen.queryByRole('button', { name: /^Previous:/ })).not.toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-1')

    fireEvent.click(screen.getByRole('button', { name: 'Next: About' }))
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-2')
    expect(screen.getByRole('button', { name: 'Previous: Cover' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Next: Approach' })).toBeVisible()

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-3')
    fireEvent.keyDown(window, { key: ' ', shiftKey: false })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-4')
    fireEvent.keyDown(window, { key: ' ', shiftKey: true })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-3')
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-2')

    act(() => {
      window.history.replaceState({}, '', '#slide-21')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-21')
    expect(screen.queryByRole('button', { name: /^Next:/ })).not.toBeInTheDocument()
  })

  it('follows hashchange and popstate while deck moves use replaceState', () => {
    const replace = jest.spyOn(window.history, 'replaceState')
    const { container } = render(<PresentationDeck />)

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(window.location.hash).toBe('#slide-2')
    expect(replace).toHaveBeenCalled()

    act(() => {
      window.history.replaceState({}, '', '#slide-8')
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-8')

    act(() => {
      window.history.replaceState({}, '', '#slide-13')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-13')
    replace.mockRestore()
  })

  it('ignores prevented events and keyboard input from interactive descendants', () => {
    const { container } = render(<PresentationDeck />)

    const prevented = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    })
    prevented.preventDefault()
    act(() => window.dispatchEvent(prevented))
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-1')

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    const brazil = within(activeSlide(container)).getByRole('button', { name: 'Brazil' })
    fireEvent.keyDown(brazil, { key: 'ArrowRight' })
    fireEvent.keyDown(brazil, { key: ' ' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-2')
  })

  it('lets a pinned slide interaction consume Escape before routing home', () => {
    setRoute('#slide-13')
    const { container } = render(<PresentationDeck />)
    const scoring = activeSlide(container)
    const score = within(scoring).getByRole('button', {
      name: /Card Bounty: Confidence score 4/i,
    })

    fireEvent.click(score)
    expect(within(scoring).getByRole('status', { name: 'Score detail' })).toBeVisible()
    fireEvent.keyDown(score, { key: 'Escape' })
    expect(within(scoring).queryByRole('status', { name: 'Score detail' })).not.toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(mockPush).toHaveBeenCalledWith('/MA-HomeAssignment')
  })

  it('mounts one registry tree, makes inactive slides inert, and resets interactions', () => {
    const { container } = render(<PresentationDeck />)
    const tree = container.querySelector('[data-slide-registry-tree="true"]')!
    const slides = Array.from(tree.querySelectorAll<HTMLElement>('[data-deck-slide="true"]'))

    expect(container.querySelectorAll('[data-slide-registry-tree="true"]')).toHaveLength(1)
    expect(slides).toHaveLength(slideCount)
    expect(container.querySelector('[data-print-deck]')).toBeNull()
    expect(screen.getByRole('navigation', { name: 'Presentation controls' }))
      .not.toHaveClass('screenOnly')
    slides.forEach((slide, index) => {
      if (index === 0) {
        expect(slide).not.toHaveAttribute('aria-hidden')
        expect(slide).not.toHaveAttribute('inert')
      } else {
        expect(slide).toHaveAttribute('aria-hidden', 'true')
        expect(slide).toHaveAttribute('inert')
      }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Next: About' }))
    const about = activeSlide(container)
    const brazil = within(about).getByRole('button', { name: 'Brazil' })
    fireEvent.focus(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Next: Approach' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous: About' }))
    expect(within(activeSlide(container)).getByRole('button', { name: 'Brazil' }))
      .toHaveAttribute('aria-expanded', 'false')
  })

  it('scales the 1280 by 720 stage and exposes the below-threshold notice', () => {
    setViewport(1440, 900)
    const { container } = render(<PresentationDeck />)
    const viewport = container.querySelector<HTMLElement>('[data-presentation-viewport]')!
    expect(viewport).toHaveStyle('--deck-scale: 1.125')
    expect(viewport).toHaveAttribute('data-viewport-supported', 'true')

    setViewport(959, 720)
    fireEvent(window, new Event('resize'))
    expect(viewport).toHaveAttribute('data-viewport-supported', 'false')
    expect(screen.getByRole('status', { name: 'Desktop presentation notice' })).toBeVisible()
  })

  it('handles closing-menu anchors in place and scopes the landscape override to mount', () => {
    setRoute('#slide-21')
    const { container, unmount } = render(<PresentationDeck />)
    expect(document.body).toHaveClass('ma-presentation-active')

    fireEvent.click(within(activeSlide(container)).getByRole('link', { name: 'Approach' }))
    expect(window.location.hash).toBe('#slide-3')
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-3')

    unmount()
    expect(document.body).not.toHaveClass('ma-presentation-active')
  })

  it('keeps the crossfade motion-reducible and disables the global guard only on this route', () => {
    const stageCss = readFileSync(resolve(
      process.cwd(),
      'app/MA-HomeAssignment/presentation/PresentationStage.module.css',
    ), 'utf8')
    const globalCss = readFileSync(resolve(process.cwd(), 'app/globals.css'), 'utf8')

    expect(stageCss).toMatch(/transition:\s*opacity 250ms ease/)
    expect(stageCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.slide\s*{[\s\S]*?transition:\s*none/,
    )
    expect(stageCss).toMatch(
      /\.desktopNotice\s*{[^}]*position:\s*absolute;[^}]*inset:\s*0;/,
    )
    expect(stageCss).not.toMatch(/\.viewportSupported\s+\.desktopNotice/)
    expect(globalCss).toMatch(
      /body\.ma-presentation-active\s+\.landscape-guard\s*{[^}]*display:\s*none\s*!important/,
    )
  })
})
