// app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
// Inline-SVG reproduction of Veev sheet A102 "Floor Plan – Second Floor",
// drawn in monochrome CD convention (all black ink — the original's blue is
// just Veev's "locally-installed work" layer). `version` toggles the three
// detected changes (added corridor doors, shifted Bedroom 3 partition, removed
// Bath 2 toilet). `focus` emphasises one change's highlight; `viewBox`
// overrides the frame for cropped thumbnails.

import { CHANGES, TYPE_META } from './data'

const INK = '#1a1a1a'
const GRID = '#b8bdc2'
const FIXTURE = '#5a5a5a'

const ENV = { x: 120, y: 100, w: 760, h: 550 }

type RoomDef = { name: string; sf: string; x: number; y: number; w: number; h: number }

// Rooms identical in both versions (Bedroom 3 is drawn separately — it changes).
const ROOMS: RoomDef[] = [
  { name: 'BATH 2', sf: '32 SF', x: 120, y: 100, w: 120, h: 118 },
  { name: '', sf: '25 SF', x: 240, y: 100, w: 77, h: 118 },
  { name: 'PRIMARY BATH', sf: '163 SF', x: 317, y: 100, w: 214, h: 160 },
  { name: 'SHAFT', sf: '10 SF', x: 531, y: 100, w: 53, h: 267 },
  { name: 'PRIMARY BDRM', sf: '254 SF', x: 584, y: 100, w: 296, h: 267 },
  { name: 'BATH 2', sf: '39 SF', x: 120, y: 218, w: 120, h: 131 },
  { name: 'LINEN', sf: '9 SF', x: 240, y: 218, w: 77, h: 90 },
  { name: 'WALK-IN CLOSET', sf: '98 SF', x: 317, y: 260, w: 214, h: 107 },
  { name: 'SHAFT', sf: '4 SF', x: 240, y: 308, w: 77, h: 130 },
  { name: 'LAUNDRY', sf: '52 SF', x: 120, y: 349, w: 120, h: 89 },
  { name: 'CORRIDOR', sf: '144 SF', x: 317, y: 367, w: 267, h: 71 },
  { name: 'BONUS ROOM', sf: '366 SF', x: 584, y: 367, w: 296, h: 283 },
  { name: 'BEDROOM 2', sf: '126 SF', x: 120, y: 438, w: 242, h: 212 },
]

// Two small closets sitting at the top of the bedroom band.
const CLOSETS: RoomDef[] = [
  { name: '', sf: '12 SF', x: 262, y: 438, w: 100, h: 52 },
  { name: '', sf: '12 SF', x: 384, y: 438, w: 100, h: 52 },
]

const V_GRID = [
  { x: 120, l: '1' }, { x: 240, l: '2' }, { x: 317, l: '3' },
  { x: 531, l: '4' }, { x: 584, l: '5' }, { x: 740, l: '6' }, { x: 880, l: '7' },
]
const H_GRID = [
  { y: 100, l: 'A' }, { y: 218, l: 'B' }, { y: 367, l: 'C' },
  { y: 438, l: 'D' }, { y: 650, l: 'E' },
]

// Highlight rectangles for the detected-change overlay (incoming only).
const HILITE: Record<string, { x: number; y: number; w: number; h: number }> = {
  doors: { x: 322, y: 362, w: 210, h: 82 },
  bedroom3: { x: 322, y: 436, w: 70, h: 210 },
  toilet: { x: 122, y: 220, w: 116, h: 127 },
}

function Room({ name, sf, x, y, w, h }: RoomDef) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={INK} strokeWidth={1.4} />
      {name ? (
        <>
          <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>{name}</text>
          <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" fontSize={10} fill={FIXTURE}>{sf}</text>
        </>
      ) : (
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fill={FIXTURE}>{sf}</text>
      )}
    </g>
  )
}

// A 90° door: leaf line from the hinge plus a swing arc. `rot` orients it.
function Door({ x, y, size = 30, rot = 0, accent }: { x: number; y: number; size?: number; rot?: number; accent?: string }) {
  const c = accent ?? INK
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <line x1={x} y1={y} x2={x + size} y2={y} stroke={c} strokeWidth={accent ? 2 : 1.1} />
      <path d={`M ${x + size} ${y} A ${size} ${size} 0 0 1 ${x} ${y + size}`} fill="none" stroke={c} strokeWidth={accent ? 1.6 : 0.8} />
    </g>
  )
}

function WindowTag({ x, y, l }: { x: number; y: number; l: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 7} width={28} height={14} rx={2} fill="#fff" stroke={GRID} strokeWidth={0.8} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={8} fill={FIXTURE}>{l}</text>
    </g>
  )
}

function DoorTag({ x, y, l }: { x: number; y: number; l: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="#fff" stroke={GRID} strokeWidth={0.8} />
      <text x={x} y={y + 3} textAnchor="middle" fontSize={8} fill={FIXTURE}>{l}</text>
    </g>
  )
}

