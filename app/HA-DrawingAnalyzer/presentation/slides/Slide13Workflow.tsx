// app/HA-DrawingAnalyzer/presentation/slides/Slide13Workflow.tsx
import { SlideShell, MiniWorkflow } from '../primitives'
import { USE_CASES } from '../deckData'

export default function Slide13Workflow() {
  const cv = USE_CASES[0]
  return (
    <SlideShell eyebrow="Change Validation" title="From repeated cycles to first-pass approval">
      <MiniWorkflow current={cv.currentWorkflow.steps} proposed={cv.proposedWorkflow.steps} />
    </SlideShell>
  )
}
