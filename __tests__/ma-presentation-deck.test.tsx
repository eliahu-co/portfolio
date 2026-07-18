import { readFileSync } from 'fs'
import { resolve } from 'path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import PresentationDeck from '@/app/MA-HomeAssignment/presentation/PresentationDeck'
import { slideCount, slideRegistry } from '@/app/MA-HomeAssignment/presentation/slideRegistry'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

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
    expect(screen.getByRole('status', { name: 'Slide 5 of 14' })).toHaveTextContent('5 / 14')
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
      window.history.replaceState({}, '', '#slide-14')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(activeSlide(container)).toHaveAttribute('id', 'slide-14')
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

  it('routes home on Escape even when an interactive element has focus', () => {
    setRoute('#slide-7')
    const { container } = render(<PresentationDeck />)
    const scoring = activeSlide(container)
    const score = within(scoring).getByRole('button', {
      name: /Card Bounty: Confidence score 4/i,
    })

    fireEvent.keyDown(score, { key: 'Escape' })
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

  it('mounts the prototype only on slide 10 and resets it after revisiting', () => {
    setRoute('#slide-10')
    const { container } = render(<PresentationDeck />)
    const prototypeSlide = activeSlide(container)
    const viewport = container.querySelector('[data-presentation-viewport="true"]')

    expect(viewport).toHaveAttribute('data-current-slide', 'slide-10')

    fireEvent.click(within(prototypeSlide).getByRole('button', { name: 'Open Card Bounty' }))
    expect(within(prototypeSlide).getByRole('dialog', { name: 'Card Bounty' })).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Next: A/B test' }))
    expect(viewport).toHaveAttribute('data-current-slide', 'slide-11')
    expect(screen.queryByRole('region', { name: 'Card Bounty game prototype' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous: Prototype' }))
    const remountedPrototype = activeSlide(container)
    expect(within(remountedPrototype).queryByRole('dialog', { name: 'Card Bounty' })).not.toBeInTheDocument()
    expect(within(remountedPrototype).getByRole('button', { name: 'Open Card Bounty' })).toBeVisible()
  })

  it('uses the same full-viewport stage model as the HA presentation', () => {
    const { container } = render(<PresentationDeck />)
    const viewport = container.querySelector<HTMLElement>('[data-presentation-viewport]')!
    expect(viewport).toHaveAttribute('data-viewport-supported', 'true')
    expect(viewport).not.toHaveAttribute('style')
    expect(screen.queryByRole('status', { name: 'Desktop presentation notice' })).not.toBeInTheDocument()
  })

  it('handles closing-menu anchors in place and scopes the landscape override to mount', () => {
    setRoute('#slide-14')
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
    expect(stageCss).toMatch(/\.stageFrame\s*{[^}]*width:\s*100vw[^}]*height:\s*100vh/)
    expect(stageCss).toMatch(/\.stage\s*{[^}]*width:\s*100%[^}]*height:\s*100%/)
    expect(stageCss).not.toMatch(/transform:\s*scale\(var\(--deck-scale\)\)/)
    expect(stageCss).toMatch(/\.deckChrome\s*{[^}]*bottom:\s*80px/)
    expect(stageCss).toMatch(/\.deckChrome\s*{[^}]*height:\s*18px/)
    expect(stageCss).toMatch(/\.deckChrome\s*{[^}]*max-width:\s*1280px/)
    expect(stageCss).toMatch(/\.deckChrome\s*{[^}]*padding:\s*0 80px/)
    expect(stageCss).toMatch(/\.deckChrome button\s*{[^}]*color:\s*#666/)
    expect(stageCss).toMatch(/\.deckChrome button\s*{[^}]*font-weight:\s*500/)
    expect(stageCss).toMatch(/\.deckChrome button\s*{[^}]*letter-spacing:\s*0\.14em/)
    expect(stageCss).toMatch(/\[data-current-slide="slide-10"\] \.deckChrome button[\s\S]*?color:\s*rgba\(255, 255, 255, 0\.84\)/)
    expect(stageCss).toMatch(/\[data-current-slide="slide-10"\] \.deckChrome p[\s\S]*?color:\s*rgba\(255, 255, 255, 0\.84\)/)
    expect(stageCss).toMatch(/\[data-current-slide="slide-10"\] \.deckChrome\s*{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto/)
    expect(stageCss).not.toMatch(/\.deckChrome button\s*{[^}]*min-height:/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]\s*{[^}]*border-width:\s*1\.5px/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]\s*{[^}]*border-color:\s*rgba\(30, 123, 168, 0\.65\)/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]\s*{[^}]*background:\s*transparent/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]\s*{[^}]*box-shadow:\s*none/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]:hover[\s\S]*?background:\s*linear-gradient/)
    expect(stageCss).toMatch(/\[data-blue-surface="true"\]:hover[\s\S]*?box-shadow:\s*0 2px 0 rgba\(30, 123, 168, 0\.16\)/)
    expect(stageCss).toMatch(/\[data-approach-pill="true"\]:hover[\s\S]*?background:\s*transparent/)
    expect(stageCss).toMatch(/\[data-approach-pill="true"\]:hover[\s\S]*?box-shadow:\s*none/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]\s*{[^}]*border-width:\s*1\.5px/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]\s*{[^}]*border-color:\s*rgba\(144, 57, 0, 0\.65\)/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]\s*{[^}]*background:\s*transparent/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]\s*{[^}]*box-shadow:\s*none/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]:hover[\s\S]*?background:\s*linear-gradient/)
    expect(stageCss).toMatch(/\[data-wood-surface="true"\]:hover[\s\S]*?box-shadow:\s*0 2px 0 rgba\(144, 57, 0, 0\.3\)/)
    expect(stageCss).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.slide\s*{[\s\S]*?transition:\s*none/,
    )
    expect(stageCss).not.toMatch(/\.desktopNotice\s*{/)
    expect(globalCss).toMatch(
      /body\.ma-presentation-active\s+\.landscape-guard\s*{[^}]*display:\s*none\s*!important/,
    )
  })

  it('keeps standard non-hero slides on the shared HA shell and title geometry', () => {
    slideRegistry.slice(1, -1).filter(({ id }) => id !== 'slide-10').forEach(({ Component, id }) => {
      const rendered = render(<Component slideKey={id} />)
      const shell = rendered.container.querySelector('[data-slide-shell="true"]')!
      const heading = shell.querySelector('h2')!
      const titleSizeClasses = heading.className.split(/\s+/).filter((token) => /^text-\[\d+px\]$/.test(token))

      expect(shell.className.split(/\s+/).some((token) => /^!p[trbyxse]?-/i.test(token))).toBe(false)
      expect(titleSizeClasses).toEqual(['text-[64px]'])
      rendered.unmount()
    })
  })
})
