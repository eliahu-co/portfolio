import { fireEvent, render, screen, within } from '@testing-library/react'
import { CONCEPTS } from '@/app/MA-HomeAssignment/presentation/deckData'
import { ConceptOverview } from '@/app/MA-HomeAssignment/presentation/components/ConceptOverview'
import { ConceptThesis } from '@/app/MA-HomeAssignment/presentation/components/ConceptThesis'
import { EconomyMap } from '@/app/MA-HomeAssignment/presentation/components/EconomyMap'
import { InteractiveCallout } from '@/app/MA-HomeAssignment/presentation/components/InteractiveCallout'
import { MechanicsLoop } from '@/app/MA-HomeAssignment/presentation/components/MechanicsLoop'

describe('InteractiveCallout', () => {
  it('uses a real button and resets supporting detail when the slide changes', () => {
    const { rerender } = render(
      <InteractiveCallout
        id="callout-detail"
        label="Visible label"
        detail="Supporting detail"
        slideKey="first"
      />,
    )

    const button = screen.getByRole('button', { name: 'Visible label' })
    expect(button).toBeVisible()
    expect(button).toHaveAttribute('type', 'button')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    fireEvent.mouseEnter(button)
    expect(screen.getByRole('status')).toHaveTextContent('Supporting detail')

    fireEvent.mouseLeave(button)
    fireEvent.focus(button)
    expect(screen.getByRole('status')).toHaveTextContent('Supporting detail')

    rerender(
      <InteractiveCallout
        id="callout-detail"
        label="Visible label"
        detail="Supporting detail"
        slideKey="second"
      />,
    )

    expect(screen.getByRole('button', { name: 'Visible label' })).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

describe('EconomyMap', () => {
  it('keeps the complete economy and all three ARPDAU paths visible during interaction', () => {
    const { rerender } = render(<EconomyMap slideKey="economy-a" />)

    for (const system of [
      'Spins',
      'Coins',
      'Villages',
      'Chests',
      'Collections',
      'LiveOps',
      'Social',
      'PvP',
    ]) {
      expect(screen.getByRole('button', { name: system })).toBeVisible()
    }

    for (const relationship of [
      'Spins → Coins',
      'Coins → Villages',
      'Coins → Chests',
      'Chests → Collections',
      'Collections → Spins',
      'LiveOps → resource demand',
      'Social → ownership & status',
      'PvP → loss & re-engagement',
    ]) {
      expect(screen.getByText(relationship)).toBeVisible()
    }

    for (const path of [
      'New spend surface',
      'Increased resource demand',
      'Purchase frequency through re-engagement',
    ]) {
      expect(screen.getByText(path)).toBeVisible()
    }

    const spins = screen.getByRole('button', { name: 'Spins' })
    fireEvent.mouseEnter(spins)
    expect(screen.getByRole('status')).toHaveTextContent('core input')
    expect(screen.getByRole('button', { name: 'Collections' })).toBeVisible()

    fireEvent.mouseLeave(spins)
    const pvp = screen.getByRole('button', { name: 'PvP' })
    fireEvent.focus(pvp)
    expect(screen.getByRole('status')).toHaveTextContent('Raids create the loss trigger')

    rerender(<EconomyMap slideKey="economy-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('Coins → Chests')).toBeVisible()
  })
})

describe('ConceptOverview', () => {
  it('shows three neutral theses and reveals loop previews on hover and focus', () => {
    const { rerender } = render(
      <ConceptOverview concepts={CONCEPTS} slideKey="overview-a" />,
    )

    CONCEPTS.forEach((concept) => {
      expect(screen.getByRole('heading', { level: 3, name: concept.title })).toBeVisible()
      expect(screen.getByText(concept.thesis)).toBeVisible()
      expect(screen.getByText(concept.monetizationSummary)).toBeVisible()
    })
    expect(screen.queryByText(/winner|first place|33\.3/i)).not.toBeInTheDocument()

    const hometown = screen.getByRole('button', { name: 'Preview Hometown loop' })
    fireEvent.mouseEnter(hometown)
    expect(screen.getByRole('status')).toHaveTextContent(CONCEPTS[0].loop.steps[0].label)

    fireEvent.mouseLeave(hometown)
    const bounty = screen.getByRole('button', { name: 'Preview Card Bounty loop' })
    fireEvent.focus(bounty)
    expect(screen.getByRole('status')).toHaveTextContent(CONCEPTS[1].loop.steps[0].label)

    rerender(<ConceptOverview concepts={CONCEPTS} slideKey="overview-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText(CONCEPTS[1].thesis)).toBeVisible()
  })
})

describe('ConceptThesis', () => {
  it('keeps the image-led thesis visible while label detail reveals and resets', () => {
    const concept = CONCEPTS[0]
    const { rerender } = render(
      <ConceptThesis concept={concept} slideKey="thesis-a" />,
    )

    expect(screen.getByRole('img', { name: 'Hometown concept mockup' })).toHaveAttribute(
      'src',
      expect.stringContaining(concept.mockup),
    )
    expect(screen.getByText(concept.thesis)).toBeVisible()
    expect(screen.getByText(concept.monetizationSummary)).toBeVisible()

    const firstReveal = screen.getByRole('button', { name: concept.reveals[0].label })
    fireEvent.mouseEnter(firstReveal)
    expect(screen.getByRole('status')).toHaveTextContent(concept.reveals[0].detail)

    fireEvent.mouseLeave(firstReveal)
    const secondReveal = screen.getByRole('button', { name: concept.reveals[1].label })
    fireEvent.focus(secondReveal)
    expect(screen.getByRole('status')).toHaveTextContent(concept.reveals[1].detail)

    rerender(<ConceptThesis concept={concept} slideKey="thesis-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText(concept.thesis)).toBeVisible()
  })
})

describe('MechanicsLoop', () => {
  it('keeps the full loop, motivations, and risks visible while detail reveals and resets', () => {
    const concept = CONCEPTS[1]
    const { rerender } = render(
      <MechanicsLoop concept={concept} slideKey="mechanics-a" />,
    )

    const loop = screen.getByLabelText('Card Bounty mechanics loop')
    concept.loop.steps.forEach((step) => {
      expect(within(loop).getByRole('button', { name: step.label })).toBeVisible()
    })
    concept.values.forEach((value) => {
      expect(screen.getByRole('button', { name: value.title })).toBeVisible()
    })
    concept.risks.forEach((risk) => {
      expect(screen.getByRole('button', { name: risk.title })).toBeVisible()
    })
    expect(screen.getByText(concept.monetizationSummary)).toBeVisible()

    const firstStep = within(loop).getByRole('button', {
      name: concept.loop.steps[0].label,
    })
    fireEvent.mouseEnter(firstStep)
    expect(screen.getByRole('status')).toHaveTextContent(concept.loopImplications[0])

    fireEvent.mouseLeave(firstStep)
    const firstRisk = screen.getByRole('button', { name: concept.risks[0].title })
    fireEvent.focus(firstRisk)
    expect(screen.getByRole('status')).toHaveTextContent(concept.risks[0].body)

    rerender(<MechanicsLoop concept={concept} slideKey="mechanics-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    concept.loop.steps.forEach((step) => {
      expect(within(screen.getByLabelText('Card Bounty mechanics loop')).getByRole('button', {
        name: step.label,
      })).toBeVisible()
    })
  })
})
