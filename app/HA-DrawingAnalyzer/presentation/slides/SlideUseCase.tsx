// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
import { SlideShell } from '../primitives'
import ExecWorkflow from '../ExecWorkflow'
import { EXEC_WORKFLOWS } from '../execWorkflows'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  const wf = EXEC_WORKFLOWS[data.id]
  const image = index === 2 ? '/presentation/usecase-2.jpeg' : data.opportunity.image
  return (
    <div className="relative h-full w-full bg-[#c9c9c9]">
      <SlideShell>
        {/* header: eyebrow, then user pill + construction phase beneath it */}
        <p className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-black">Use Case {index}</p>
        <div className="mb-3 mt-2 flex flex-wrap items-center gap-3">
          <span className="rounded-none bg-black px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-white">{data.primaryUser.pill}</span>
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-charcoal">{data.constructionPhase.name}</span>
        </div>
        <h2 className="mb-8 text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.04] tracking-[-0.01em] text-black whitespace-pre-line">{title}</h2>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div>
            {wf && <ExecWorkflow current={wf.current} proposed={wf.proposed} />}
            {data.tradeoff && (
              <p className="mt-6 font-sans text-[11px] uppercase leading-relaxed tracking-[0.1em] text-black">
                {data.tradeoff.gain}
                <span className="mx-1.5" aria-hidden="true">⇄</span>
                {data.tradeoff.cost}
              </p>
            )}
          </div>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt=""
              className={
                index === 2
                  ? 'max-h-[62vh] w-auto justify-self-start rounded-tl-[28px] object-contain'
                  : 'max-h-[84vh] w-full rounded-tl-[28px] object-contain'
              }
            />
          )}
        </div>
      </SlideShell>
    </div>
  )
}
