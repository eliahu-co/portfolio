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
import SlideMvpIntro from './slides/SlideMvpIntro'
import Slide17Prototype from './slides/Slide17Prototype'
import SlideValidationRoadmap from './slides/SlideValidationRoadmap'
import Slide18ExperimentDesign from './slides/Slide18ExperimentDesign'
import Slide19Metrics from './slides/Slide19Metrics'
import Slide21ThankYou from './slides/Slide21ThankYou'
import {
  SlideFeature1Intro,
  SlideFeature2Intro,
  SlideFeature3Intro,
} from './slides/FeatureIntroSlides'

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
  { id: 'slide-4', title: 'A counter-Raid that turns a loss into a reason to return and Spin', shortTitle: 'Feature 1', chapter: 'Three bets', Component: SlideFeature1Intro },
  { id: 'slide-5', title: 'Hot Trail', shortTitle: 'Hot Trail', chapter: 'Three bets', Component: Slide10HotTrailThesis },
  { id: 'slide-6', title: 'A visible path to a chosen Card through buying Chests', shortTitle: 'Feature 2', chapter: 'Three bets', Component: SlideFeature2Intro },
  { id: 'slide-7', title: 'Card Bounty', shortTitle: 'Card Bounty', chapter: 'Three bets', Component: Slide08CardBountyThesis },
  { id: 'slide-8', title: 'A customizable town built from unlocked Villages items', shortTitle: 'Feature 3', chapter: 'Three bets', Component: SlideFeature3Intro },
  { id: 'slide-9', title: 'Hometown', shortTitle: 'Hometown', chapter: 'Three bets', Component: Slide06HometownThesis },
  { id: 'slide-10', title: 'Score', shortTitle: 'Score', chapter: 'Decision', Component: Slide13ComparativeScoring },
  { id: 'slide-11', title: 'Expanded player flow', shortTitle: 'Player flow', chapter: 'Player flow', Component: Slide15PlayerFlow },
  { id: 'slide-12', title: 'Target-selection, Chest-progress, guarantee mechanics', shortTitle: 'MVP', chapter: 'Player flow', Component: SlideMvpIntro },
  { id: 'slide-13', title: 'MVP scope', shortTitle: 'MVP scope', chapter: 'Player flow', Component: Slide16MvpScope },
  { id: 'slide-14', title: 'Interactive prototype', shortTitle: 'Prototype', chapter: 'Player flow', Component: Slide17Prototype },
  { id: 'slide-15', title: 'What We Test Next', shortTitle: 'Additional tests', chapter: 'Validation', Component: SlideValidationRoadmap },
  { id: 'slide-16', title: 'A/B-test design', shortTitle: 'A/B test', chapter: 'Validation', Component: Slide18ExperimentDesign },
  { id: 'slide-17', title: 'Success metrics and guardrails', shortTitle: 'Metrics', chapter: 'Validation', Component: Slide19Metrics },
  { id: 'slide-18', title: 'Assumptions', shortTitle: 'Assumptions', chapter: 'Validation', Component: Slide12Assumptions },
  { id: 'slide-19', title: 'Thank you', shortTitle: 'Thank you', chapter: 'Closing', Component: Slide21ThankYou },
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