export default function FloorPlan({
  version,
  focus,
  viewBox,
}: {
  version: 'current' | 'incoming'
  focus?: string | null
  viewBox?: string
}) {
  const incoming = version === 'incoming'
  // Bedroom 3 partition shifts left (into Bedroom 2) on the incoming revision.
  const b3Left = incoming ? 340 : 362
  const b3SF = incoming ? '149 SF' : '138 SF'

  return (
    <svg viewBox={viewBox ?? '40 50 920 660'} className="w-full h-full" style={{ background: '#ffffff' }} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines + bubbles */}
      <g>
        {V_GRID.map((g) => (
          <g key={`v${g.l}`}>
            <line x1={g.x} y1={70} x2={g.x} y2={ENV.y + ENV.h + 10} stroke={GRID} strokeWidth={0.5} strokeDasharray="2 4" />
            <circle cx={g.x} cy={62} r={11} fill="#fff" stroke={GRID} strokeWidth={0.8} />
            <text x={g.x} y={66} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text>
          </g>
        ))}
        {H_GRID.map((g) => (
          <g key={`h${g.l}`}>
            <line x1={110} y1={g.y} x2={ENV.x + ENV.w + 12} y2={g.y} stroke={GRID} strokeWidth={0.5} strokeDasharray="2 4" />
            <circle cx={ENV.x + ENV.w + 24} cy={g.y} r={11} fill="#fff" stroke={GRID} strokeWidth={0.8} />
            <text x={ENV.x + ENV.w + 24} y={g.y + 4} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text>
          </g>
        ))}
      </g>

      {/* Exterior envelope (double line: thick poché edge + inner line) */}
      <rect x={ENV.x} y={ENV.y} width={ENV.w} height={ENV.h} fill="#ffffff" stroke={INK} strokeWidth={4} />
      <rect x={ENV.x + 6} y={ENV.y + 6} width={ENV.w - 12} height={ENV.h - 12} fill="none" stroke={INK} strokeWidth={0.8} />

      {/* Static rooms */}
      {ROOMS.map((r) => <Room key={r.name + r.sf + r.x} {...r} />)}

      {/* Bedroom 3 (left partition + SF differ by version) */}
      <Room name="BEDROOM 3" sf={b3SF} x={b3Left} y={438} w={584 - b3Left} h={212} />

      {/* Closets carved from the top of the bedroom band (drawn over bedrooms) */}
      {CLOSETS.map((r) => <Room key={`c${r.x}`} {...r} />)}

      {/* Fixtures ---------------------------------------------------------- */}
      {/* Tub in upper Bath 2 (vertical, against the left exterior wall) */}
      <rect x={130} y={112} width={40} height={66} rx={6} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Shower stall in the 25 SF WC */}
      <rect x={250} y={112} width={48} height={44} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <line x1={250} y1={112} x2={298} y2={156} stroke={FIXTURE} strokeWidth={0.7} />
      {/* Tub + vanity in Primary Bath (along the top wall) */}
      <rect x={360} y={112} width={120} height={34} rx={6} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <rect x={325} y={112} width={28} height={20} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Washer + dryer in Laundry */}
      <rect x={134} y={360} width={26} height={26} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <circle cx={147} cy={373} r={8} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <rect x={166} y={360} width={26} height={26} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <circle cx={179} cy={373} r={8} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Mezzanine opening + guardrail note in Bonus Room */}
      <circle cx={700} cy={500} r={46} fill="none" stroke={FIXTURE} strokeWidth={1} strokeDasharray="4 3" />
      <text x={700} y={568} textAnchor="middle" fontSize={8} fill={FIXTURE}>GUARDRAIL @ MEZZANINE</text>

      {/* Toilet in lower Bath 2 — present in current, removed in incoming */}
      {!incoming ? (
        <g>
          <ellipse cx={180} cy={300} rx={13} ry={16} fill="none" stroke={FIXTURE} strokeWidth={1} />
          <rect x={170} y={282} width={20} height={9} rx={2} fill="none" stroke={FIXTURE} strokeWidth={1} />
        </g>
      ) : (
        <g opacity={0.35}>
          <ellipse cx={180} cy={300} rx={13} ry={16} fill="none" stroke={FIXTURE} strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      )}

      {/* Doors (static) */}
      <Door x={240} y={150} rot={90} />
      <Door x={317} y={300} rot={0} />
      <Door x={584} y={150} rot={90} />
      <Door x={150} y={438} rot={-90} />
      <Door x={470} y={438} rot={-90} />
      <DoorTag x={232} y={205} l="201" />
      <DoorTag x={584} y={205} l="202" />
      <DoorTag x={232} y={428} l="207" />

      {/* Window tags on exterior walls */}
      <WindowTag x={180} y={100} l="W2-0" />
      <WindowTag x={420} y={100} l="W2-0" />
      <WindowTag x={700} y={100} l="W4-0" />
      <WindowTag x={120} y={280} l="W1-0" />
      <WindowTag x={300} y={650} l="EER0" />
      <WindowTag x={460} y={650} l="EER0" />
      <WindowTag x={700} y={650} l="W2-0" />

      {/* Two doors added to the Corridor — incoming only, drawn in green */}
      {incoming && (
        <g>
          <Door x={370} y={438} rot={-90} size={32} accent={TYPE_META.added.color} />
          <Door x={500} y={438} rot={-90} size={32} accent={TYPE_META.added.color} />
        </g>
      )}

      {/* Detected-change highlight overlay (incoming only) */}
      {incoming && CHANGES.map((c, i) => {
        const r = HILITE[c.id]
        if (!r) return null
        const color = TYPE_META[c.type].color
        const active = focus === c.id
        return (
          <g key={c.id}>
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h} rx={6}
              fill={color} fillOpacity={active ? 0.18 : 0.1}
              stroke={color} strokeWidth={active ? 2.4 : 1.4} strokeOpacity={0.85}
            />
            <circle cx={c.marker.x} cy={c.marker.y} r={11} fill={color} />
            <text x={c.marker.x} y={c.marker.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{i + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}
