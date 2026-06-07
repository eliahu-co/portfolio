// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
import { SlideShell } from '../primitives'
import ExecWorkflow from '../ExecWorkflow'
import { EXEC_WORKFLOWS } from '../execWorkflows'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  const wf = EXEC_WORKFLOWS[data.id]
  return (
    <SlideShell eyebrow={`Use Case ${index}`}>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_minmax(0,560px)]">
        <div>
          <h2 className="font-serif text-[clamp(26px,3.2vw,42px)] leading-[1.05] text-black">{title}</h2>
          <div className="mt-5 mb-7 flex flex-wrap gap-x-8 gap-y-2">
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">User</span><span className="ml-3 text-charcoal">{data.primaryUser.pill}</span></p>
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">Phase</span><span className="ml-3 text-charcoal">{data.constructionPhase.name}</span></p>
          </div>
          {wf && <ExecWorkflow current={wf.current} proposed={wf.proposed} />}
        </div>
        {data.opportunity.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.opportunity.image} alt="" className={`max-h-[78vh] w-full rounded-lg object-contain ${index === 2 ? '' : 'border-2 border-autodesk-blue/60'}`} />
        )}
      </div>
    </SlideShell>
  )
}
