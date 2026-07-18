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
      statement="A time-limited counter-Raid that turns a loss into an urgent reason to return and Spin."
      motivations={['Urgency', 'Recovery and Revenge']}
    />
  )
}

export function SlideFeature2Intro(props: OpeningSlideProps) {
  return (
    <FeatureIntroSlide
      {...props}
      feature={2}
      statement="A limited LiveOps event that gives players a visible path to a missing Card."
      motivations={['agency', 'visible progress']}
    />
  )
}

export function SlideFeature3Intro(props: OpeningSlideProps) {
  return (
    <FeatureIntroSlide
      {...props}
      feature={3}
      statement="A customizable town built from items the player has unlocked across Villages."
      motivations={['Expression and Ownership', 'Progress and Status', 'social recognition']}
    />
  )
}
