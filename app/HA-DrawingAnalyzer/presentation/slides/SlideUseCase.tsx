// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCase.tsx
import { SlideShell } from '../primitives'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

export default function SlideUseCase({ data, index }: { data: UseCaseData; index: number }) {
  const title = data.title.split('\n')[0]
  return (
    <SlideShell eyebrow={`Use Case ${index}`}>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.85fr_1.9fr]">
        <div>
          <h2 className="font-serif text-[clamp(26px,3.2vw,42px)] leading-[1.05] text-black">{title}</h2>
          <div className="mt-6 flex flex-col gap-3">
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">User</span><span className="ml-3 text-charcoal">{data.primaryUser.pill}</span></p>
            <p className="font-sans text-[13px]"><span className="font-bold uppercase tracking-[0.12em] text-charcoal">Phase</span><span className="ml-3 text-charcoal">{data.constructionPhase.name}</span></p>
          </div>
          <p className="mt-6 font-sans text-[16px] leading-relaxed text-charcoal">{data.problem.intro}</p>
        </div>
        {data.opportunity.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.opportunity.image} alt="" className={`max-h-[78vh] w-full rounded-lg object-contain ${index === 2 ? '' : 'border-2 border-autodesk-blue/60'}`} />
        )}
      </div>
    </SlideShell>
  )
}
