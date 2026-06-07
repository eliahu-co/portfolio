// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
import { SlideShell } from '../primitives'
import ExecWorkflow from '../ExecWorkflow'
import { EXEC_WORKFLOWS } from '../execWorkflows'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  const wf = EXEC_WORKFLOWS[data.id]
  return (
    <SlideShell eyebrow={`Use Case ${index}`} title={title}>
      {/* user pill — fixed top-right of the slide, consistent across use cases */}
      <span className="absolute right-12 top-16 rounded-none bg-black px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-white lg:right-20 lg:top-20">
        {data.primaryUser.pill}
      </span>

      <div className="mt-2 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
        {wf && <ExecWorkflow current={wf.current} proposed={wf.proposed} />}
        {data.opportunity.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.opportunity.image}
            alt=""
            className={
              index === 2
                ? 'mx-auto max-h-[62vh] w-auto object-contain'
                : 'max-h-[84vh] w-full object-contain'
            }
          />
        )}
      </div>
    </SlideShell>
  )
}
