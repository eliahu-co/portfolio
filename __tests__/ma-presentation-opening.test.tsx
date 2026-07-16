import { fireEvent, render, screen, within } from '@testing-library/react'
import { APPROACH_STEPS, CONCEPTS } from '@/app/MA-HomeAssignment/presentation/deckData'
import Slide01Cover from '@/app/MA-HomeAssignment/presentation/slides/Slide01Cover'
import Slide02About from '@/app/MA-HomeAssignment/presentation/slides/Slide02About'
import Slide03Approach from '@/app/MA-HomeAssignment/presentation/slides/Slide03Approach'
import Slide04Economy from '@/app/MA-HomeAssignment/presentation/slides/Slide04Economy'
import Slide05ThreeBets from '@/app/MA-HomeAssignment/presentation/slides/Slide05ThreeBets'
import Slide06HometownThesis from '@/app/MA-HomeAssignment/presentation/slides/Slide06HometownThesis'
import Slide07HometownMechanics from '@/app/MA-HomeAssignment/presentation/slides/Slide07HometownMechanics'
import Slide08CardBountyThesis from '@/app/MA-HomeAssignment/presentation/slides/Slide08CardBountyThesis'
import Slide09CardBountyMechanics from '@/app/MA-HomeAssignment/presentation/slides/Slide09CardBountyMechanics'
import Slide10HotTrailThesis from '@/app/MA-HomeAssignment/presentation/slides/Slide10HotTrailThesis'
import Slide11HotTrailMechanics from '@/app/MA-HomeAssignment/presentation/slides/Slide11HotTrailMechanics'

const OPENING_SLIDES = [
  { Component: Slide01Cover, level: 1, headline: 'Increasing ARPDAU' },
  { Component: Slide02About, level: 2, headline: 'Eliahu Cohen' },
  { Component: Slide03Approach, level: 2, headline: 'Approach' },
  { Component: Slide04Economy, level: 2, headline: 'Coin Master economy' },
  { Component: Slide05ThreeBets, level: 2, headline: 'Three bets' },
  { Component: Slide06HometownThesis, level: 2, headline: 'Hometown thesis' },
  { Component: Slide07HometownMechanics, level: 2, headline: 'Hometown mechanics' },
  { Component: Slide08CardBountyThesis, level: 2, headline: 'Card Bounty thesis' },
  { Component: Slide09CardBountyMechanics, level: 2, headline: 'Card Bounty mechanics' },
  { Component: Slide10HotTrailThesis, level: 2, headline: 'Hot Trail thesis' },
  { Component: Slide11HotTrailMechanics, level: 2, headline: 'Hot Trail mechanics' },
] as const

