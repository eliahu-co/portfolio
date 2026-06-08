// app/HA-DrawingAnalyzer/presentation/slides/SlideUseCaseProblem.tsx
// Intro slide shown before each use-case slide: same user pill + construction
// phase, with the problem statement in place of the title. No workflow / image /
// tradeoff.
import { SlideShell, UserPill } from '../primitives'
import type { UseCaseData } from '@/app/HA-DrawingAnalyzer/sections/UseCase'

function roleExamples(data: UseCaseData): string[] {
  return (data.primaryUser.role ?? '').split('/').map((s) => s.trim()).filter(Boolean)
}

export default function SlideUseCaseProblem({ data, problem, highlight }: { data: UseCaseData; problem: string; highlight?: string }) {
  const [before, ...rest] = highlight ? problem.split(highlight) : [problem]
  const after = rest.join(highlight ?? '')
  return (
    <div className="relative h-full w-full bg-[#c9c9c9]">
      <SlideShell>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <UserPill pill={data.primaryUser.pill ?? ''} examples={roleExamples(data)} />
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-charcoal">{data.constructionPhase.name}</span>
        </div>
        <h2 className="group max-w-4xl text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.05] tracking-[-0.01em] text-black">
          {highlight ? (
            <>
              {before}
              <span className="box-decoration-clone px-0.5 transition-colors group-hover:bg-[#ffff00] group-hover:text-black">{highlight}</span>
              {after}
            </>
          ) : (
            problem
          )}
        </h2>
      </SlideShell>
    </div>
  )
}
