// app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
// High-fidelity inline-SVG reproduction of Veev sheet A102 "Floor Plan –
// Second Floor", drawn in monochrome CD convention (all black ink + gray wall
// poché — the original's blue is just Veev's "locally-installed work" layer).
//
// Conventions reproduced from the vector sheet:
//   • walls as thick gray-poché rectangles with thin black edges
//   • doors as a solid leaf rectangle + dashed quarter-arc swing
//   • plumbing fixtures (tubs w/ drain, double vanities w/ basins, toilets,
//     shower stalls), washer/dryer, shaft vent ⊗ symbols
//   • exterior windows as mullion breaks in the wall poché
//   • dashed gridlines with numbered/lettered bubbles
//   • stadium door tags, boxed window/assembly tags, leader notes
//   • the scalloped mezzanine opening + guardrail, stair run, roof canopy
//
// `version` toggles the three detected changes (added corridor doors, shifted
// Bedroom 3 partition 138→149 SF, removed Bath 2 toilet). `focus` emphasises
// one change's highlight; `viewBox` overrides the frame for thumbnail crops.

import { CHANGES, TYPE_META } from './data'

const INK = '#1a1a1a'
const GRID = '#aab0b5'
const FIXTURE = '#6b7177'
const POCHE = '#cfd3d7'
const T_EXT = 13
const T_INT = 8

const ENV = { x: 120, y: 100, w: 760, h: 550 } // x120–880, y100–650

// ---- wall segments -------------------------------------------------------
type HWall = { d: 'h'; x1: number; x2: number; y: number; t: number }
type VWall = { d: 'v'; y1: number; y2: number; x: number; t: number }
const WALLS: (HWall | VWall)[] = [
  // exterior envelope
  { d: 'h', x1: 120, x2: 880, y: 100, t: T_EXT },
  { d: 'h', x1: 120, x2: 880, y: 650, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 120, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 880, t: T_EXT },
  // interior verticals
  { d: 'v', y1: 100, y2: 438, x: 240, t: T_INT },
  { d: 'v', y1: 100, y2: 438, x: 317, t: T_INT },
  { d: 'v', y1: 100, y2: 367, x: 531, t: T_INT },
  { d: 'v', y1: 100, y2: 650, x: 584, t: T_INT },
  // interior horizontals
  { d: 'h', x1: 120, x2: 317, y: 218, t: T_INT },
  { d: 'h', x1: 317, x2: 531, y: 260, t: T_INT },
  { d: 'h', x1: 240, x2: 317, y: 308, t: T_INT },
  { d: 'h', x1: 120, x2: 240, y: 349, t: T_INT },
  { d: 'h', x1: 317, x2: 880, y: 367, t: T_INT },
  { d: 'h', x1: 120, x2: 584, y: 438, t: T_INT },
  // bedroom closets
  { d: 'h', x1: 262, x2: 484, y: 490, t: T_INT },
  { d: 'v', y1: 438, y2: 490, x: 262, t: T_INT },
  { d: 'v', y1: 438, y2: 490, x: 484, t: T_INT },
]

type RoomDef = { name: string; sf: string; x: number; y: number; w: number; h: number }
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

const HILITE: Record<string, { x: number; y: number; w: number; h: number }> = {
  doors: { x: 318, y: 360, w: 270, h: 84 },
  bedroom3: { x: 320, y: 436, w: 70, h: 210 },
  toilet: { x: 122, y: 220, w: 116, h: 127 },
}

// ---- primitive renderers -------------------------------------------------
function wallRect(w: HWall | VWall, key: string) {
  const r = w.d === 'h'
    ? { x: w.x1 - w.t / 2, y: w.y - w.t / 2, width: w.x2 - w.x1 + w.t, height: w.t }
    : { x: w.x - w.t / 2, y: w.y1 - w.t / 2, width: w.t, height: w.y2 - w.y1 + w.t }
  return <rect key={key} {...r} fill={POCHE} stroke={INK} strokeWidth={0.6} />
}

