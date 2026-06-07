// app/HA-DrawingAnalyzer/presentation/slides/Slide11Results.tsx
import { SlideShell, ScoreTable } from '../primitives'
import { CRITERIA, SCORE_ROWS } from '../deckData'

export default function Slide11Results() {
  return (
    <SlideShell eyebrow="Prioritization" title="Change Validation scores highest">
      <ScoreTable criteria={CRITERIA} rows={SCORE_ROWS} />
    </SlideShell>
  )
}
