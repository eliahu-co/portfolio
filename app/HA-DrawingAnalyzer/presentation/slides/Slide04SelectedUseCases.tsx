// app/HA-DrawingAnalyzer/presentation/slides/Slide04SelectedUseCases.tsx
import { SlideShell } from '../primitives'
import { USE_CASES } from '../deckData'

const MEDALS = ['🥇', '🥈', '🥉', '']

// Plain-language title for the cover row (strips the parenthetical subtitle).
function shortTitle(t: string): string {
  return t.split('\n')[0].replace(/\s*\(.*\)\s*$/, '')
}

export default function Slide04SelectedUseCases() {
  return (
    <SlideShell eyebrow="Use cases" title="Four opportunities, one framework">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-autodesk-blue">
            <th className="py-3 pr-4 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Use case</th>
            <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Primary user</th>
            <th className="pl-4 py-3 font-sans text-[11px] uppercase tracking-[0.12em] text-charcoal/70">Phase</th>
          </tr>
        </thead>
        <tbody>
          {USE_CASES.map((uc, i) => (
            <tr
              key={uc.id}
              className={`border-b border-charcoal/15 ${i === 0 ? 'animate-shimmer motion-reduce:animate-none' : ''}`}
              style={i === 0 ? { backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.30) 38%, rgba(6,150,215,0.60) 50%, rgba(255,255,255,0.30) 62%, rgba(255,255,255,0.10) 100%)', backgroundSize: '200% 100%' } : undefined}
            >
              <td className={`py-4 pr-4 font-serif text-[20px] text-black ${i === 0 ? 'font-medium' : ''}`}>
                <span className="mr-2 inline-block w-7 text-center" aria-hidden="true">{MEDALS[i]}</span>{shortTitle(uc.title)}
              </td>
              <td className="px-4 py-4 font-sans text-[14px] text-charcoal">{uc.primaryUser.pill}</td>
              <td className="pl-4 py-4 font-sans text-[14px] text-charcoal/70">{uc.constructionPhase.name.split('/')[0].trim()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SlideShell>
  )
}
