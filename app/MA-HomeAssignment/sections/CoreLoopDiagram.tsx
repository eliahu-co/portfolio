// app/MA-HomeAssignment/sections/CoreLoopDiagram.tsx
// Coin Master core-loop diagram for the hero, drawn in the same visual language
// as the use-case workflow lanes: parchment step-cards with a wood drop edge,
// the sky-blue "engine" highlight (same as the AI step), and drawn gold
// connector arrows. The loop is SPIN → REWARDS → VILLAGE → SPIN, with a LiveOps
// feeder into SPIN, echoing the hand-drawn reference (blue blob included).
//
// Layout is a fixed 360×300 coordinate space: cards are HTML (positioned by the
// node's centre as a percentage) so they keep the CSS parchment styling, while
// the blob and arrows are one SVG layer underneath in the same coordinates.

type Node = {
  id:    string
  label: string
  glyph: string
  cx:    number   // centre in the 360×300 space
  cy:    number
  kind:  'engine' | 'parchment' | 'feeder'
}

const NODES: Node[] = [
  { id: 'rewards', label: 'Rewards', glyph: '★', cx: 180, cy: 52,  kind: 'parchment' },
  { id: 'spin',    label: 'Spin',    glyph: '⟳', cx: 92,  cy: 168, kind: 'engine' },
  { id: 'village', label: 'Village', glyph: '⌂', cx: 268, cy: 168, kind: 'parchment' },
  { id: 'liveops', label: 'LiveOps', glyph: '✦', cx: 92,  cy: 252, kind: 'feeder' },
]

// clockwise cycle + the LiveOps feeder; arrowheads land in the gaps between cards
const ARROWS: string[] = [
  'M120,150 Q104,104 148,80',   // spin → rewards
  'M214,80 Q276,104 260,150',   // rewards → village
  'M212,184 Q180,206 150,184',  // village → spin
  'M92,236 L92,196',            // liveops → spin
]

function card(kind: Node['kind']) {
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
      size:  'px-2 py-0.5 text-[9px] md:text-[10px]',
    }
  return {
    box:   'bg-gradient-to-b from-[#FFE9C4] to-[#FFDCA3] border-cm-wood/50 shadow-[0_2px_0_rgba(144,57,0,0.3)]',
    text:  'text-cm-wood',
    glyph: 'text-cm-wood/70',
    size:  'px-3 py-1.5 text-[11px] md:text-[12px]',
  }
}

export default function CoreLoopDiagram() {
  return (
    <figure
      className="m-0"
      aria-label="Coin Master core loop: spinning produces rewards, rewards build the village, which drives more spins; live-ops events feed the loop."
    >
      <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-cm-gold-bright/90 mb-2">
        Core Loop
      </p>

      <div className="relative w-full max-w-[340px] aspect-[6/5]">
        {/* blob + connector arrows, behind the cards */}
        <svg
          viewBox="0 0 360 300"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="cl-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            <marker
              id="cl-arrow"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#FFD98A" />
            </marker>
          </defs>

          {/* the blue "core loop" blob from the reference sketch */}
          <ellipse cx="176" cy="140" rx="150" ry="92" fill="#4FBFEF" opacity="0.30" filter="url(#cl-blur)" />

          {ARROWS.map((d) => (
            <path
              key={d}
              d={d}
              stroke="#FFD98A"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.92"
              markerEnd="url(#cl-arrow)"
            />
          ))}
        </svg>

        {/* the step cards, on top of the arrows */}
        {NODES.map((n) => {
          const c = card(n.kind)
          return (
            <div
              key={n.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-lg border ${c.box} ${c.size}`}
              style={{ left: `${(n.cx / 360) * 100}%`, top: `${(n.cy / 300) * 100}%` }}
            >
              <span className={`leading-none ${c.glyph}`} aria-hidden="true">{n.glyph}</span>
              <span className={`font-sans font-extrabold uppercase tracking-wide leading-none ${c.text}`}>
                {n.label}
              </span>
            </div>
          )
        })}
      </div>
    </figure>
  )
}
