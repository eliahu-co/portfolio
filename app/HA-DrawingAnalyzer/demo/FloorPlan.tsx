// app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
// Inline-SVG reproduction of Veev sheet A102 "Floor Plan – Second Floor",
// drawn in monochrome CD convention. `version` toggles the three detected
// changes (added corridor doors, shifted Bedroom 3 partition, removed Bath 2
// toilet). `focus` emphasises one change's highlight; `viewBox` overrides the
// frame for cropped thumbnails.

import { CHANGES, TYPE_META } from './data'

const INK = '#1a1a1a'
const GRID = '#b8bdc2'
const FIXTURE = '#5a5a5a'

// Plan envelope and the two interior column lines.
const ENV = { x: 120, y: 100, w: 760, h: 520 }
const COL1 = 300 // left | middle
const COL2 = 560 // middle | right

type RoomDef = { name: string; sf: string; x: number; y: number; w: number; h: number }

// Rooms that are identical in both versions.
const ROOMS: RoomDef[] = [
  { name: 'BATH 2', sf: '32 SF', x: 120, y: 100, w: 180, h: 95 },
  { name: 'BATH 2', sf: '39 SF', x: 120, y: 195, w: 180, h: 90 },
  { name: 'LAUNDRY', sf: '52 SF', x: 120, y: 285, w: 180, h: 90 },
  { name: 'BEDROOM 2', sf: '126 SF', x: 120, y: 375, w: 180, h: 245 },
  { name: 'PRIMARY BATH', sf: '163 SF', x: 300, y: 100, w: 260, h: 140 },
  { name: 'WALK-IN CLOSET', sf: '98 SF', x: 300, y: 240, w: 170, h: 120 },
  { name: 'LINEN', sf: '9 SF', x: 470, y: 240, w: 90, h: 60 },
  { name: 'SHAFT', sf: '4 SF', x: 470, y: 300, w: 90, h: 60 },
  { name: 'CORRIDOR', sf: '144 SF', x: 300, y: 360, w: 260, h: 70 },
  { name: 'PRIMARY BDRM', sf: '254 SF', x: 560, y: 100, w: 320, h: 260 },
  { name: 'BONUS ROOM', sf: '366 SF', x: 560, y: 360, w: 320, h: 260 },
]

const V_GRID = [
  { x: 120, l: '1' }, { x: 300, l: '2' }, { x: 470, l: '3' },
  { x: 560, l: '4' }, { x: 720, l: '5' }, { x: 880, l: '6' },
]
const H_GRID = [
  { y: 100, l: 'A' }, { y: 240, l: 'B' }, { y: 360, l: 'C' },
  { y: 430, l: 'D' }, { y: 620, l: 'E' },
]

// Highlight rectangles for the detected-change overlay (incoming only).
const HILITE: Record<string, { x: number; y: number; w: number; h: number }> = {
  doors: { x: 312, y: 356, w: 210, h: 80 },
  bedroom3: { x: 260, y: 428, w: 82, h: 194 },
  toilet: { x: 122, y: 197, w: 122, h: 88 },
}

function Room({ name, sf, x, y, w, h }: RoomDef) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#ffffff" stroke={INK} strokeWidth={1.4} />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize={13} fontWeight={600} fill={INK}>{name}</text>
      <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={11} fill={FIXTURE}>{sf}</text>
    </g>
  )
}

// A 90° door: leaf line from the hinge plus a swing arc. `rot` orients it.
function Door({ x, y, size = 34, rot = 0, accent }: { x: number; y: number; size?: number; rot?: number; accent?: string }) {
  const c = accent ?? INK
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <line x1={x} y1={y} x2={x + size} y2={y} stroke={c} strokeWidth={accent ? 2 : 1.2} />
      <path d={`M ${x + size} ${y} A ${size} ${size} 0 0 1 ${x} ${y + size}`} fill="none" stroke={c} strokeWidth={accent ? 1.6 : 0.9} />
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
  const b3Left = incoming ? 278 : 300
  const b3SF = incoming ? '149 SF' : '138 SF'

  return (
    <svg viewBox={viewBox ?? '40 50 900 640'} className="w-full h-full" style={{ background: '#ffffff' }} preserveAspectRatio="xMidYMid meet">
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
      {ROOMS.map((r) => <Room key={r.name + r.sf} {...r} />)}

      {/* Bedroom 3 (its left partition + SF differ by version) */}
      <Room name="BEDROOM 3" sf={b3SF} x={b3Left} y={430} w={560 - b3Left} h={190} />

      {/* Fixtures ---------------------------------------------------------- */}
      {/* Tub in upper Bath 2 (vertical, against the left exterior wall) */}
      <rect x={130} y={112} width={42} height={70} rx={6} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Vanity + tub in Primary Bath (along top wall) */}
      <rect x={360} y={112} width={130} height={34} rx={6} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <rect x={310} y={112} width={42} height={22} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Washer + dryer in Laundry */}
      <rect x={138} y={300} width={28} height={28} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <circle cx={152} cy={314} r={9} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <rect x={172} y={300} width={28} height={28} fill="none" stroke={FIXTURE} strokeWidth={1} />
      <circle cx={186} cy={314} r={9} fill="none" stroke={FIXTURE} strokeWidth={1} />
      {/* Mezzanine opening + guardrail note in Bonus Room */}
      <circle cx={720} cy={490} r={46} fill="none" stroke={FIXTURE} strokeWidth={1} strokeDasharray="4 3" />
      <text x={720} y={560} textAnchor="middle" fontSize={8} fill={FIXTURE}>GUARDRAIL @ MEZZANINE</text>

      {/* Toilet in lower Bath 2 — present in current, removed in incoming */}
      {!incoming ? (
        <g>
          <ellipse cx={158} cy={240} rx={13} ry={16} fill="none" stroke={FIXTURE} strokeWidth={1} />
          <rect x={148} y={222} width={20} height={9} rx={2} fill="none" stroke={FIXTURE} strokeWidth={1} />
        </g>
      ) : (
        <g opacity={0.35}>
          <ellipse cx={158} cy={240} rx={13} ry={16} fill="none" stroke={FIXTURE} strokeWidth={0.8} strokeDasharray="3 3" />
        </g>
      )}

      {/* Doors (static) */}
      <Door x={300} y={150} rot={90} />
      <Door x={470} y={300} rot={180} />
      <Door x={560} y={150} rot={90} />
      <Door x={300} y={470} rot={0} />
      <DoorTag x={304} y={138} l="201" />
      <DoorTag x={304} y={486} l="208" />
      <DoorTag x={564} y={138} l="202" />

      {/* Window tags on exterior walls */}
      <WindowTag x={210} y={100} l="W2-0" />
      <WindowTag x={420} y={100} l="W2-0" />
      <WindowTag x={720} y={100} l="W4-0" />
      <WindowTag x={120} y={240} l="W1-0" />
      <WindowTag x={400} y={620} l="EER0" />
      <WindowTag x={640} y={620} l="W2-0" />

      {/* Two doors added to the Corridor — incoming only, drawn in green */}
      {incoming && (
        <g>
          <Door x={360} y={430} rot={-90} size={36} accent={TYPE_META.added.color} />
          <Door x={500} y={430} rot={-90} size={36} accent={TYPE_META.added.color} />
        </g>
      )}

      {/* Detected-change highlight overlay (incoming only) */}
      {incoming && CHANGES.map((c) => {
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
            <text x={c.marker.x} y={c.marker.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">
              {CHANGES.findIndex((x) => x.id === c.id) + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
