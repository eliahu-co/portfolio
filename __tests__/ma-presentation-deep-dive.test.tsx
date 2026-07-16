import { fireEvent, render, screen, within } from '@testing-library/react'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import {
  PLAYER_FLOW,
  SCOPE_STORIES,
} from '@/app/MA-HomeAssignment/presentation/deckData'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'
import Slide16MvpScope from '@/app/MA-HomeAssignment/presentation/slides/Slide16MvpScope'
import Slide17Prototype from '@/app/MA-HomeAssignment/presentation/slides/Slide17Prototype'

describe('MA presentation Card Bounty deep dive', () => {
  it('keeps all six player-flow stages visible while hover and focus reveal one branch note', () => {
    render(<Slide15PlayerFlow slideKey="player-flow" />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Card Bounty player flow' }),
    ).toBeVisible()
    const flow = screen.getByRole('list', { name: 'Card Bounty player flow' })
    const controls = within(flow).getAllByRole('button')

    expect(controls.map((control) => control.textContent)).toEqual(
      PLAYER_FLOW.map(({ label }) => label),
    )
    expect(controls).toHaveLength(6)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    PLAYER_FLOW.forEach(({ branchNote }, index) => {
      const control = controls[index]
      const stage = control.closest<HTMLElement>('[data-interactive-callout="true"]')!

      expect(control).toBeVisible()
      expect(control).toHaveAttribute('data-deck-interactive', 'true')
      expect(stage).toHaveAttribute('data-active', 'false')

      fireEvent.mouseEnter(control)
      expect(control).toHaveAttribute('aria-expanded', 'true')
      expect(stage).toHaveAttribute('data-active', 'true')
      expect(screen.getByRole('status')).toHaveTextContent(branchNote)
      expect(within(flow).getAllByRole('button')).toHaveLength(6)
      controls.forEach((visibleControl) => expect(visibleControl).toBeVisible())

      fireEvent.mouseLeave(control)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(control)
      expect(control).toHaveAttribute('aria-expanded', 'true')
      expect(stage).toHaveAttribute('data-active', 'true')
      expect(screen.getByRole('status')).toHaveTextContent(branchNote)

      fireEvent.blur(control)
      expect(control).toHaveAttribute('aria-expanded', 'false')
      expect(stage).toHaveAttribute('data-active', 'false')
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('exposes every player-flow branch note in the print-only summary', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="player-flow-print" />)
    const printNotes = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-print-details="true"] [data-flow-branch-note]',
      ),
    )

    expect(printNotes).toHaveLength(PLAYER_FLOW.length)
    expect(printNotes.map((note) => note.textContent)).toEqual(
      PLAYER_FLOW.map(({ branchNote }) => branchNote),
    )
    printNotes.forEach((note) => {
      expect(note.closest('[data-print-details="true"]')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('keeps all canonical MVP requirements visible in two columns and reveals additive rationales', () => {
    const { container } = render(<Slide16MvpScope slideKey="mvp-scope" />)

    expect(screen.getByRole('heading', { level: 2, name: 'MVP scope' })).toBeVisible()
    const inScope = screen.getByRole('list', { name: 'In scope' })
    const outOfScope = screen.getByRole('list', { name: 'Out of scope' })
    const inControls = within(inScope).getAllByRole('button')
    const outControls = within(outOfScope).getAllByRole('button')

    expect(inControls.map((control) => control.textContent)).toEqual(SCOPE_IN)
    expect(outControls.map((control) => control.textContent)).toEqual(SCOPE_OUT)
    expect(inControls).toHaveLength(8)
    expect(outControls).toHaveLength(5)

    const stories = [...SCOPE_STORIES.in, ...SCOPE_STORIES.out]
    const controls = [...inControls, ...outControls]

    stories.forEach(({ requirement, rationale }, index) => {
      const control = controls[index]

      expect(control).toBeVisible()
      expect(control).toHaveAccessibleName(requirement)

      fireEvent.mouseEnter(control)
      expect(screen.getByRole('status')).toHaveTextContent(rationale)
      expect(control).toBeVisible()
      expect(control).toHaveTextContent(requirement)

      fireEvent.mouseLeave(control)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()

      fireEvent.focus(control)
      expect(screen.getByRole('status')).toHaveTextContent(rationale)
      expect(control).toHaveTextContent(requirement)

      fireEvent.blur(control)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    const printRationales = Array.from(
      container.querySelectorAll<HTMLElement>(
        '[data-print-details="true"] [data-scope-rationale]',
      ),
    )
    expect(printRationales).toHaveLength(stories.length)
    expect(printRationales.map((detail) => detail.textContent)).toEqual(
      stories.map(({ rationale }) => rationale),
    )
  })

  it('uses the approved local images and opens only the interactive demo in a safe new tab', () => {
    const { container } = render(<Slide17Prototype slideKey="prototype" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Prototype' })).toBeVisible()
    expect(container.querySelector('img[src="/coinmaster-sky.webp"]')).toBeInTheDocument()
    expect(container.querySelector('img[src="/coinmaster/prototype.webp"]')).toBeInTheDocument()

    const cta = screen.getByRole('link', { name: 'Open interactive prototype' })
    expect(cta).toHaveAttribute('href', '/MA-HomeAssignment/demo')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(cta).toHaveClass('bg-cm-gold', 'text-[16px]')
    expect(screen.getAllByRole('link')).toEqual([cta])
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })
})