// A door: punched white opening + solid leaf rectangle + dashed swing arc.
function Door({ x, y, len = 36, rot = 0, accent }: { x: number; y: number; len?: number; rot?: number; accent?: string }) {
  const c = accent ?? INK
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {/* leaf panel */}
      <rect x={0} y={-2} width={len} height={4} fill="#fff" stroke={c} strokeWidth={accent ? 1.6 : 1} />
      {/* swing arc (dashed) */}
      <path d={`M ${len} 0 A ${len} ${len} 0 0 1 0 ${len}`} fill="none" stroke={c} strokeWidth={accent ? 1.3 : 0.8} strokeDasharray="4 3" />
    </g>
  )
}
// white gap that erases wall poché under a door opening
function gap(x: number, y: number, len: number, dir: 'h' | 'v', key: string) {
  return dir === 'v'
    ? <rect key={key} x={x - T_INT / 2 - 1} y={y} width={T_INT + 2} height={len} fill="#fff" />
    : <rect key={key} x={x} y={y - T_INT / 2 - 1} width={len} height={T_INT + 2} fill="#fff" />
}

function Tub({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={w} height={h} rx={8} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={6} />
      <circle cx={x + w / 2} cy={y + 10} r={2.5} />
    </g>
  )
}
function Toilet({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={-9} y={-4} width={18} height={8} rx={1.5} />
      <ellipse cx={0} cy={15} rx={9} ry={12} />
    </g>
  )
}
function Vanity({ x, y, w, h, basins = 1, vertical = false }: { x: number; y: number; w: number; h: number; basins?: number; vertical?: boolean }) {
  const cells = []
  for (let i = 0; i < basins; i++) {
    const cx = vertical ? x + w / 2 : x + (w / (basins)) * (i + 0.5)
    const cy = vertical ? y + (h / basins) * (i + 0.5) : y + h / 2
    cells.push(<g key={i}><ellipse cx={cx} cy={cy} rx={9} ry={7} /><circle cx={cx} cy={cy - 9} r={1.8} /></g>)
  }
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={w} height={h} />
      {cells}
    </g>
  )
}
function Shower({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={s} height={s} />
      <line x1={x} y1={y} x2={x + s} y2={y + s} strokeWidth={0.7} />
      <circle cx={x + s / 2} cy={y + s / 2} r={2} />
    </g>
  )
}
function WasherDryer({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={26} height={26} /><circle cx={x + 13} cy={y + 13} r={8} />
      <rect x={x + 32} y={y} width={26} height={26} /><circle cx={x + 45} cy={y + 13} r={8} />
    </g>
  )
}
function ShaftVents({ cx, cy, n = 2 }: { cx: number; cy: number; n?: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={0.9} fill="none">
      {Array.from({ length: n }).map((_, i) => {
        const yy = cy + (i - (n - 1) / 2) * 22
        return <g key={i}><circle cx={cx} cy={yy} r={8} /><line x1={cx - 5.6} y1={yy - 5.6} x2={cx + 5.6} y2={yy + 5.6} /><line x1={cx - 5.6} y1={yy + 5.6} x2={cx + 5.6} y2={yy - 5.6} /></g>
      })}
    </g>
  )
}
// exterior window: mullion break sitting in the wall poché
function Win({ x, y, len, dir }: { x: number; y: number; len: number; dir: 'h' | 'v' }) {
  if (dir === 'h') {
    return (
      <g stroke={INK} strokeWidth={0.8}>
        <rect x={x} y={y - T_EXT / 2} width={len} height={T_EXT} fill="#fff" />
        <line x1={x} y1={y - 2} x2={x + len} y2={y - 2} />
        <line x1={x} y1={y + 2} x2={x + len} y2={y + 2} />
      </g>
    )
  }
  return (
    <g stroke={INK} strokeWidth={0.8}>
      <rect x={x - T_EXT / 2} y={y} width={T_EXT} height={len} fill="#fff" />
      <line x1={x - 2} y1={y} x2={x - 2} y2={y + len} />
      <line x1={x + 2} y1={y} x2={x + 2} y2={y + len} />
    </g>
  )
}
function WinTag({ x, y, l }: { x: number; y: number; l: string }) {
  return (<g><rect x={x - 15} y={y - 7} width={30} height={14} fill="#fff" stroke={INK} strokeWidth={0.7} /><text x={x} y={y + 3.5} textAnchor="middle" fontSize={8} fill={INK}>{l}</text></g>)
}
function DoorTag({ x, y, l }: { x: number; y: number; l: string }) {
  return (<g><rect x={x - 12} y={y - 7} width={24} height={14} rx={7} fill="#fff" stroke={INK} strokeWidth={0.7} /><text x={x} y={y + 3.5} textAnchor="middle" fontSize={8} fill={FIXTURE}>{l}</text></g>)
}
function Note({ x, y, lines, lx, ly, anchor = 'start' }: { x: number; y: number; lines: string[]; lx?: number; ly?: number; anchor?: 'start' | 'end' | 'middle' }) {
  return (
    <g>
      {lx !== undefined && ly !== undefined && <line x1={x} y1={y - 3} x2={lx} y2={ly} stroke={INK} strokeWidth={0.6} markerEnd="url(#arrow)" />}
      {lines.map((t, i) => <text key={i} x={x} y={y + i * 11} textAnchor={anchor} fontSize={9} fill={INK}>{t}</text>)}
    </g>
  )
}

