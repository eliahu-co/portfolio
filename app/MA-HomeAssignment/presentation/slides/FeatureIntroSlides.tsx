import Image from 'next/image'
import { Eyebrow, SlideShell, SlideTitle } from '../primitives'
import type { OpeningSlideProps } from './Slide01Cover'

type FeatureIntroProps = OpeningSlideProps & {
  readonly feature: number
  readonly statement: string
  readonly motivations: readonly string[]
}

function FeatureIntroSlide({ feature, statement, motivations }: FeatureIntroProps) {
  return (
    <SlideShell>
      <Eyebrow>Feature {feature}</Eyebrow>
      <SlideTitle className="max-w-[1120px]">{statement}</SlideTitle>
      <div data-feature-motivations="true" className="mt-12 flex max-w-[1120px] items-center gap-4">
        <Image
          src="/coinmaster/resources/motivation-emoji.png"
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 object-contain"
        />
        <ul className="space-y-1 font-sans text-[18px] leading-snug text-charcoal">
          {motivations.map((motivation) => <li key={motivation}>{motivation}</li>)}
        </ul>
      </div>
    </SlideShell>
  )
}

export function SlideFeature1Intro(props: OpeningSlideProps) {
  return (
    <FeatureIntroSlide
      {...props}
      feature={1}
      statement="A counter-Raid that turns a loss into a reason to return and Spin"
      motivations={['Recovery and Revenge', 'Social Engine', 'Urgency']}
    />
  )
}

export function SlideFeature2Intro(props: OpeningSlideProps) {
  return (
    <FeatureIntroSlide
      {...props}
      feature={2}
      statement="A LiveOp that turns Chest buying into a visible path to a chosen Card"
      motivations={['Agency', 'Visible Progress', 'Completion']}
    />
  )
}

export function SlideFeature3Intro(props: OpeningSlideProps) {
  return (
    <FeatureIntroSlide
      {...props}
      feature={3}
      statement="A customizable town built from unlocked Villages items"
      motivations={['Expression and Ownership', 'Progress and Status', 'Social Recognition']}
    />
  )
}
