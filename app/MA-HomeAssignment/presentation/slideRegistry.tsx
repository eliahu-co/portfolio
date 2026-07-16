import type { ComponentType } from 'react'
import type { OpeningSlideProps } from './slides/Slide01Cover'
import Slide01Cover from './slides/Slide01Cover'
import Slide02About from './slides/Slide02About'
import Slide03Approach from './slides/Slide03Approach'
import Slide04Economy from './slides/Slide04Economy'
import Slide05ThreeBets from './slides/Slide05ThreeBets'
import Slide06HometownThesis from './slides/Slide06HometownThesis'
import Slide07HometownMechanics from './slides/Slide07HometownMechanics'
import Slide08CardBountyThesis from './slides/Slide08CardBountyThesis'
import Slide09CardBountyMechanics from './slides/Slide09CardBountyMechanics'
import Slide10HotTrailThesis from './slides/Slide10HotTrailThesis'
import Slide11HotTrailMechanics from './slides/Slide11HotTrailMechanics'
import Slide12Assumptions from './slides/Slide12Assumptions'
import Slide13ComparativeScoring from './slides/Slide13ComparativeScoring'
import Slide14Recommendation from './slides/Slide14Recommendation'
import Slide15PlayerFlow from './slides/Slide15PlayerFlow'
import Slide16MvpScope from './slides/Slide16MvpScope'
import Slide17Prototype from './slides/Slide17Prototype'
import Slide18ExperimentDesign from './slides/Slide18ExperimentDesign'
import Slide19Metrics from './slides/Slide19Metrics'
import Slide20FollowUpExperiments from './slides/Slide20FollowUpExperiments'
import Slide21ThankYou from './slides/Slide21ThankYou'

export type SlideChapter =
  | 'Opening'
  | 'Approach'
  | 'Three bets'
  | 'Decision'
  | 'Player flow'
  | 'Validation'
  | 'Closing'

export type ClosingMenuTarget = {
  readonly label: string
  readonly href: `#slide-${number}`
}

export type PresentationSlideProps = OpeningSlideProps & {
  readonly chapterLinks?: readonly ClosingMenuTarget[]
}

export type SlideDefinition = {
  readonly id: `slide-${number}`
  readonly title: string
  readonly shortTitle: string
  readonly chapter: SlideChapter
  readonly Component: ComponentType<PresentationSlideProps>
}

export const slideRegistry = [
  { id: 'slide-1', title: 'Increasing ARPDAU', shortTitle: 'Cover', chapter: 'Opening', Component: Slide01Cover },
  { id: 'slide-2', title: 'About', shortTitle: 'About', chapter: 'Opening', Component: Slide02About },
  { id: 'slide-3', title: 'Approach', shortTitle: 'Approach', chapter: 'Approach', Component: Slide03Approach },
  { id: 'slide-4', title: 'Coin Master economy', shortTitle: 'Economy', chapter: 'Approach', Component: Slide04Economy },
  { id: 'slide-5', title: 'Three bets', shortTitle: 'Three bets', chapter: 'Three bets', Component: Slide05ThreeBets },
  { id: 'slide-6', title: 'Hometown thesis', shortTitle: 'Hometown thesis', chapter: 'Three bets', Component: Slide06HometownThesis },
  { id: 'slide-7', title: 'Hometown mechanics', shortTitle: 'Hometown mechanics', chapter: 'Three bets', Component: Slide07HometownMechanics },
  { id: 'slide-8', title: 'Card Bounty thesis', shortTitle: 'Bounty thesis', chapter: 'Three bets', Component: Slide08CardBountyThesis },
  { id: 'slide-9', title: 'Card Bounty mechanics', shortTitle: 'Bounty mechanics', chapter: 'Three bets', Component: Slide09CardBountyMechanics },
  { id: 'slide-10', title: 'Hot Trail thesis', shortTitle: 'Hot Trail thesis', chapter: 'Three bets', Component: Slide10HotTrailThesis },
  { id: 'slide-11', title: 'Hot Trail mechanics', shortTitle: 'Hot Trail mechanics', chapter: 'Three bets', Component: Slide11HotTrailMechanics },
  { id: 'slide-12', title: 'Assumptions', shortTitle: 'Assumptions', chapter: 'Three bets', Component: Slide12Assumptions },
  { id: 'slide-13', title: 'Comparative scoring', shortTitle: 'Scoring', chapter: 'Decision', Component: Slide13ComparativeScoring },
  { id: 'slide-14', title: 'Recommendation', shortTitle: 'Recommendation', chapter: 'Decision', Component: Slide14Recommendation },
  { id: 'slide-15', title: 'Expanded player flow', shortTitle: 'Player flow', chapter: 'Player flow', Component: Slide15PlayerFlow },
  { id: 'slide-16', title: 'MVP scope', shortTitle: 'MVP scope', chapter: 'Player flow', Component: Slide16MvpScope },
  { id: 'slide-17', title: 'Interactive prototype', shortTitle: 'Prototype', chapter: 'Player flow', Component: Slide17Prototype },
  { id: 'slide-18', title: 'A/B-test design', shortTitle: 'Experiment design', chapter: 'Validation', Component: Slide18ExperimentDesign },
  { id: 'slide-19', title: 'Success metrics and guardrails', shortTitle: 'Metrics', chapter: 'Validation', Component: Slide19Metrics },
  { id: 'slide-20', title: 'Follow-up experiments', shortTitle: 'Follow-up tests', chapter: 'Validation', Component: Slide20FollowUpExperiments },
  { id: 'slide-21', title: 'Thank you', shortTitle: 'Thank you', chapter: 'Closing', Component: Slide21ThankYou },
] as const satisfies readonly SlideDefinition[]

export const slideCount = slideRegistry.length

const closingChapters = new Set<SlideChapter>()

export const closingMenuTargets: readonly ClosingMenuTarget[] = slideRegistry.reduce<ClosingMenuTarget[]>(
  (targets, slide) => {
    if (
      slide.chapter === 'Opening'
      || slide.chapter === 'Closing'
      || closingChapters.has(slide.chapter)
    ) return targets

    closingChapters.add(slide.chapter)
    targets.push({ label: slide.chapter, href: `#${slide.id}` })
    return targets
  },
  [],
)
