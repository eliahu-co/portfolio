// app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
// Inline-SVG reproduction of Veev sheet A102 "Floor Plan – Second Floor",
// monochrome CD convention (black ink + gray wall poché + light floor hatch).
// Doors are a solid leaf rectangle perpendicular to the wall + dashed swing arc
// in a clean punched opening; fixtures sit with their backs flush to walls.
//
// Detected changes render as coloured objects on the pane that carries them
// (removed → red dashed ghost on Incoming; added doors → green; modified wall →
// yellow with bold yellow SF), each with a lettered marker (A/B/C). The
// modified room also gets a dashed area rectangle. `focus` strengthens one
// change; `viewBox` crops thumbnails.

import { CHANGES, TYPE_META } from './data'

const INK = '#1a1a1a'
const GRID = '#aab0b5'
const FIXTURE = '#5d6469'
const POCHE = '#cfd3d7'
const HATCH = '#e7eaec'
const T_EXT = 13
const T_INT = 8
const YELLOW = TYPE_META.modified.color

const ENV = { x: 120, y: 100, w: 760, h: 550 }

type HWall = { d: 'h'; x1: number; x2: number; y: number; t: number }
type VWall = { d: 'v'; y1: number; y2: number; x: number; t: number }
const WALLS: (HWall | VWall)[] = [
  // exterior
  { d: 'h', x1: 120, x2: 880, y: 100, t: T_EXT },
  { d: 'h', x1: 120, x2: 880, y: 650, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 120, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 880, t: T_EXT },
  // interior verticals
  { d: 'v', y1: 100, y2: 438, x: 240, t: T_INT }, // left rooms | hall
  { d: 'v', y1: 100, y2: 438, x: 317, t: T_INT }, // hall | bath/walk-in/corridor
  { d: 'v', y1: 100, y2: 367, x: 531, t: T_INT }, // primary bath/walk-in | primary bdrm
  { d: 'v', y1: 367, y2: 650, x: 584, t: T_INT }, // corridor | bonus
  // interior horizontals
  { d: 'h', x1: 120, x2: 317, y: 218, t: T_INT },
  { d: 'h', x1: 317, x2: 531, y: 260, t: T_INT },
  { d: 'h', x1: 120, x2: 240, y: 367, t: T_INT }, // bath 2 (39) | laundry
  { d: 'h', x1: 317, x2: 880, y: 367, t: T_INT }, // walk-in/bdrm | corridor/bonus
  { d: 'h', x1: 120, x2: 584, y: 438, t: T_INT }, // upper | bedrooms
]

type RoomDef = { name: string; sf: string; x: number; y: number; w: number; h: number; wet?: boolean }
const ROOMS: RoomDef[] = [
  { name: 'BATH 2', sf: '32 SF', x: 120, y: 100, w: 120, h: 118, wet: true },
  { name: '', sf: '25 SF', x: 240, y: 100, w: 77, h: 118, wet: true },
  { name: 'PRIMARY BATH', sf: '163 SF', x: 317, y: 100, w: 214, h: 160, wet: true },
  { name: 'PRIMARY BDRM', sf: '254 SF', x: 531, y: 100, w: 349, h: 267 },
  { name: 'BATH 2', sf: '39 SF', x: 120, y: 218, w: 120, h: 149, wet: true },
  { name: 'WALK-IN CLOSET', sf: '98 SF', x: 317, y: 260, w: 214, h: 107 },
  { name: 'LAUNDRY', sf: '52 SF', x: 120, y: 367, w: 120, h: 71 },
  { name: 'CORRIDOR', sf: '144 SF', x: 317, y: 367, w: 267, h: 71 },
  { name: 'BONUS ROOM', sf: '366 SF', x: 584, y: 367, w: 296, h: 283 },
]
// blank floor (hatch only): the hall (former 25 SF lower / linen / lobby)
const BLANK: RoomDef[] = [{ name: '', sf: '', x: 240, y: 218, w: 77, h: 220 }]

const V_GRID = [
  { x: 120, l: '1' }, { x: 240, l: '2' }, { x: 317, l: '3' },
  { x: 531, l: '4' }, { x: 584, l: '5' }, { x: 740, l: '6' }, { x: 880, l: '7' },
]
const H_GRID = [
  { y: 100, l: 'A' }, { y: 218, l: 'B' }, { y: 367, l: 'C' },
  { y: 438, l: 'D' }, { y: 650, l: 'E' },
]

const HILITE = { bedroom3: { x: 338, y: 440, w: 246, h: 208 } }

