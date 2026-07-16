import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { SCOPE_IN, SCOPE_OUT } from '@/app/MA-HomeAssignment/content/mvp'
import {
  PLAYER_FLOW,
  SCOPE_STORIES,
} from '@/app/MA-HomeAssignment/presentation/deckData'
import Slide15PlayerFlow from '@/app/MA-HomeAssignment/presentation/slides/Slide15PlayerFlow'
import Slide16MvpScope from '@/app/MA-HomeAssignment/presentation/slides/Slide16MvpScope'
import Slide17Prototype from '@/app/MA-HomeAssignment/presentation/slides/Slide17Prototype'

function requiredElement(container: HTMLElement, selector: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(selector)
  expect(element).not.toBeNull()
  return element!
}

function flowParts(container: HTMLElement) {
  return {
    nodes: Array.from(container.querySelectorAll<HTMLElement>('[data-flow-node]')),
    connectors: Array.from(container.querySelectorAll<HTMLElement>('[data-flow-connector]')),
    rail: requiredElement(container, '[data-player-flow-detail-rail]'),
  }
}

describe('MA presentation Card Bounty deep dive', () => {
  it('keeps six nodes visible and marks the complete path to the hovered or focused stage', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="player-flow-path" />)
    const flow = screen.getByRole('list', { name: 'Card Bounty player flow' })
    const controls = within(flow).getAllByRole('button')
    const { nodes, connectors, rail } = flowParts(container)

    expect(screen.getByRole('heading', { level: 2, name: 'Card Bounty player flow' }))
      .toBeVisible()
    expect(controls.map((control) => control.textContent)).toEqual(
      PLAYER_FLOW.map(({ label }) => label),
    )
    expect(nodes).toHaveLength(6)
    expect(connectors).toHaveLength(5)
    expect(rail).toHaveClass('h-[104px]')
    expect(container.querySelectorAll('[data-interactive-callout="true"]')).toHaveLength(0)

    fireEvent.mouseEnter(controls[3])

    nodes.forEach((node, index) => {
      expect(node).toHaveAttribute('data-path-active', index <= 3 ? 'true' : 'false')
      expect(node).toHaveAttribute('data-node-active', index === 3 ? 'true' : 'false')
    })
    connectors.forEach((connector, index) => {
      expect(connector).toHaveAttribute('data-path-active', index < 3 ? 'true' : 'false')
    })
    expect(controls[3]).toHaveAttribute('aria-expanded', 'true')
    expect(within(rail).getByRole('status')).toHaveTextContent(PLAYER_FLOW[3].branchNote)
    expect(rail.querySelectorAll('[data-player-flow-detail]')).toHaveLength(1)
    controls.forEach((control) => expect(control).toBeVisible())

    fireEvent.mouseLeave(controls[3])
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    nodes.forEach((node) => expect(node).toHaveAttribute('data-path-active', 'false'))

    fireEvent.focus(controls[1])
    expect(within(rail).getByRole('status')).toHaveTextContent(PLAYER_FLOW[1].branchNote)
    nodes.forEach((node, index) => {
      expect(node).toHaveAttribute('data-path-active', index <= 1 ? 'true' : 'false')
    })
    connectors.forEach((connector, index) => {
      expect(connector).toHaveAttribute('data-path-active', index < 1 ? 'true' : 'false')
    })
  })

  it('keeps focus-derived flow detail through mouseleave, avoids click pins, and resets by slide key', () => {
    const { container, rerender } = render(<Slide15PlayerFlow slideKey="flow-a" />)
    const controls = within(screen.getByRole('list', { name: 'Card Bounty player flow' }))
      .getAllByRole('button')
    const { rail } = flowParts(container)

    fireEvent.focus(controls[2])
    fireEvent.mouseEnter(controls[4])
    expect(within(rail).getAllByRole('status')).toHaveLength(1)
    expect(within(rail).getByRole('status')).toHaveTextContent(PLAYER_FLOW[2].branchNote)

    fireEvent.mouseLeave(controls[4])
    expect(within(rail).getByRole('status')).toHaveTextContent(PLAYER_FLOW[2].branchNote)

    rerender(<Slide15PlayerFlow slideKey="flow-b" />)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    flowParts(container).nodes.forEach((node) => {
      expect(node).toHaveAttribute('data-path-active', 'false')
    })

    const resetControls = within(screen.getByRole('list', { name: 'Card Bounty player flow' }))
      .getAllByRole('button')
    fireEvent.click(resetControls[0])
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    resetControls.forEach((control) => expect(control).not.toHaveAttribute('aria-pressed'))
  })

  it('prints one compact static player-flow summary instead of six independent callouts', () => {
    const { container } = render(<Slide15PlayerFlow slideKey="player-flow-print" />)
    const summary = requiredElement(container, '[data-flow-print-summary="true"]')
    const items = Array.from(summary.querySelectorAll<HTMLElement>('[data-flow-print-item]'))

    expect(summary).not.toBeNull()
    expect(summary).toHaveClass('flowPrintSummary')
    expect(container.querySelectorAll('[data-print-details="true"]')).toHaveLength(1)
    expect(items).toHaveLength(PLAYER_FLOW.length)
    PLAYER_FLOW.forEach(({ label, branchNote }, index) => {
      expect(items[index]).toHaveTextContent(label)
      expect(items[index]).toHaveTextContent(branchNote)
    })
  })

  it('keeps every canonical scope requirement fixed while one shared rail reveals rationales', () => {
    const { container } = render(<Slide16MvpScope slideKey="scope-rail" />)
    const screenBoard = requiredElement(container, '[data-scope-screen-board="true"]')
    const inScope = within(screenBoard).getByRole('list', { name: 'In scope' })
    const outOfScope = within(screenBoard).getByRole('list', { name: 'Out of scope' })
    const inControls = within(inScope).getAllByRole('button')
    const outControls = within(outOfScope).getAllByRole('button')
    const rail = requiredElement(container, '[data-scope-rationale-rail="true"]')

    expect(screen.getByRole('heading', { level: 2, name: 'MVP scope' })).toBeVisible()
    expect(screenBoard).toHaveClass('scopeScreenBoard')
    expect(inControls.map((control) => control.textContent)).toEqual(SCOPE_IN)
    expect(outControls.map((control) => control.textContent)).toEqual(SCOPE_OUT)
    expect(inControls).toHaveLength(8)
    expect(outControls).toHaveLength(5)
    expect(rail).toHaveClass('h-[76px]')
    expect(container.querySelectorAll('[data-interactive-callout="true"]')).toHaveLength(0)

    fireEvent.mouseEnter(inControls[5])
    expect(within(rail).getByRole('status')).toHaveTextContent(SCOPE_STORIES.in[5].rationale)
    expect(within(rail).getByRole('status')).toHaveTextContent(SCOPE_IN[5])
    expect(within(inScope).getAllByRole('button')).toHaveLength(8)
    expect(within(outOfScope).getAllByRole('button')).toHaveLength(5)
    expect(within(inScope).queryByRole('status')).not.toBeInTheDocument()

    fireEvent.mouseLeave(inControls[5])
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()

    fireEvent.focus(outControls[2])
    expect(within(rail).getByRole('status')).toHaveTextContent(SCOPE_STORIES.out[2].rationale)
    expect(outControls[2]).toHaveAttribute('data-active', 'true')
  })

  it('preserves focused scope detail across pointer exit and clears controlled state on slide reset', () => {
    const { container, rerender } = render(<Slide16MvpScope slideKey="scope-a" />)
    const board = requiredElement(container, '[data-scope-screen-board="true"]')
    const rail = requiredElement(container, '[data-scope-rationale-rail="true"]')
    const inControls = within(within(board).getByRole('list', { name: 'In scope' }))
      .getAllByRole('button')
    const outControls = within(within(board).getByRole('list', { name: 'Out of scope' }))
      .getAllByRole('button')

    fireEvent.focus(inControls[3])
    fireEvent.mouseEnter(outControls[1])
    expect(within(rail).getAllByRole('status')).toHaveLength(1)
    expect(within(rail).getByRole('status')).toHaveTextContent(SCOPE_STORIES.in[3].rationale)

    fireEvent.mouseLeave(outControls[1])
    expect(within(rail).getByRole('status')).toHaveTextContent(SCOPE_STORIES.in[3].rationale)

    rerender(<Slide16MvpScope slideKey="scope-b" />)
    expect(within(rail).queryByRole('status')).not.toBeInTheDocument()
    Array.from(board.querySelectorAll<HTMLElement>('button')).forEach((control) => {
      expect(control).toHaveAttribute('data-active', 'false')
      expect(control).not.toHaveAttribute('aria-pressed')
    })
  })

  it('prints all scope copy in a compact task-specific two-column grid', () => {
    const { container } = render(<Slide16MvpScope slideKey="scope-print" />)
    const screenBoard = requiredElement(container, '[data-scope-screen-board="true"]')
    const summary = requiredElement(container, '[data-scope-print-summary="true"]')
    const entries = Array.from(summary.querySelectorAll<HTMLElement>('[data-scope-print-entry]'))
    const css = readFileSync(resolve(
      process.cwd(),
      'app/MA-HomeAssignment/presentation/PresentationStage.module.css',
    ), 'utf8')
    const printCss = css.slice(css.indexOf('@media print'))
    const stories = [...SCOPE_STORIES.in, ...SCOPE_STORIES.out]

    expect(screenBoard).toHaveClass('scopeScreenBoard')
    expect(summary).toHaveClass('scopePrintGrid')
    expect(summary.querySelectorAll('[data-scope-print-column]')).toHaveLength(2)
    expect(entries).toHaveLength(13)
    stories.forEach(({ requirement, rationale }, index) => {
      expect(entries[index]).toHaveTextContent(requirement)
      expect(entries[index]).toHaveTextContent(rationale)
    })
    expect(printCss).toMatch(
      /\.scopeScreenBoard\s*{[\s\S]*?display:\s*none\s*!important;/,
    )
    expect(printCss).toMatch(
      /\.printDetails\.scopePrintGrid\s*{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);[\s\S]*?gap:\s*\d+px;/,
    )
  })

  it('makes the local prototype a dominant intentional crop with the approved palette and CTA', () => {
    const { container } = render(<Slide17Prototype slideKey="prototype" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Prototype' })).toBeVisible()
    expect(container.querySelector('img[src="/coinmaster-sky.webp"]')).toBeInTheDocument()
    const prototype = container.querySelector<HTMLImageElement>(
      'img[src="/coinmaster/prototype.webp"]',
    )!
    const viewport = requiredElement(container, '[data-prototype-viewport="true"]')

    expect(prototype).toHaveClass('object-cover', 'object-[center_43%]')
    expect(prototype).not.toHaveClass('object-contain')
    expect(viewport).toHaveClass('h-[390px]')
    expect(screen.getByText('Clickable product walkthrough')).toHaveClass('text-cm-gold')
    expect(container.innerHTML).not.toContain('cm-gold-bright')

    const cta = screen.getByRole('link', { name: 'Open interactive prototype' })
    expect(cta).toHaveAttribute('href', '/MA-HomeAssignment/demo')
    expect(cta).toHaveAttribute('target', '_blank')
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer')
    expect(cta).toHaveClass('bg-cm-gold', 'text-[16px]')
    expect(screen.getAllByRole('link')).toEqual([cta])
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
  })
})
