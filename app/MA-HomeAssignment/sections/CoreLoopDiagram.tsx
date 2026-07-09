// app/MA-HomeAssignment/sections/CoreLoopDiagram.tsx
// Coin Master core-loop + meta diagram for the hero, drawn in the same visual
// language as the use-case workflow lanes: parchment step-cards with a wood
// drop edge, the sky-blue "engine" highlight (same as the AI step), and drawn
// thin wood connector arrows (matching the workflow lanes).
//
// Left: the core loop — SPIN → REWARDS → VILLAGE → SPIN, with a LiveOps feeder
// into SPIN, framed by a wood plaque. Right: the META stack (PvP / Pet / Cards)
// that feeds back into the loop. On the cream page the loop nodes are warm
// parchment pills, SPIN is the sky-blue engine, the meta items are light pills
// tuned for the blue meta bracket, and LiveOps is a flat bright-gold pill in
// the same style as the rest of the diagram.
//
// Layout is a fixed 560×300 coordinate space: cards are HTML (positioned by the
// node's centre as a percentage, keeping the CSS parchment styling) over one
// SVG layer (blob, meta group, arrows) in the same coordinates.

type Kind = 'engine' | 'parchment' | 'meta' | 'liveops'

type Node = { id: string; label: string; glyph: string; cx: number; cy: number; kind: Kind }

// The three loop nodes sit on one circle (centre 172,126, radius 66) 120° apart,
// so the connectors can be equal-radius arcs that read as circular motion.
const LOOP: Node[] = [
  { id: 'rewards', label: 'Rewards', glyph: '★', cx: 172, cy: 60,  kind: 'parchment' },
  { id: 'spin',    label: 'Spin',    glyph: '⟳', cx: 115, cy: 159, kind: 'engine' },
  { id: 'village', label: 'Village', glyph: '⌂', cx: 229, cy: 159, kind: 'parchment' },
  { id: 'liveops', label: 'LiveOps', glyph: '✦', cx: 115, cy: 270, kind: 'liveops' },
]

const META: Node[] = [
  { id: 'pvp',   label: 'PvP',   glyph: '⚔', cx: 472, cy: 78,  kind: 'meta' },
  { id: 'pet',   label: 'Pet',   glyph: '❋', cx: 472, cy: 132, kind: 'meta' },
  { id: 'cards', label: 'Cards', glyph: '❐', cx: 472, cy: 186, kind: 'meta' },
]

const ARROWS: string[] = [
  // arcs of the loop circle (r=66, through the pill centres) trimmed at each end
  // by that pill's own width, so each arc spans and is centred in the gap between
  // its two pills, with the arrowhead stopping just clear of the target
  'M106,128 A66,66 0 0 1 131,74',   // spin → rewards
  'M218,78 A66,66 0 0 1 238,124',   // rewards → village
  'M202,185 A66,66 0 0 1 137,182',  // village → spin
  'M115,258 L115,218',              // liveops → core-loop bracket edge (y=216)
  'M424,126 Q366,124 305,126',      // meta → loop (points at the core-loop bracket edge, x=302)
]

// All pill sizes are in container-query units (cqw = 1% of the diagram width) so
// they scale with the diagram exactly like the SVG viewBox — the whole thing
// stays proportional at every screen size and the arrows keep their alignment.
function style(kind: Kind) {
  // engine: the Coin Master SPIN button — bright red, squarish, raised 3D base
  if (kind === 'engine')
    return {
      box:    'bg-gradient-to-b from-[#F5533F] to-[#DA2A1C] border-[#8A140C] shadow-[0_0.45cqw_0_#9E1810,inset_0_0.22cqw_0_rgba(255,255,255,0.4)]',
      text:   'text-white [text-shadow:0_0.15cqw_0.3cqw_rgba(0,0,0,0.35)]',
      glyph:  'text-white',
      size:   'px-[2.4cqw] py-[1.2cqw] text-[1.95cqw]',
      weight: 'font-extrabold',
    }
  // liveops: a flat bright-gold pill at the same size/weight as the core pills
  if (kind === 'liveops')
    return {
      box:    'bg-[#FFD44A] border-cm-wood/50 shadow-[0_0.3cqw_0_rgba(144,57,0,0.3)]',
      text:   'text-cm-wood',
      glyph:  'text-cm-wood/70',
      size:   'px-[1.8cqw] py-[0.9cqw] text-[1.8cqw]',
      weight: 'font-extrabold',
    }
  // meta: light pills tuned for the blue meta bracket (navy text, blue frame),
  // same size and weight as the core pills
  if (kind === 'meta')
    return {
      box:    'bg-[#F2FAFE] border-[#0F3D54]/60 shadow-[0_0.3cqw_0_rgba(15,61,84,0.45)]',
      text:   'text-[#0d3a5a]',
      glyph:  'text-[#1E7BA8]',
      size:   'px-[1.8cqw] py-[0.9cqw] text-[1.8cqw]',
      weight: 'font-extrabold',
    }
  return {
    box:    'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_0.3cqw_0_rgba(144,57,0,0.3)]',
    text:   'text-cm-wood',
    glyph:  'text-cm-wood/70',
    size:   'px-[1.8cqw] py-[0.9cqw] text-[1.8cqw]',
    weight: 'font-extrabold',
  }
}

