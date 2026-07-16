import type { PresentationConcept } from '../deckData'

function LoopPill({ label, core }: { label: string; core?: boolean }) {
  return (
    <div className={core
      ? 'rounded-lg border border-cm-wood/50 bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] px-4 py-2 text-center font-sans text-[14px] font-extrabold leading-snug text-cm-wood shadow-[0_2px_0_rgba(144,57,0,0.3)]'
      : 'rounded-lg border border-[#1E7BA8]/30 bg-gradient-to-b from-[#F0FAFE] to-[#DBF1FC] px-4 py-2 text-center font-sans text-[14px] font-extrabold leading-snug text-[#0d3a5a] shadow-[0_2px_0_rgba(30,123,168,0.16)]'}>
      {label}
    </div>
  )
}

function FlatList({ label, title, items, risk = false }: { label: string; title: string; items: readonly { title: string; body: string }[]; risk?: boolean }) {
  return (
    <section aria-label={label}>
      <h3 className={`mb-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] ${risk ? 'text-cm-crimson' : 'text-cm-violet-deep'}`}>{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.title} className={`border-l-4 pl-3 ${risk ? 'border-cm-crimson/55' : 'border-cm-gold'}`}>
            <p className="font-sans text-[15px] font-extrabold text-cm-violet-deep">{item.title}</p>
            <p className="font-sans text-[13px] leading-snug text-charcoal">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export type FeatureSlideProps = {
  readonly concept: PresentationConcept
  readonly loop: PresentationConcept['loop']
  readonly title: string
}

export function FeatureSlide({ concept, loop, title }: FeatureSlideProps) {
  return (
    <div data-feature-layout={title} className="grid h-full grid-cols-[0.82fr_0.9fr_1fr] gap-8">
      <div>
        <div className="overflow-hidden rounded-2xl border-2 border-cm-wood/50 bg-white shadow-[0_4px_0_rgba(144,57,0,0.28)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={concept.mockup} alt={`${title} feature mockup`} className="h-[370px] w-full object-contain" />
        </div>
        <p className="mt-5 border-l-4 border-cm-gold pl-4 font-sans text-[16px] font-bold leading-relaxed text-cm-violet-deep">
          {concept.monetizationSummary}
        </p>
      </div>
      <section aria-label={`${title} loop`}>
        <h3 className="mb-3 font-sans text-[12px] font-extrabold uppercase tracking-[0.12em] text-cm-violet-deep">Loop</h3>
        <div className="space-y-2">
          {loop.steps.map((step, index) => (
            <div key={step.label}>
              <LoopPill label={step.label} core={step.coreLoop} />
              {index < loop.steps.length - 1 && <div className="text-center text-[18px] font-black leading-none text-[#1E7BA8]">↓</div>}
            </div>
          ))}
        </div>
      </section>
      <div className="space-y-7">
        <FlatList label={`${title} player motivation`} title="Player motivation" items={concept.values} />
        <FlatList label={`${title} risks`} title="Risks" items={concept.risks} risk />
      </div>
    </div>
  )
}