// ---- primitives ----------------------------------------------------------
function wallRect(w: HWall | VWall, key: string, stroke = INK, fill = POCHE, sw = 0.6) {
  const r = w.d === 'h'
    ? { x: w.x1 - w.t / 2, y: w.y - w.t / 2, width: w.x2 - w.x1 + w.t, height: w.t }
    : { x: w.x - w.t / 2, y: w.y1 - w.t / 2, width: w.t, height: w.y2 - w.y1 + w.t }
  return <rect key={key} {...r} fill={fill} stroke={stroke} strokeWidth={sw} />
}

function Hatch({ x, y, w, h, gap = 11, grid = false }: { x: number; y: number; w: number; h: number; gap?: number; grid?: boolean }) {
  const lines: JSX.Element[] = []
  for (let yy = y + gap; yy < y + h - 1; yy += gap) lines.push(<line key={`h${yy}`} x1={x + 2} y1={yy} x2={x + w - 2} y2={yy} />)
  if (grid) for (let xx = x + gap; xx < x + w - 1; xx += gap) lines.push(<line key={`v${xx}`} x1={xx} y1={y + 2} x2={xx} y2={y + h - 2} />)
  return <g stroke={HATCH} strokeWidth={0.4}>{lines}</g>
}

function Door({ x, y, len = 34, rot = 0, accent, mirror = false }: { x: number; y: number; len?: number; rot?: number; accent?: string; mirror?: boolean }) {
  const c = accent ?? INK
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})${mirror ? ' scale(-1 1)' : ''}`}>
      <rect x={0} y={-1.7} width={len} height={3.4} fill={accent ? c : '#fff'} stroke={c} strokeWidth={accent ? 2.4 : 1.1} />
      <path d={`M ${len} 0 A ${len} ${len} 0 0 1 0 ${len}`} fill="none" stroke={c} strokeWidth={accent ? 1.5 : 0.8} strokeDasharray="4 3" />
    </g>
  )
}
function gap(x: number, y: number, len: number, dir: 'h' | 'v', key: string) {
  return dir === 'v'
    ? <rect key={key} x={x - T_INT / 2 - 1} y={y} width={T_INT + 2} height={len} fill="#fff" />
    : <rect key={key} x={x} y={y - T_INT / 2 - 1} width={len} height={T_INT + 2} fill="#fff" />
}

function Tub({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={w} height={h} rx={7} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={5} />
      <circle cx={x + w / 2} cy={y + (h > w ? 10 : h / 2)} r={2.4} />
    </g>
  )
}
const TROT: Record<string, number> = { down: 0, up: 180, left: 90, right: 270 }
function Toilet({ x, y, dir = 'down', color = FIXTURE, bold = false, dashed = false }: { x: number; y: number; dir?: 'up' | 'down' | 'left' | 'right'; color?: string; bold?: boolean; dashed?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${TROT[dir]})`} stroke={color} strokeWidth={bold ? 2.2 : 1} fill="none" strokeDasharray={dashed ? '4 3' : undefined}>
      <rect x={-9} y={0} width={18} height={6} rx={1.5} />
      <ellipse cx={0} cy={16} rx={8.5} ry={11} />
    </g>
  )
}
function Vanity({ x, y, w, h, basins = 1, vertical = false }: { x: number; y: number; w: number; h: number; basins?: number; vertical?: boolean }) {
  const cells: JSX.Element[] = []
  for (let i = 0; i < basins; i++) {
    const cx = vertical ? x + w / 2 : x + (w / basins) * (i + 0.5)
    const cy = vertical ? y + (h / basins) * (i + 0.5) : y + h / 2
    cells.push(<g key={i}><ellipse cx={cx} cy={cy} rx={8.5} ry={6.5} /><circle cx={cx} cy={vertical ? cy - 8 : cy - 6} r={1.6} /></g>)
  }
  return <g stroke={FIXTURE} strokeWidth={1} fill="none"><rect x={x} y={y} width={w} height={h} />{cells}</g>
}
function WasherDryer({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={FIXTURE} strokeWidth={1} fill="none">
      <rect x={x} y={y} width={24} height={24} /><circle cx={x + 12} cy={y + 12} r={7.5} />
      <rect x={x + 28} y={y} width={24} height={24} /><circle cx={x + 40} cy={y + 12} r={7.5} />
    </g>
  )
}
function Stair({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const n = 11, step = h / n
  return (
    <g stroke={FIXTURE} strokeWidth={0.9} fill="none">
      <rect x={x} y={y} width={w} height={h} />
      {Array.from({ length: n - 1 }).map((_, i) => <line key={i} x1={x} y1={y + step * (i + 1)} x2={x + w} y2={y + step * (i + 1)} />)}
      <line x1={x + w / 2} y1={y + h - 4} x2={x + w / 2} y2={y + 6} markerEnd="url(#fp-arrow)" />
    </g>
  )
}
function Win({ x, y, len, dir }: { x: number; y: number; len: number; dir: 'h' | 'v' }) {
  if (dir === 'h') return (
    <g stroke={INK} strokeWidth={0.8}>
      <rect x={x} y={y - T_EXT / 2} width={len} height={T_EXT} fill="#fff" />
      <line x1={x} y1={y - 2} x2={x + len} y2={y - 2} /><line x1={x} y1={y + 2} x2={x + len} y2={y + 2} />
    </g>
  )
  return (
    <g stroke={INK} strokeWidth={0.8}>
      <rect x={x - T_EXT / 2} y={y} width={T_EXT} height={len} fill="#fff" />
      <line x1={x - 2} y1={y} x2={x - 2} y2={y + len} /><line x1={x + 2} y1={y} x2={x + 2} y2={y + len} />
    </g>
  )
}

export default function FloorPlan({
  version, focus, viewBox,
}: {
  version: 'current' | 'incoming'
  focus?: string | null
  viewBox?: string
}) {
  const incoming = version === 'incoming'
  const b3Left = incoming ? 340 : 362
  const b3SF = incoming ? '149 SF' : '138 SF'
  const b2: RoomDef = { name: 'BEDROOM 2', sf: '126 SF', x: 120, y: 438, w: b3Left - 120, h: 212 }
  const b3: RoomDef = { name: 'BEDROOM 3', sf: b3SF, x: b3Left, y: 438, w: 584 - b3Left, h: 212 }

  const hatchRects = [...ROOMS, ...BLANK, b2, b3]
  const marked = CHANGES.filter((c) => c.shownIn === version)

  return (
    <svg viewBox={viewBox ?? '6 46 988 736'} className="w-full h-full" style={{ background: '#ffffff' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="fp-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill={FIXTURE} /></marker>
      </defs>

      {/* gridlines (behind) */}
      {V_GRID.map((g) => <line key={`vl${g.l}`} x1={g.x} y1={74} x2={g.x} y2={ENV.y + ENV.h + 12} stroke={GRID} strokeWidth={0.5} strokeDasharray="7 3 1 3" />)}
      {H_GRID.map((g) => <line key={`hl${g.l}`} x1={108} y1={g.y} x2={ENV.x + ENV.w + 14} y2={g.y} stroke={GRID} strokeWidth={0.5} strokeDasharray="7 3 1 3" />)}

      {/* floor hatch (under walls) */}
      {hatchRects.map((r) => <Hatch key={`ht${r.x}-${r.y}`} x={r.x} y={r.y} w={r.w} h={r.h} gap={r.wet ? 13 : 11} grid={r.wet} />)}

      {/* faint roof outline below south wall */}
      <path d="M120 650 L66 778 L470 778 L470 690 L760 690 L812 778" stroke={GRID} strokeWidth={0.6} fill="none" opacity={0.6} strokeDasharray="3 4" />

      {/* walls */}
      {WALLS.map((w, i) => wallRect(w, `w${i}`))}
      {wallRect({ d: 'v', y1: 438, y2: 650, x: b3Left, t: T_INT }, 'b3wall')}

      {/* door openings */}
      {gap(195, 218, 34, 'h', 'g1')}      {/* bath2-32 ↔ bath2-39 */}
      {gap(240, 285, 32, 'v', 'g2')}      {/* bath2-39 ↔ hall */}
      {gap(240, 395, 30, 'v', 'g3')}      {/* laundry ↔ hall */}
      {gap(265, 218, 30, 'h', 'g4')}      {/* 25 SF ↔ hall */}
      {gap(360, 260, 38, 'h', 'g5')}      {/* primary bath ↔ walk-in */}
      {gap(531, 115, 40, 'v', 'g7')}      {/* primary bdrm ↔ primary bath */}
      {gap(550, 367, 34, 'h', 'g8')}      {/* primary bdrm ↔ corridor */}
      {gap(317, 398, 34, 'v', 'g9')}      {/* corridor ↔ hall (to the bath) */}
      {gap(270, 438, 38, 'h', 'g10')}     {/* bedroom 2 ↔ hall */}
      {gap(430, 438, 38, 'h', 'g11')}     {/* bedroom 3 ↔ corridor */}
      {incoming && gap(584, 375, 30, 'v', 'ga1')}
      {incoming && gap(584, 407, 28, 'v', 'ga2')}

      {/* windows */}
      <Win x={150} y={100} len={56} dir="h" />
      <Win x={392} y={100} len={70} dir="h" />
      <Win x={648} y={100} len={120} dir="h" />
      <Win x={120} y={250} len={60} dir="v" />
      <Win x={880} y={170} len={70} dir="v" />
      <Win x={880} y={430} len={90} dir="v" />
      <Win x={260} y={650} len={56} dir="h" />
      <Win x={430} y={650} len={56} dir="h" />
      <Win x={660} y={650} len={70} dir="h" />

      {/* fixtures */}
      <Tub x={128} y={108} w={46} h={84} />
      <Toilet x={236} y={150} dir="left" />
      <Toilet x={278} y={107} dir="down" />
      <Vanity x={126} y={240} w={28} h={110} basins={2} vertical />
      <WasherDryer x={134} y={400} />
      <Vanity x={322} y={108} w={84} h={18} basins={2} />
      <Tub x={430} y={110} w={92} h={40} />
      <Toilet x={519} y={205} dir="left" />
      <g stroke={FIXTURE} strokeWidth={0.7} fill="none"><line x1={321} y1={268} x2={527} y2={268} /><line x1={321} y1={273} x2={527} y2={273} /></g>
      <Stair x={588} y={442} w={52} h={202} />

      {/* doors */}
      <Door x={195} y={218} len={34} rot={270} />
      <Door x={240} y={285} len={32} rot={0} mirror />
      <Door x={240} y={395} len={30} rot={0} mirror />
      <Door x={265} y={218} len={30} rot={270} />
      <Door x={360} y={260} len={38} rot={270} />
      <Door x={531} y={115} len={40} rot={0} />
      <Door x={550} y={367} len={34} rot={270} />
      <Door x={317} y={398} len={34} rot={0} />
      <Door x={308} y={438} len={38} rot={90} />
      <Door x={468} y={438} len={38} rot={90} />

      {/* room labels */}
      {[...ROOMS, b2].map((r) => (
        <g key={`lbl${r.name}${r.sf}${r.x}`}>
          {r.name
            ? (<><text x={r.x + r.w / 2} y={r.y + r.h / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>{r.name}</text>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 13} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text></>)
            : (<text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text>)}
        </g>
      ))}
      {/* Bedroom 3 label (SF bold yellow when modified, on Incoming) */}
      <text x={b3.x + b3.w / 2} y={538} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>BEDROOM 3</text>
      <text x={b3.x + b3.w / 2} y={553} textAnchor="middle" fontSize={incoming ? 11 : 10} fontWeight={incoming ? 700 : 400} fill={incoming ? YELLOW : FIXTURE}>{b3SF}</text>

      {/* === DETECTED CHANGES === */}
      {/* Bath 2 (39 SF) toilet: solid in Current; red dashed ghost in Incoming (removed) */}
      <Toilet x={236} y={300} dir="left" color={incoming ? TYPE_META.removed.color : FIXTURE} bold={incoming} dashed={incoming} />

      {/* added corridor doors — green, Incoming only */}
      {incoming && (<>
        <Door x={584} y={375} len={30} rot={0} mirror accent={TYPE_META.added.color} />
        <Door x={584} y={407} len={28} rot={0} mirror accent={TYPE_META.added.color} />
      </>)}

      {/* modified partition — moved Bedroom 3 wall drawn yellow, Incoming only */}
      {incoming && wallRect({ d: 'v', y1: 438, y2: 650, x: b3Left, t: T_INT }, 'b3y', YELLOW, YELLOW, 1)}

      {/* lettered markers; only the Bedroom 3 boundary change carries an area rect */}
      {marked.map((c) => {
        const color = TYPE_META[c.type].color
        const active = focus === c.id
        const letter = String.fromCharCode(65 + CHANGES.findIndex((x) => x.id === c.id))
        const dots = c.id === 'doors' ? [{ x: 566, y: 388 }, { x: 566, y: 419 }]
          : c.id === 'bedroom3' ? [{ x: 362, y: 602 }, { x: 508, y: 551 }]
          : [c.marker]
        const rect = c.id === 'bedroom3' ? HILITE.bedroom3 : null
        return (
          <g key={c.id}>
            {rect && <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} rx={6} fill={color} fillOpacity={active ? 0.16 : 0.08} stroke={color} strokeWidth={active ? 3 : 2} strokeOpacity={0.9} strokeDasharray="7 4" />}
            {dots.map((m, i) => (
              <g key={i}>
                <circle cx={m.x} cy={m.y} r={13} fill={color} stroke="#fff" strokeWidth={2} />
                <text x={m.x} y={m.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">{letter}</text>
              </g>
            ))}
          </g>
        )
      })}

      {/* grid bubbles (on top) */}
      {V_GRID.map((g) => <g key={`vb${g.l}`}><circle cx={g.x} cy={62} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} /><text x={g.x} y={66} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text></g>)}
      {H_GRID.map((g) => <g key={`hb${g.l}`}><circle cx={ENV.x + ENV.w + 26} cy={g.y} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} /><text x={ENV.x + ENV.w + 26} y={g.y + 4} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text></g>)}
    </svg>
  )
}