function Label({ text, cx, cy }: { text: string; cx: number; cy: number }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 font-sans text-[1.5cqw] font-bold uppercase tracking-[0.16em] text-cm-wood"
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
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-[0.9cqw] whitespace-nowrap border ${n.kind === 'engine' ? 'rounded-[0.9cqw]' : 'rounded-[1.2cqw]'} ${s.box} ${s.size}`}
      style={{ left: `${(n.cx / 560) * 100}%`, top: `${(n.cy / 300) * 100}%` }}
    >
      {n.kind !== 'engine' && <span className={`leading-none ${s.glyph}`} aria-hidden="true">{n.glyph}</span>}
      <span className={`font-sans ${s.weight} uppercase tracking-wide leading-none ${s.text}`}>{n.label}</span>
    </div>
  )
}

// A Coin Master-style framed plaque for the cream page: hard drop shadow, a
// warm parchment panel wash, a wood-brown frame, and an inner bevel highlight —
// mirrors the loyalty.coinmaster.com panel styling (rounded, framed, inset
// bevel, 0 6px drop) but toned for a light background.
function Plaque({ x, y, w, h, fill, stroke, r = 16 }: { x: number; y: number; w: number; h: number; fill: string; stroke: string; r?: number }) {
  return (
    <g>
      <rect x={x} y={y + 4} width={w} height={h} rx={r} fill="#3a1e08" opacity="0.2" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} opacity="0.92" />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={stroke} strokeWidth="1.5" />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={r - 3} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
    </g>
  )
}

export default function CoreLoopDiagram() {
  return (
    <figure
      className="m-0"
      aria-label="Coin Master game model: the core loop is spin → rewards → village → spin, with a LiveOps feeder into spin; the meta systems (PvP, pet, cards) feed back into the loop."
    >
      <div className="relative w-full aspect-[28/15] [container-type:inline-size]">
        {/* blob, meta group box, and connector arrows — behind the cards */}
        <svg viewBox="0 0 560 300" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
          <defs>
            {/* minimal open chevron, matching the workflow-lane Connector */}
            <marker id="cl-arrow" viewBox="0 0 12 12" refX="8" refY="6" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
              <path d="M3.5,2.5 L8,6 L3.5,9.5" fill="none" stroke="#903900" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            {/* soft white streak + clip for the core-loop bracket shine sweep */}
            <linearGradient id="cl-shine-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <clipPath id="cl-loop-clip">
              <rect x="44" y="38" width="258" height="178" rx="16" />
            </clipPath>
            <style>{`@media (prefers-reduced-motion: reduce){ .cl-shine{ display:none } }`}</style>
          </defs>

          {/* Coin Master-style framed plaques — gold core loop, blue meta */}
          {/* loop fill = the hero title's cm-gold-bright (#FFC93C) */}
          <Plaque x={44} y={38} w={258} h={178} fill="#FFC93C" stroke="#C77F14" />
          <Plaque x={424} y={52} w={98} h={162} fill="#3DAEE0" stroke="#1E7BA8" />

          {/* animated shine sweeping across the core-loop bracket */}
          <g className="cl-shine" clipPath="url(#cl-loop-clip)">
            <g>
              <animateTransform attributeName="transform" type="translate" values="-30 0; 380 0; 380 0" keyTimes="0; 0.32; 1" dur="4.5s" repeatCount="indefinite" />
              <rect x="-15" y="28" width="30" height="198" fill="url(#cl-shine-grad)" transform="skewX(-12)" />
            </g>
          </g>

          {/* thin wood connectors, matching the workflow lanes further down */}
          {ARROWS.map((d) => (
            <path key={d} d={d} stroke="#903900" strokeOpacity="0.75" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#cl-arrow)" />
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
