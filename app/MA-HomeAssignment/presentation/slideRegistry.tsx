import type { ComponentType } from 'react'
import type { OpeningSlideProps } from './slides/Slide01Cover'
import Slide01Cover from './slides/Slide01Cover'
import Slide02About from './slides/Slide02About'
import Slide03Approach from './slides/Slide03Approach'
import Slide06HometownThesis from './slides/Slide06HometownThesis'
import Slide08CardBountyThesis from './slides/Slide08CardBountyThesis'
import Slide10HotTrailThesis from './slides/Slide10HotTrailThesis'
import Slide12Assumptions from './slides/Slide12Assumptions'
import Slide13ComparativeScoring from './slides/Slide13ComparativeScoring'
import Slide15PlayerFlow from './slides/Slide15PlayerFlow'
import Slide16MvpScope from './slides/Slide16MvpScope'
import Slide17Prototype from './slides/Slide17Prototype'
import Slide18ExperimentDesign from './slides/Slide18ExperimentDesign'
import Slide19Metrics from './slides/Slide19Metrics'
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
  { id: 'slide-4', title: 'Hot Trail', shortTitle: 'Hot Trail', chapter: 'Three bets', Component: Slide10HotTrailThesis },
  { id: 'slide-5', title: 'Card Bounty', shortTitle: 'Card Bounty', chapter: 'Three bets', Component: Slide08CardBountyThesis },
  { id: 'slide-6', title: 'Hometown', shortTitle: 'Hometown', chapter: 'Three bets', Component: Slide06HometownThesis },
  { id: 'slide-7', title: 'Comparative scoring', shortTitle: 'Scoring', chapter: 'Decision', Component: Slide13ComparativeScoring },
  { id: 'slide-8', title: 'Expanded player flow', shortTitle: 'Player flow', chapter: 'Player flow', Component: Slide15PlayerFlow },
  { id: 'slide-9', title: 'MVP scope', shortTitle: 'MVP scope', chapter: 'Player flow', Component: Slide16MvpScope },
  { id: 'slide-10', title: 'Interactive prototype', shortTitle: 'Prototype', chapter: 'Player flow', Component: Slide17Prototype },
  { id: 'slide-11', title: 'A/B-test design', shortTitle: 'A/B test', chapter: 'Validation', Component: Slide18ExperimentDesign },
  { id: 'slide-12', title: 'Success metrics and guardrails', shortTitle: 'Metrics', chapter: 'Validation', Component: Slide19Metrics },
  { id: 'slide-13', title: 'Assumptions', shortTitle: 'Assumptions', chapter: 'Validation', Component: Slide12Assumptions },
  { id: 'slide-14', title: 'Thank you', shortTitle: 'Thank you', chapter: 'Closing', Component: Slide21ThankYou },
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