// scalloped cloud outline (mezzanine opening edge)
function scallop(cx: number, cy: number, r: number, n: number) {
  const bump = r * 0.26
  let d = ''
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI, am = (a0 + a1) / 2
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0)
    const mx = cx + (r + bump) * Math.cos(am), my = cy + (r + bump) * Math.sin(am)
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
    if (i === 0) d += `M ${x0.toFixed(1)} ${y0.toFixed(1)} `
    d += `Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} `
  }
  return d + 'Z'
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
  const b3Left = incoming ? 340 : 362
  const b3SF = incoming ? '149 SF' : '138 SF'

  return (
    <svg viewBox={viewBox ?? '8 44 992 762'} className="w-full h-full" style={{ background: '#ffffff' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 z" fill={INK} />
        </marker>
      </defs>

      {/* Grid lines + bubbles */}
      {V_GRID.map((g) => (
        <g key={`v${g.l}`}>
          <line x1={g.x} y1={70} x2={g.x} y2={ENV.y + ENV.h + 12} stroke={GRID} strokeWidth={0.5} strokeDasharray="6 3 1 3" />
          <circle cx={g.x} cy={60} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} />
          <text x={g.x} y={64} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text>
        </g>
      ))}
      {H_GRID.map((g) => (
        <g key={`h${g.l}`}>
          <line x1={106} y1={g.y} x2={ENV.x + ENV.w + 14} y2={g.y} stroke={GRID} strokeWidth={0.5} strokeDasharray="6 3 1 3" />
          <circle cx={ENV.x + ENV.w + 26} cy={g.y} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} />
          <text x={ENV.x + ENV.w + 26} y={g.y + 4} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text>
        </g>
      ))}

      {/* Roof canopy below the south wall (thin) */}
      <g stroke={GRID} strokeWidth={0.7} fill="none">
        <path d="M120 650 L60 770 L470 770 L420 650" strokeDasharray="3 3" />
        <path d="M470 770 L520 690 L760 690 L820 770 Z" />
        <line x1={120} y1={650} x2={420} y2={650} />
      </g>
      <text x={250} y={730} textAnchor="middle" fontSize={8} fill={FIXTURE}>ROOF AREA: C</text>
      <text x={640} y={745} textAnchor="middle" fontSize={8} fill={FIXTURE}>FRONT CANOPY</text>
      <text x={350} y={690} textAnchor="middle" fontSize={7.5} fill={FIXTURE}>ATTIC VENTILATION</text>
      <text x={150} y={700} fontSize={8} fill={FIXTURE}>3&quot; / 1&apos;-0&quot;</text>

      {/* ---- WALLS ---- */}
      {WALLS.map((w, i) => wallRect(w, `w${i}`))}
      {/* dynamic Bedroom 3 partition */}
      {wallRect({ d: 'v', y1: 438, y2: 650, x: b3Left, t: T_INT }, 'b3wall')}

      {/* door openings (erase poché) */}
      {gap(240, 116, 38, 'v', 'g1')}
      {gap(317, 286, 40, 'v', 'g2')}
      {gap(584, 120, 42, 'v', 'g3')}
      {gap(150, 438, 40, 'h', 'g4')}
      {gap(452, 438, 40, 'h', 'g5')}
      {gap(240, 360, 36, 'v', 'g6')}
      {incoming && gap(317, 372, 34, 'v', 'g7')}
      {incoming && gap(584, 372, 34, 'v', 'g8')}

      {/* ---- ROOM LABELS ---- */}
      {[...ROOMS, ...CLOSETS, { name: 'BEDROOM 3', sf: b3SF, x: b3Left, y: 438, w: 584 - b3Left, h: 212 }].map((r) => (
        <g key={r.name + r.sf + r.x}>
          {r.name
            ? (<><text x={r.x + r.w / 2} y={r.y + r.h / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>{r.name}</text>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 13} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text></>)
            : (<text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text>)}
        </g>
      ))}

      {/* ---- FIXTURES ---- */}
      <Tub x={132} y={110} w={46} h={82} />
      <Toilet x={222} y={120} rot={90} />
      <Toilet x={297} y={120} rot={90} />
      <Vanity x={126} y={300} w={26} h={104} basins={2} vertical />
      <Toilet x={195} y={300} />
      {/* primary bath: freestanding tub + double vanity */}
      <Tub x={372} y={108} w={96} h={42} />
      <Vanity x={324} y={108} w={42} h={20} basins={1} />
      <Vanity x={372} y={228} w={46} h={20} basins={1} />
      <Shower x={250} y={112} s={42} />
      <WasherDryer x={132} y={358} />
      <ShaftVents cx={557} cy={150} n={2} />
      <ShaftVents cx={263} cy={345} n={2} />

      {/* toilet in Bath 2 (39 SF) — present in current, ghost in incoming */}
      {!incoming
        ? <Toilet x={195} y={300} />
        : <g opacity={0.32}><Toilet x={195} y={300} /></g>}

      {/* mezzanine opening + guardrail + stair run (Bonus Room) */}
      <path d={scallop(748, 512, 58, 11)} fill="none" stroke={INK} strokeWidth={0.9} />
      <g stroke={FIXTURE} strokeWidth={0.8} fill="none">
        <rect x={598} y={392} width={42} height={150} />
        {Array.from({ length: 7 }).map((_, i) => <line key={i} x1={598} y1={392 + 18 + i * 17} x2={640} y2={392 + 18 + i * 17} />)}
        <line x1={619} y1={402} x2={619} y2={532} strokeWidth={0.6} markerEnd="url(#arrow)" />
      </g>
      <text x={601} y={386} fontSize={7.5} fill={FIXTURE}>DN</text>

      {/* ---- WINDOWS (exterior) ---- */}
      <Win x={150} y={100} len={56} dir="h" />
      <Win x={392} y={100} len={70} dir="h" />
      <Win x={648} y={100} len={120} dir="h" />
      <Win x={120} y={250} len={60} dir="v" />
      <Win x={880} y={170} len={70} dir="v" />
      <Win x={880} y={430} len={90} dir="v" />
      <Win x={260} y={650} len={56} dir="h" />
      <Win x={430} y={650} len={56} dir="h" />
      <Win x={660} y={650} len={70} dir="h" />

      {/* ---- DOORS ---- */}
      <Door x={240} y={116} len={38} rot={90} />
      <Door x={317} y={286} len={40} rot={90} />
      <Door x={584} y={120} len={42} rot={90} />
      <Door x={150} y={438} len={40} rot={-90} />
      <Door x={452} y={438} len={40} rot={-90} />
      <Door x={240} y={360} len={36} rot={0} />
      <DoorTag x={258} y={206} l="201" />
      <DoorTag x={336} y={206} l="202" />
      <DoorTag x={584} y={210} l="208" />
      <DoorTag x={232} y={428} l="207" />
      <DoorTag x={470} y={460} l="216" />

      {/* ---- TAGS + NOTES ---- */}
      <WinTag x={150} y={86} l="W2-0" />
      <WinTag x={420} y={86} l="W2-0" />
      <WinTag x={700} y={86} l="W4-0" />
      <WinTag x={90} y={290} l="W1-0" />
      <WinTag x={300} y={672} l="EER0" />
      <WinTag x={460} y={672} l="EER0" />
      <Note x={24} y={196} lines={['DOWNSPOUT', 'COMING OFF', 'OF ROOF, TYP.']} lx={120} ly={150} />
      <Note x={612} y={596} lines={['GUARDRAIL ALL', 'AROUND MEZZANINE']} lx={720} ly={566} />
      <Note x={902} y={556} anchor="end" lines={['AWNING OVER ADU', 'ENTRANCE DOOR']} lx={880} ly={500} />

      {/* Two doors added to the Corridor — incoming only, green */}
      {incoming && (<>
        <Door x={317} y={372} len={34} rot={90} accent={TYPE_META.added.color} />
        <Door x={584} y={372} len={34} rot={90} accent={TYPE_META.added.color} />
      </>)}

      {/* ---- detected-change highlight overlay (incoming only) ---- */}
      {incoming && CHANGES.map((c, i) => {
        const r = HILITE[c.id]
        if (!r) return null
        const color = TYPE_META[c.type].color
        const active = focus === c.id
        return (
          <g key={c.id}>
            <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6}
              fill={color} fillOpacity={active ? 0.18 : 0.09}
              stroke={color} strokeWidth={active ? 2.4 : 1.4} strokeOpacity={0.85} />
            <circle cx={c.marker.x} cy={c.marker.y} r={11} fill={color} />
            <text x={c.marker.x} y={c.marker.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">{i + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}
