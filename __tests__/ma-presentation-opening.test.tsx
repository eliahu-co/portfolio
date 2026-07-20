import { fireEvent, render, screen } from '@testing-library/react'
import Slide01Cover from '@/app/MA-HomeAssignment/presentation/slides/Slide01Cover'
import Slide02About from '@/app/MA-HomeAssignment/presentation/slides/Slide02About'
import Slide03Approach from '@/app/MA-HomeAssignment/presentation/slides/Slide03Approach'
import {
  SlideFeature1Intro,
  SlideFeature2Intro,
  SlideFeature3Intro,
} from '@/app/MA-HomeAssignment/presentation/slides/FeatureIntroSlides'

describe('MA presentation opening chapter', () => {
  it.each([
    [SlideFeature1Intro, ['Urgency', 'Recovery and Revenge', 'Social Engine']],
    [SlideFeature2Intro, ['Agency', 'Visible Progress']],
    [SlideFeature3Intro, ['Expression and Ownership', 'Progress and Status', 'Social Recognition']],
  ])('adds the feature player motivations beneath its statement', (FeatureIntro, motivations) => {
    const { container } = render(<FeatureIntro slideKey={`feature-motivation-${motivations.join('-')}`} />)
    const motivation = container.querySelector('[data-feature-motivations="true"]')!

    expect(motivation).not.toHaveTextContent('Player motivations')
    const items = motivation.querySelectorAll('li')
    expect(items).toHaveLength(motivations.length)
    motivations.forEach((item, index) => expect(items[index]).toHaveTextContent(item))
    expect(motivation).not.toHaveTextContent(',')
    expect(motivation.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringContaining('motivation-emoji.png'),
    )
    expect(motivation.querySelector('img')).toHaveClass('h-14', 'w-14')
  })

  it('opens with the assignment outcome', () => {
    render(<Slide01Cover slideKey="slide-1" />)
    expect(screen.getByRole('heading', { name: 'Increasing ARPDAU' })).toBeVisible()
  })

  it('keeps About simple and interactive', () => {
    const { container, rerender } = render(<Slide02About slideKey="slide-2" />)
    expect(screen.getByText('Product Manager')).toBeVisible()
    expect(screen.queryByText('Architect, Product Manager')).not.toBeInTheDocument()
    expect(container.querySelectorAll('[data-ma-photo-frame="true"] img[alt="Eliahu and family"]')).toHaveLength(1)
    expect(container.querySelector('[data-ma-photo-frame="true"]')).not.toHaveClass('bg-white', 'p-1', 'shadow-[0_3px_0_rgba(144,57,0,0.28)]')
    expect(container.querySelectorAll('[data-journey-pill="true"]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-journey-pill="true"].flex-1')).toHaveLength(0)
    expect(container.querySelector('ol[aria-label="Personal timeline"]')).toHaveClass('w-fit', 'gap-8')
    expect(container.querySelectorAll('svg[data-journey-connector="true"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-journey-connector="true"][data-flow-arrow="true"]')).toHaveLength(2)
    container.querySelectorAll('[data-journey-connector="true"]').forEach((arrow) => {
      expect(arrow).toHaveClass('left-[calc(100%+6px)]')
    })
    const facts = Array.from(container.querySelectorAll('[data-flat-fact="true"]'))
    expect(facts).toHaveLength(5)
    expect(screen.queryByText('10 years in the AEC industry')).not.toBeInTheDocument()
    expect(screen.getByText('6 years in tech')).toBeVisible()
    expect(screen.queryByText('6 years in ConTech')).not.toBeInTheDocument()
    expect(container.querySelector('ul[aria-label="About Eliahu"]')).toHaveClass('grid-cols-1')
    expect(container.querySelector('ul[aria-label="About Eliahu"]')).not.toHaveClass('grid-cols-2')
    facts.forEach((fact) => {
      expect(fact.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
    })
    container.querySelectorAll('.transition-opacity').forEach((element) => {
      expect(element).toHaveClass('motion-reduce:transition-none')
    })
    const photo = () => container.querySelector('[data-ma-photo-frame="true"] img')!
    const brazil = screen.getByRole('button', { name: 'Brazil' })
    const holland = screen.getByRole('button', { name: 'Holland' })
    const israel = screen.getByRole('button', { name: 'Israel' })
    expect(brazil).not.toHaveAttribute('data-blue-surface')
    expect(container.querySelectorAll('[data-journey-surface="true"]')).toHaveLength(0)

    // idle: family photo, name reads Eliahu
    expect(photo()).toHaveAttribute('src', '/presentation/family.jpeg')
    expect(brazil).toHaveAttribute('aria-expanded', 'false')

    // hovering Brazil swaps the photo, flips the name, and marks the pill active
    fireEvent.mouseEnter(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    expect(brazil).toHaveAttribute('data-active', 'true')
    expect(holland).not.toHaveAttribute('data-active')
    expect(photo()).toHaveAttribute('src', '/coinmaster/me-brazil.jpeg')

    // sticky: leaving the pill keeps the photo, name, and active fill
    fireEvent.mouseLeave(brazil)
    expect(brazil).toHaveAttribute('aria-expanded', 'true')
    expect(brazil).toHaveAttribute('data-active', 'true')
    expect(photo()).toHaveAttribute('src', '/coinmaster/me-brazil.jpeg')

    // hovering another pill moves the active fill; Brazil's easter-egg resets
    fireEvent.mouseEnter(holland)
    expect(photo()).toHaveAttribute('src', '/coinmaster/me-holland.jpeg')
    expect(holland).toHaveAttribute('data-active', 'true')
    expect(brazil).not.toHaveAttribute('data-active')
    expect(brazil).toHaveAttribute('aria-expanded', 'false')

    // click activation supports touch devices that do not synthesize hover/focus
    fireEvent.click(brazil)
    expect(photo()).toHaveAttribute('src', '/coinmaster/me-brazil.jpeg')
    expect(brazil).toHaveAttribute('data-active', 'true')

    // Israel keeps the current family photo
    fireEvent.mouseEnter(israel)
    expect(photo()).toHaveAttribute('src', '/presentation/family.jpeg')
    expect(photo()).toHaveAttribute('alt', 'Eliahu and family')

    // changing slide resets to the idle family photo
    fireEvent.mouseEnter(brazil)
    rerender(<Slide02About slideKey="slide-2-reset" />)
    expect(screen.getByRole('button', { name: 'Brazil' })).toHaveAttribute('aria-expanded', 'false')
    expect(container.querySelector('[data-ma-photo-frame="true"] img')).toHaveAttribute('src', '/presentation/family.jpeg')
  })

  it('uses the flat approach flow and reveals the original core-loop diagram', () => {
    const approach = render(<Slide03Approach slideKey="slide-3" />)
    const approachHeading = screen.getByRole('heading', { name: 'Approach' })
    expect(approachHeading).toBeVisible()
    expect(approachHeading).toHaveClass('text-[12px]', 'font-sans', 'font-medium', 'uppercase', 'tracking-[0.14em]')
    expect(approachHeading).not.toHaveClass('text-[64px]', 'font-serif', 'font-black')
    const approachFlow = screen.getByRole('region', { name: 'Product approach' })
    expect(approachFlow).toHaveClass('mt-0')
    expect(approachFlow).not.toHaveClass('mt-16')
    expect(approach.container.querySelector('ol')!.querySelectorAll('li')).toHaveLength(7)
    expect(approach.container.querySelectorAll('[data-approach-pill="true"]')).toHaveLength(7)
    approach.container.querySelectorAll('[data-approach-pill="true"]').forEach((pill) => {
      expect(pill).not.toHaveAttribute('data-blue-surface')
      expect(pill).toHaveClass('min-h-[67px]', 'w-auto', 'shrink-0', 'whitespace-nowrap', 'font-serif', 'font-black', 'text-[34px]')
      expect(pill).not.toHaveClass('border', 'rounded-lg', 'font-normal')
      expect(pill).not.toHaveClass('hover:text-[#1E7BA8]')
    })
    expect(approach.container.querySelectorAll('svg[data-approach-connector="true"]')).toHaveLength(6)
    expect(approach.container.querySelectorAll('[data-approach-connector="true"][data-flow-arrow="true"]')).toHaveLength(6)
    approach.container.querySelectorAll('[data-approach-connector="true"]').forEach((connector) => {
      expect(connector).toHaveClass('mx-4', 'min-w-[24px]', 'flex-1')
      connector.querySelectorAll('path').forEach((path) => expect(path).toHaveAttribute('stroke', '#2D1B69'))
      expect(connector).not.toHaveClass('absolute', 'left-full', 'w-5')
    })
    approach.container.querySelectorAll('ol > li').forEach((item) => expect(item).toHaveClass('contents'))
    const playTheGame = screen.getByRole('button', { name: 'Play' })
    const mapSystems = screen.getByRole('button', { name: 'Map' })
    const playDrawing = approach.container.querySelector('[data-play-game-drawing="true"]')!
    const revealStage = approach.container.querySelector('[data-approach-reveal-stage="true"]')!
    expect(revealStage).toHaveClass('mt-8', 'mb-14', 'min-h-0', 'flex-1', 'flex', 'items-center')
    expect(revealStage).not.toHaveClass('-mt-10', 'h-[340px]')
    expect(playDrawing.querySelector('img')).toHaveClass('object-center')
    expect(playTheGame).toHaveAttribute('aria-expanded', 'false')
    expect(playDrawing).toHaveClass('opacity-0', 'pointer-events-none')
    fireEvent.mouseEnter(playTheGame)
    expect(playTheGame).toHaveAttribute('aria-expanded', 'true')
    expect(playDrawing).toHaveClass('opacity-100')
    expect(playTheGame.closest('li')).toHaveAttribute('data-approach-active', 'true')
    expect(playTheGame).not.toHaveClass('text-[#1E7BA8]')
    expect(mapSystems.closest('li')).toHaveAttribute('data-approach-active', 'false')
    expect(mapSystems).toHaveClass('opacity-30')
    approach.container.querySelectorAll('[data-approach-connector="true"]').forEach((connector) => {
      expect(connector).toHaveClass('opacity-30')
    })
    fireEvent.mouseLeave(playTheGame)
    expect(playTheGame).toHaveAttribute('aria-expanded', 'true')

    const approachDiagram = approach.container.querySelector('[data-approach-diagram="true"]')!
    const economyLegend = approach.container.querySelector('[data-economy-legend="true"]')!
    expect(approachDiagram).toHaveClass('inset-0', 'items-center')
    expect(approachDiagram).not.toHaveClass('mx-auto')
    expect(economyLegend.querySelectorAll('[data-economy-item="true"]')).toHaveLength(4)
    expect(economyLegend.querySelector('img[alt="Spin"]')).toHaveAttribute('src', expect.stringContaining('spin-emoji.png'))
    expect(economyLegend.querySelector('img[alt="Coin"]')).toHaveAttribute('src', expect.stringContaining('coin-emoji.png'))
    expect(economyLegend.querySelector('img[alt="Star"]')).toHaveAttribute('src', expect.stringContaining('star-emoji.png'))
    expect(economyLegend.querySelector('img[alt="Gem"]')).toHaveAttribute('src', expect.stringContaining('gem-emoji.png'))
    const economyItems = economyLegend.querySelectorAll('[data-economy-item="true"]')
    expect(economyItems[0]).toHaveTextContent('Primary action and monetized energy.')
    expect(economyItems[1]).toHaveTextContent('Core progression currency.')
    expect(economyItems[2]).toHaveTextContent('Status and progression signal.')
    expect(economyItems[3]).toHaveTextContent('Premium acceleration currency.')
    economyItems.forEach((item) => expect(item.textContent).not.toMatch(/^(Spin|Coin|Star|Gem) —/))
    expect(mapSystems).toHaveAttribute('aria-expanded', 'false')
    expect(approachDiagram).toHaveClass('opacity-0', 'pointer-events-none')
    fireEvent.mouseEnter(mapSystems)
    expect(mapSystems).toHaveAttribute('aria-expanded', 'true')
    expect(mapSystems.closest('li')).toHaveAttribute('data-approach-active', 'true')
    expect(mapSystems).not.toHaveClass('opacity-30')
    expect(playTheGame).toHaveClass('opacity-30')
    expect(approachDiagram).toHaveClass('opacity-100')
    expect(playTheGame).toHaveAttribute('aria-expanded', 'false')
    expect(playDrawing).toHaveClass('opacity-0')
    fireEvent.mouseLeave(mapSystems)
    expect(mapSystems).toHaveAttribute('aria-expanded', 'true')
    expect(approachDiagram).toHaveClass('opacity-100')
    const research = screen.getByRole('button', { name: 'Research' })
    const researchEvidence = approach.container.querySelector('[data-research-evidence="true"]')!
    expect(research).toHaveAttribute('aria-expanded', 'false')
    expect(researchEvidence).toHaveClass('opacity-0', 'pointer-events-none')
    expect(researchEvidence.querySelectorAll('[data-research-screenshot="true"]')).toHaveLength(5)
    researchEvidence.querySelectorAll('[data-research-screenshot="true"]').forEach((screenshot) => {
      expect(screenshot.querySelector('[data-screenshot-frame="true"]')).toHaveClass('h-fit', 'rounded-2xl', 'overflow-hidden')
      expect(screenshot.querySelector('img')).toHaveClass('object-contain')
      expect(screenshot.querySelector('img')).not.toHaveClass('object-cover')
    })
    expect(researchEvidence).toHaveTextContent('Support')
    expect(researchEvidence).toHaveTextContent('Discord')
    expect(researchEvidence).toHaveTextContent('Reddit')
    expect(researchEvidence).toHaveTextContent('Facebook')
    expect(researchEvidence).toHaveTextContent('YouTube')
    fireEvent.mouseEnter(research)
    expect(research.closest('li')).toHaveAttribute('data-approach-active', 'true')
    expect(research).toHaveAttribute('aria-expanded', 'true')
    expect(researchEvidence).toHaveClass('opacity-100')
    expect(mapSystems).toHaveClass('opacity-30')
    expect(mapSystems).toHaveAttribute('aria-expanded', 'false')
    expect(approachDiagram).toHaveClass('opacity-0')
    const benchmark = screen.getByRole('button', { name: 'Benchmark' })
    const benchmarkEvidence = approach.container.querySelector('[data-benchmark-evidence="true"]')!
    expect(benchmarkEvidence).toHaveClass('gap-0.5')
    expect(benchmark).toHaveAttribute('aria-expanded', 'false')
    expect(benchmarkEvidence).toHaveClass('opacity-0', 'pointer-events-none')
    expect(benchmarkEvidence.querySelectorAll('[data-benchmark-screenshot="true"]')).toHaveLength(3)
    benchmarkEvidence.querySelectorAll('[data-benchmark-screenshot="true"]').forEach((screenshot) => {
      // benchmark screenshots are shown in full (no crop): natural width, height-fit
      const img = screenshot.querySelector('img')!
      expect(img).toHaveClass('object-contain', 'h-full', 'w-auto', 'rounded-2xl')
      expect(img).not.toHaveClass('object-cover')
    })
    expect(benchmarkEvidence).toHaveTextContent('Royal Match')
    expect(benchmarkEvidence).toHaveTextContent('Monopoly GO!')
    expect(benchmarkEvidence).toHaveTextContent('Dice Dreams')
    fireEvent.mouseEnter(benchmark)
    expect(benchmark).toHaveAttribute('aria-expanded', 'true')
    expect(benchmarkEvidence).toHaveClass('opacity-100')
    expect(research).toHaveClass('opacity-30')
    expect(researchEvidence).toHaveClass('opacity-0')
    const create = screen.getByRole('button', { name: 'Create' })
    const createEvidence = approach.container.querySelector('[data-create-evidence="true"]')!
    expect(createEvidence).toHaveClass('opacity-0', 'pointer-events-none')
    expect(createEvidence.querySelectorAll('[data-create-concept="true"]')).toHaveLength(5)
    expect(createEvidence.querySelectorAll('[data-rejected="true"]')).toHaveLength(2)
    expect(screen.getByText('Daily Memory Card')).toHaveClass('line-through')
    expect(screen.getByText('Pet Equips')).toHaveClass('line-through')
    const hometownLogo = createEvidence.querySelector('[data-concept-logo="Hometown"]')!
    const cardBountyLogo = createEvidence.querySelector('[data-concept-logo="Card Bounty"]')!
    const hotTrailLogo = createEvidence.querySelector('[data-concept-logo="Hot Trail"]')!
    expect(hometownLogo).toHaveAttribute('src', expect.stringContaining('hometown-logo.png'))
    expect(cardBountyLogo).toHaveAttribute('src', expect.stringContaining('card-bounty-logo.png'))
    expect(hotTrailLogo).toHaveAttribute('src', expect.stringContaining('hot-trail-logo.png'))
    expect(hometownLogo).toHaveAttribute('alt', '')
    expect(cardBountyLogo).toHaveAttribute('alt', '')
    expect(hotTrailLogo).toHaveAttribute('alt', '')
    fireEvent.mouseEnter(create)
    expect(create).toHaveAttribute('aria-expanded', 'true')
    expect(createEvidence).toHaveClass('opacity-100')
    expect(screen.getByRole('heading', { level: 3, name: 'Hometown' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Card Bounty' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Hot Trail' })).toBeInTheDocument()
    // the compressed labels, so three concepts can be compared at a glance
    expect(createEvidence).toHaveTextContent('New Coin spend surface')
    expect(createEvidence).toHaveTextContent('Lift Coin demand')
    expect(createEvidence).toHaveTextContent('Lift Spin demand')
    // the full sentences stay on the single-concept slides that have room
    expect(createEvidence).not.toHaveTextContent('tied to expression, status, and Village progress')
    expect(createEvidence).not.toHaveTextContent('higher exposure to offers')
    createEvidence.querySelectorAll('[data-rejected="false"] p').forEach((summary) => {
      expect(summary).toHaveClass('text-center', 'text-[18px]')
    })
    createEvidence.querySelectorAll('[data-create-concept="true"]').forEach((concept) => {
      expect(concept).not.toHaveClass('border-t-4')
    })
    expect(screen.queryByRole('heading', { name: 'Three bets' })).not.toBeInTheDocument()
    const decide = screen.getByRole('button', { name: 'Decide' })
    const decisionEvidence = approach.container.querySelector('[data-decision-evidence="true"]')!
    expect(decisionEvidence).toHaveClass('opacity-0', 'pointer-events-none')
    fireEvent.mouseEnter(decide)
    expect(decide).toHaveAttribute('aria-expanded', 'true')
    expect(decisionEvidence).toHaveClass('opacity-100')
    expect(decisionEvidence.querySelector('figure')).toHaveClass('rounded-2xl', 'overflow-hidden')
    expect(decisionEvidence.querySelector('figure')).toHaveClass('h-[56%]')
    expect(decisionEvidence.querySelector('img')).toHaveAttribute('src', expect.stringContaining('feature-ranking.png'))
    expect(approach.container.querySelector('[data-step-number]')).not.toBeInTheDocument()
    expect(screen.queryByText('Discovery to decision')).not.toBeInTheDocument()

    const test = screen.getByRole('button', { name: 'Test' })
    const testEvidence = approach.container.querySelector('[data-test-evidence="true"]')!
    expect(testEvidence).toHaveClass('opacity-0', 'pointer-events-none')
    fireEvent.mouseEnter(test)
    expect(test).toHaveAttribute('aria-expanded', 'true')
    expect(testEvidence).toHaveClass('opacity-100')
    const testItems = testEvidence.querySelectorAll('[data-validation-test="true"]')
    expect(testItems).toHaveLength(5)
    expect(testEvidence.querySelectorAll('[data-validation-test-icon="true"]')).toHaveLength(1)
    const primaryTest = testEvidence.querySelector('[data-primary-validation-test="true"]')!
    const secondaryTests = testEvidence.querySelectorAll('[data-secondary-validation-test="true"]')
    expect(primaryTest).toHaveTextContent('Feature validation')
    expect(primaryTest.querySelector('[data-validation-test-icon="true"]')).toHaveAttribute('src', expect.stringContaining('ab-test-emoji.png'))
    expect(primaryTest.querySelector('[data-validation-test-icon="true"]')).toHaveClass('h-20', 'w-20')
    testItems.forEach((item) => expect(item).toHaveClass('grid-cols-[80px_auto]'))
    expect(secondaryTests).toHaveLength(4)
    secondaryTests.forEach((item) => expect(item).toHaveClass('text-charcoal/35', 'min-h-8'))
    expect(testEvidence.querySelector('ul')).toHaveClass('gap-0')
    testItems.forEach((item) => expect(item.querySelector('svg')).not.toBeInTheDocument())
    expect(testEvidence).toHaveTextContent('Feature validation')
    expect(testEvidence).toHaveTextContent('Meter goal calibration')
    expect(testEvidence).toHaveTextContent('Paid progress carryover')
    expect(testEvidence).toHaveTextContent('Chest tier weighting')
    expect(testEvidence).toHaveTextContent('Multiple milestones')
    approach.unmount()
  })

})
