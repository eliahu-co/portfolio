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
// Layout is a fixed 560×300 coordinate space: cards are HTML (positioned by the
// node's centre as a percentage, keeping the CSS parchment styling) over one
// SVG layer (blob, meta group, arrows) in the same coordinates.

type Kind = 'engine' | 'parchment' | 'feeder' | 'meta'

type Node = { id: string; label: string; glyph: string; cx: number; cy: number; kind: Kind }

const LOOP: Node[] = [
  { id: 'rewards', label: 'Rewards', glyph: '★', cx: 170, cy: 60,  kind: 'parchment' },
  { id: 'spin',    label: 'Spin',    glyph: '⟳', cx: 92,  cy: 164, kind: 'engine' },
  { id: 'village', label: 'Village', glyph: '⌂', cx: 250, cy: 164, kind: 'parchment' },
  { id: 'liveops', label: 'LiveOps', glyph: '✦', cx: 92,  cy: 270, kind: 'feeder' },
]

const META: Node[] = [
  { id: 'pvp',      label: 'PvP',      glyph: '⚔', cx: 472, cy: 58,  kind: 'meta' },
  { id: 'building', label: 'Building', glyph: '⛏', cx: 472, cy: 108, kind: 'meta' },
  { id: 'pet',      label: 'Pet',      glyph: '❋', cx: 472, cy: 158, kind: 'meta' },
  { id: 'cards',    label: 'Cards',    glyph: '❐', cx: 472, cy: 208, kind: 'meta' },
]

const ARROWS: string[] = [
  'M116,148 Q100,100 138,82',   // spin → rewards
  'M202,82 Q262,98 244,148',    // rewards → village
  'M198,184 Q166,206 130,184',  // village → spin
  'M92,258 L92,218',            // liveops → core-loop bracket edge (y=216)
  'M424,126 Q366,124 305,126',  // meta → loop (points at the core-loop bracket edge, x=302)
]

function style(kind: Kind) {
  if (kind === 'engine')
    return {
      box:    'bg-gradient-to-b from-[#5FC9F5] to-cm-sky border-[#1D5E7E] shadow-[0_0_14px_rgba(79,191,239,0.75)]',
      text:   'text-[#0F3D54]',
      glyph:  'text-[#0F3D54]',
      size:   'px-3 py-1.5 text-[11px] md:text-[12px]',
      weight: 'font-extrabold',
    }
  if (kind === 'feeder')
    return {
      box:    'bg-[#FFFDF8] border-cm-wood/45',
      text:   'text-cm-wood',
      glyph:  'text-cm-gold',
      size:   'px-2 py-1 text-[9px] md:text-[10px]',
      weight: 'font-extrabold',
    }
  // meta: same parchment pill as the core-loop nodes, but smaller and lighter
  if (kind === 'meta')
    return {
      box:    'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_1.5px_0_rgba(144,57,0,0.3)]',
      text:   'text-cm-wood',
      glyph:  'text-cm-wood/70',
      size:   'px-2 py-1 text-[9px] md:text-[10px]',
      weight: 'font-semibold',
    }
  return {
    box:    'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_2px_0_rgba(144,57,0,0.3)]',
    text:   'text-cm-wood',
    glyph:  'text-cm-wood/70',
    size:   'px-3 py-1.5 text-[11px] md:text-[12px]',
    weight: 'font-extrabold',
  }
}

function Label({ text, cx, cy }: { text: string; cx: number; cy: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-[0.16em] text-cm-wood"
      style={{ left: `${(cx / 560) * 100}%`, top: `${(cy / 300) * 100}%` }}
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
      style={{ left: `${(n.cx / 560) * 100}%`, top: `${(n.cy / 300) * 100}%` }}
    >
      <span className={`leading-none ${s.glyph}`} aria-hidden="true">{n.glyph}</span>
      <span className={`font-sans ${s.weight} uppercase tracking-wide leading-none ${s.text}`}>{n.label}</span>
    </div>
  )
}

// A Coin Master-style framed plaque for the cream page: hard drop shadow, a
// warm parchment panel wash, a wood-brown frame, and an inner bevel highlight —
// mirrors the loyalty.coinmaster.com panel styling (rounded, framed, inset
// bevel, 0 6px drop) but toned for a light background.
function Plaque({ x, y, w, h, r = 16 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <g>
      <rect x={x} y={y + 4} width={w} height={h} rx={r} fill="#7a3b12" opacity="0.18" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="#F4E8D0" opacity="0.7" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke="#903900" strokeOpacity="0.5" strokeWidth="2.5" />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={r - 3} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="1" />
    </g>
  )
}

export default function CoreLoopDiagram() {
  return (
    <figure
      className="m-0"
      aria-label="Coin Master game model: the core loop is spin → rewards → village → spin, with a LiveOps feeder into spin; the meta systems (PvP, building, pet, cards) feed back into the loop."
    >
      <div className="relative w-full aspect-[28/15]">
        {/* blob, meta group box, and connector arrows — behind the cards */}
        <svg viewBox="0 0 560 300" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <marker id="cl-arrow" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#F5A800" />
            </marker>
            <marker id="cl-arrow-shadow" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#903900" fillOpacity="0.4" />
            </marker>
          </defs>

          {/* Coin Master-style framed plaques (cream frame, bevel, drop shadow) */}
          <Plaque x={44} y={38} w={258} h={178} />
          <Plaque x={424} y={34} w={98} h={200} />

          {/* wood drop-edge shadow, offset down like the cards' 0 2px 0 edge */}
          <g transform="translate(0,2.5)">
            {ARROWS.map((d) => (
              <path key={d} d={d} stroke="#903900" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#cl-arrow-shadow)" />
            ))}
          </g>
          {/* gold arrows on top */}
          {ARROWS.map((d) => (
            <path key={d} d={d} stroke="#F5A800" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#cl-arrow)" />
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