describe('MA presentation opening chapter', () => {
  it('keeps slides 1 through 11 in the approved headline sequence', () => {
    const { container } = render(
      <div>
        {OPENING_SLIDES.map(({ Component }, index) => (
          <section key={index} data-opening-position={index + 1}>
            <Component slideKey={`opening-${index + 1}`} />
          </section>
        ))}
      </div>,
    )

    const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-opening-position]'))
    expect(sections).toHaveLength(11)
    expect(sections.map((section) => Number(section.getAttribute('data-opening-position')))).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ])

    OPENING_SLIDES.forEach(({ level, headline }, index) => {
      expect(within(sections[index]).getByRole('heading', { level, name: headline })).toBeVisible()
    })
  })

  it('opens with the approved Coin Master cover and no slide-local control', () => {
    const { container } = render(<Slide01Cover slideKey="cover" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Increasing ARPDAU' })).toBeVisible()
    expect(screen.getByText('Product Manager - Home Assignment')).toBeVisible()
    expect(screen.getByText('Eliahu Cohen')).toBeVisible()
    expect(screen.getByRole('img', { name: 'Coin Master' })).toHaveAttribute(
      'src',
      expect.stringContaining('/coinmaster/coinmaster-logo.webp'),
    )
    expect(container.querySelector('img[src="/coinmaster-sky.webp"]')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('preserves the exact About content, family photo, and Brazil to Israel timeline', () => {
    render(<Slide02About slideKey="about-static" />)

    expect(screen.getByRole('heading', { level: 2, name: 'Eliahu Cohen' })).toBeVisible()
    expect(screen.getByText('Architect, Product Manager')).toBeVisible()
    expect(screen.getByRole('img', { name: 'Eliahu and family' })).toHaveAttribute(
      'src',
      expect.stringContaining('/presentation/family.jpeg'),
    )

    const timeline = screen.getByLabelText('Personal timeline')
    expect(within(timeline).getAllByText(/Brazil|Holland|Israel/).map((node) => node.textContent)).toEqual([
      'Brazil',
      'Holland',
      'Israel',
    ])

    const bullets = [
      '31 years old',
      'Married',
      'Crossfitter',
      '7 years of Aliyah',
      '10 years in the AEC industry',
      '6 years in ConTech',
    ]
    const aboutList = screen.getByLabelText('About Eliahu')
    expect(within(aboutList).getAllByRole('listitem').map((item) => item.textContent?.replace(/^\d/, ''))).toEqual(
      bullets,
    )
  })

  it('reveals Eduardo equally on Brazil hover and focus, then resets for a new slide key', () => {
    const { rerender } = render(<Slide02About slideKey="about-a" />)
    const brazil = screen.getByRole('button', { name: 'Brazil' })

    expect(brazil).toHaveAttribute('data-deck-interactive', 'true')
    expect(brazil).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('heading', { level: 2, name: 'Eliahu Cohen' })).toBeVisible()

    fireEvent.mouseEnter(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('heading', { level: 2, name: 'Eduardo Cohen' })).toBeVisible()

    fireEvent.mouseLeave(brazil)
    expect(screen.getByRole('heading', { level: 2, name: 'Eliahu Cohen' })).toBeVisible()

    fireEvent.focus(brazil)
    expect(screen.getByRole('heading', { level: 2, name: 'Eduardo Cohen' })).toBeVisible()

    rerender(<Slide02About slideKey="about-b" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Eliahu Cohen' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Brazil' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the six-step approach ribbon and keeps supporting evidence additive', () => {
    const { rerender } = render(<Slide03Approach slideKey="approach-a" />)
    const ribbon = screen.getByLabelText('Product approach')
    const stepButtons = within(ribbon).getAllByRole('button')

    expect(stepButtons.map((button) => button.textContent)).toEqual(
      APPROACH_STEPS.map(({ label }) => label),
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    fireEvent.mouseEnter(stepButtons[0])
    expect(screen.getByRole('status')).toHaveTextContent(APPROACH_STEPS[0].annotation)
    expect(screen.getByRole('status')).toHaveTextContent(APPROACH_STEPS[0].output)

    fireEvent.mouseLeave(stepButtons[0])
    fireEvent.focus(stepButtons[1])
    expect(screen.getByRole('status')).toHaveTextContent(APPROACH_STEPS[1].annotation)

    rerender(<Slide03Approach slideKey="approach-b" />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(within(screen.getByLabelText('Product approach')).getAllByRole('button')).toHaveLength(6)
  })

  it('shows the complete economy before presenting the three monetization paths', () => {
    render(<Slide04Economy slideKey="economy" />)

    for (const system of ['Spins', 'Coins', 'Villages', 'Chests', 'Collections', 'LiveOps', 'Social', 'PvP']) {
      expect(screen.getByRole('button', { name: system })).toBeVisible()
    }
    for (const path of [
      'New spend surface',
      'Increased resource demand',
      'Purchase frequency through re-engagement',
    ]) {
      expect(screen.getByText(path)).toBeVisible()
    }
  })

  it('presents Hometown, Card Bounty, and Hot Trail in neutral order', () => {
    render(<Slide05ThreeBets slideKey="three-bets" />)
    const overview = screen.getByLabelText('Three product concepts')

    expect(within(overview).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Hometown',
      'Card Bounty',
      'Hot Trail',
    ])
    expect(within(overview).queryByText(/winner|first place|medal|33\.3|20\.0|9\.0/i)).not.toBeInTheDocument()
  })

  it.each([
    ['Hometown', Slide06HometownThesis, CONCEPTS[0]],
    ['Card Bounty', Slide08CardBountyThesis, CONCEPTS[1]],
    ['Hot Trail', Slide10HotTrailThesis, CONCEPTS[2]],
  ] as const)('frames %s as an image-led product thesis', (title, Component, concept) => {
    render(<Component slideKey={`${concept.id}-thesis`} />)

    expect(screen.getByRole('heading', { level: 2, name: `${title} thesis` })).toBeVisible()
    expect(screen.getByRole('img', { name: `${title} concept mockup` })).toHaveAttribute(
      'src',
      expect.stringContaining(concept.mockup),
    )
    expect(screen.getByText(concept.thesis)).toBeVisible()
    expect(screen.getByText(concept.monetizationSummary)).toBeVisible()
    expect(screen.queryByRole('heading', { name: /problem/i })).not.toBeInTheDocument()
  })

  it.each([
    ['Hometown', Slide07HometownMechanics, CONCEPTS[0]],
    ['Card Bounty', Slide09CardBountyMechanics, CONCEPTS[1]],
    ['Hot Trail', Slide11HotTrailMechanics, CONCEPTS[2]],
  ] as const)('keeps the full %s mechanics, motivations, and risks visible', (title, Component, concept) => {
    render(<Component slideKey={`${concept.id}-mechanics`} />)

    expect(screen.getByRole('heading', { level: 2, name: `${title} mechanics` })).toBeVisible()
    const loop = screen.getByLabelText(`${title} mechanics loop`)
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
    expect(screen.queryByRole('heading', { name: /problem/i })).not.toBeInTheDocument()
  })
})
