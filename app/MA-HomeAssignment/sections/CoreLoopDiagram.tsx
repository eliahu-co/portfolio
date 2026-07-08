// app/MA-HomeAssignment/sections/CoreLoopDiagram.tsx
// Coin Master core-loop + meta diagram for the hero, drawn in the same visual
// language as the use-case workflow lanes: parchment step-cards with a wood
// drop edge, the sky-blue "engine" highlight (same as the AI step), and drawn
// gold connector arrows.
//
// Left: the core loop — SPIN → REWARDS → VILLAGE → SPIN, with a LiveOps feeder
// into SPIN, on the blue blob from the reference sketch. Right: the META stack
// (PVP / Building / Pet / Cards) that feeds back into the loop. Feeder systems
// (LiveOps, Meta) share the gold-outline-on-violet tone so they read as
// external inputs, distinct from the warm parchment core-loop nodes.
//
// Layout is a fixed 560×280 coordinate space: cards are HTML (positioned by the
// node's centre as a percentage, keeping the CSS parchment styling) over one
// SVG layer (blob, meta group, arrows) in the same coordinates.

type Kind = 'engine' | 'parchment' | 'feeder'

type Node = { id: string; label: string; glyph: string; cx: number; cy: number; kind: Kind }

const LOOP: Node[] = [
  { id: 'rewards', label: 'Rewards', glyph: '★', cx: 170, cy: 60,  kind: 'parchment' },
  { id: 'spin',    label: 'Spin',    glyph: '⟳', cx: 92,  cy: 164, kind: 'engine' },
  { id: 'village', label: 'Village', glyph: '⌂', cx: 250, cy: 164, kind: 'parchment' },
  { id: 'liveops', label: 'LiveOps', glyph: '✦', cx: 92,  cy: 240, kind: 'feeder' },
]

const META: Node[] = [
  { id: 'pvp',      label: 'PvP',      glyph: '⚔', cx: 472, cy: 58,  kind: 'feeder' },
  { id: 'building', label: 'Building', glyph: '⛏', cx: 472, cy: 108, kind: 'feeder' },
  { id: 'pet',      label: 'Pet',      glyph: '❋', cx: 472, cy: 158, kind: 'feeder' },
  { id: 'cards',    label: 'Cards',    glyph: '❐', cx: 472, cy: 208, kind: 'feeder' },
]

const ARROWS: string[] = [
  'M116,148 Q100,100 138,82',   // spin → rewards
  'M202,82 Q262,98 244,148',    // rewards → village
  'M198,184 Q166,206 130,184',  // village → spin
  'M92,222 L92,190',            // liveops → spin
  'M420,140 Q352,134 298,152',  // meta → loop (feeds the loop)
]

function style(kind: Kind) {
  if (kind === 'engine')
    return {
      box:   'bg-gradient-to-b from-[#5FC9F5] to-cm-sky border-[#1D5E7E] shadow-[0_0_14px_rgba(79,191,239,0.75)]',
      text:  'text-[#0F3D54]',
      glyph: 'text-[#0F3D54]',
      size:  'px-3 py-1.5 text-[11px] md:text-[12px]',
    }
  if (kind === 'feeder')
    return {
      box:   'bg-cm-violet-deep/50 border-cm-gold/70',
      text:  'text-cm-gold-bright',
      glyph: 'text-cm-gold-bright/80',
      size:  'px-2 py-1 text-[9px] md:text-[10px]',
    }
  return {
    box:   'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_2px_0_rgba(144,57,0,0.3)]',
    text:  'text-cm-wood',
    glyph: 'text-cm-wood/70',
    size:  'px-3 py-1.5 text-[11px] md:text-[12px]',
  }
}

function Label({ text, cx, cy }: { text: string; cx: number; cy: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.16em] text-cm-gold-bright/90"
      style={{ left: `${(cx / 560) * 100}%`, top: `${(cy / 280) * 100}%` }}
    >
      {text}
    </span>
  )
}

function Card({ n }: { n: Node }) {
  const s = style(n.kind)
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-lg border ${s.box} ${s.size}`}
      style={{ left: `${(n.cx / 560) * 100}%`, top: `${(n.cy / 280) * 100}%` }}
    >
      <span className={`leading-none ${s.glyph}`} aria-hidden="true">{n.glyph}</span>
      <span className={`font-sans font-extrabold uppercase tracking-wide leading-none ${s.text}`}>{n.label}</span>
    </div>
  )
}

export default function CoreLoopDiagram() {
  return (
    <figure
      className="m-0"
      aria-label="Coin Master game model: the core loop is spin → rewards → village → spin, with a LiveOps feeder into spin; the meta systems (PvP, building, pet, cards) feed back into the loop."
    >
      <div className="relative w-full aspect-[2/1]">
        {/* blob, meta group box, and connector arrows — behind the cards */}
        <svg viewBox="0 0 560 280" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <marker id="cl-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#FFD98A" />
            </marker>
          </defs>

          {/* core-loop group container — matches the meta bracket */}
          <rect x="44" y="38" width="258" height="178" rx="14" fill="#2A1B54" opacity="0.28" />
          <rect x="44" y="38" width="258" height="178" rx="14" fill="none" stroke="#FFC93C" strokeOpacity="0.35" strokeWidth="1.5" />

          {/* meta group container */}
          <rect x="424" y="34" width="98" height="200" rx="12" fill="#2A1B54" opacity="0.28" />
          <rect x="424" y="34" width="98" height="200" rx="12" fill="none" stroke="#FFC93C" strokeOpacity="0.35" strokeWidth="1.5" />

          {ARROWS.map((d) => (
            <path key={d} d={d} stroke="#FFD98A" strokeWidth="2.5" strokeLinecap="round" opacity="0.92" markerEnd="url(#cl-arrow)" />
          ))}
        </svg>

        {/* section labels */}
        <Label text="Core Loop" cx={96} cy={22} />
        <Label text="Meta" cx={473} cy={20} />

        {/* the cards, on top of the arrows */}
        {[...LOOP, ...META].map((n) => <Card key={n.id} n={n} />)}
      </div>
    </figure>
  )
}
