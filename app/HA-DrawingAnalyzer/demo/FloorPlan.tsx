// app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
// Inline-SVG reproduction of Veev sheet A102 "Floor Plan – Second Floor",
// monochrome CD convention (black ink + gray wall poché + light floor hatch),
// drawn to read like the PDF:
//   • walls as thick gray-poché rectangles
//   • doors: solid leaf rectangle perpendicular to the wall + dashed swing arc,
//     sitting in a clean punched opening (never clashing the poché)
//   • plumbing fixtures with their backs flush to walls (tubs, double vanities,
//     toilets, W/D), small utility shafts with ⊗ vents, a stair to the level
//     below, mullion windows, dashed gridlines + bubbles
//
// Detected changes render as *coloured objects* on the pane that carries them
// (removed → Current, added/modified → Incoming), plus a numbered marker and a
// dashed locating tint. The modified partition is drawn yellow and its SF label
// turns bold yellow. `focus` strengthens one change; `viewBox` crops thumbnails.

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
  { d: 'h', x1: 120, x2: 880, y: 100, t: T_EXT },
  { d: 'h', x1: 120, x2: 880, y: 650, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 120, t: T_EXT },
  { d: 'v', y1: 100, y2: 650, x: 880, t: T_EXT },
  { d: 'v', y1: 100, y2: 438, x: 240, t: T_INT },
  { d: 'v', y1: 100, y2: 438, x: 317, t: T_INT },
  { d: 'v', y1: 100, y2: 367, x: 531, t: T_INT },
  { d: 'v', y1: 100, y2: 650, x: 584, t: T_INT },
  { d: 'h', x1: 120, x2: 317, y: 218, t: T_INT },
  { d: 'h', x1: 317, x2: 531, y: 260, t: T_INT },
  { d: 'h', x1: 240, x2: 317, y: 308, t: T_INT },
  { d: 'h', x1: 120, x2: 240, y: 349, t: T_INT },
  { d: 'h', x1: 531, x2: 584, y: 170, t: T_INT }, // shaft 10 / hall split
  { d: 'h', x1: 317, x2: 880, y: 367, t: T_INT },
  { d: 'h', x1: 120, x2: 584, y: 438, t: T_INT },
  { d: 'h', x1: 262, x2: 484, y: 490, t: T_INT },
  { d: 'v', y1: 438, y2: 490, x: 262, t: T_INT },
  { d: 'v', y1: 438, y2: 490, x: 484, t: T_INT },
]

type RoomDef = { name: string; sf: string; x: number; y: number; w: number; h: number; wet?: boolean }
const ROOMS: RoomDef[] = [
  { name: 'BATH 2', sf: '32 SF', x: 120, y: 100, w: 120, h: 118, wet: true },
  { name: '', sf: '25 SF', x: 240, y: 100, w: 77, h: 118, wet: true },
  { name: 'PRIMARY BATH', sf: '163 SF', x: 317, y: 100, w: 214, h: 160, wet: true },
  { name: 'PRIMARY BDRM', sf: '254 SF', x: 584, y: 100, w: 296, h: 267 },
  { name: 'BATH 2', sf: '39 SF', x: 120, y: 218, w: 120, h: 131, wet: true },
  { name: 'LINEN', sf: '9 SF', x: 240, y: 218, w: 77, h: 90 },
  { name: 'WALK-IN CLOSET', sf: '98 SF', x: 317, y: 260, w: 214, h: 107 },
  { name: 'LAUNDRY', sf: '52 SF', x: 120, y: 349, w: 120, h: 89 },
  { name: 'CORRIDOR', sf: '144 SF', x: 317, y: 367, w: 267, h: 71 },
  { name: 'BONUS ROOM', sf: '366 SF', x: 584, y: 367, w: 296, h: 283 },
  { name: 'BEDROOM 2', sf: '126 SF', x: 120, y: 438, w: 242, h: 212 },
]
const CLOSETS: RoomDef[] = [
  { name: '', sf: '12 SF', x: 262, y: 438, w: 100, h: 52 },
  { name: '', sf: '12 SF', x: 384, y: 438, w: 100, h: 52 },
]
// blank floors (hatch only, no label): hall + shaft-4 lobby
const BLANK: RoomDef[] = [
  { name: '', sf: '', x: 531, y: 170, w: 53, h: 197 },
  { name: '', sf: '', x: 240, y: 308, w: 77, h: 130 },
]

const SHAFTS = [
  { x: 531, y: 100, w: 53, h: 70, sf: '10 SF', vents: 2 },
  { x: 246, y: 312, w: 54, h: 52, sf: '4 SF', vents: 1 },
  { x: 646, y: 374, w: 44, h: 46, sf: '3 SF', vents: 1 },
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
  bedroom3: { x: 320, y: 436, w: 110, h: 210 },
  toilet: { x: 122, y: 252, w: 120, h: 96 },
}

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

// Door: leaf rectangle perpendicular to wall + dashed quarter-arc swing.
// rot: 0 leaf→right (opening↓), 90 leaf→down (opening←), 180 leaf→left (opening↑), 270 leaf→up (opening→)
function Door({ x, y, len = 34, rot = 0, accent }: { x: number; y: number; len?: number; rot?: number; accent?: string }) {
  const c = accent ?? INK
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
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
// Toilet anchored with the tank BACK at (x,y) on the wall; bowl points `dir` into the room.
const TROT: Record<string, number> = { down: 0, up: 180, left: 90, right: 270 }
function Toilet({ x, y, dir = 'down', color = FIXTURE, bold = false }: { x: number; y: number; dir?: 'up' | 'down' | 'left' | 'right'; color?: string; bold?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${TROT[dir]})`} stroke={color} strokeWidth={bold ? 2.2 : 1} fill="none">
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
      <rect x={x} y={y} width={26} height={26} /><circle cx={x + 13} cy={y + 13} r={8} />
      <rect x={x + 30} y={y} width={26} height={26} /><circle cx={x + 43} cy={y + 13} r={8} />
    </g>
  )
}
function Shaft({ x, y, w, h, sf, vents }: { x: number; y: number; w: number; h: number; sf: string; vents: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fff" stroke={INK} strokeWidth={0.8} />
      <g stroke={FIXTURE} strokeWidth={0.8} fill="none">
        {Array.from({ length: vents }).map((_, i) => {
          const cx = x + w / 2, cy = y + (h / (vents + 1)) * (i + 1)
          return <g key={i}><circle cx={cx} cy={cy} r={6} /><line x1={cx - 4.2} y1={cy - 4.2} x2={cx + 4.2} y2={cy + 4.2} /><line x1={cx - 4.2} y1={cy + 4.2} x2={cx + 4.2} y2={cy - 4.2} /></g>
        })}
      </g>
      <text x={x + w + 3} y={y + 9} fontSize={8} fontWeight={600} fill={INK}>SHAFT</text>
      <text x={x + w + 3} y={y + 19} fontSize={8} fill={FIXTURE}>{sf}</text>
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

  const labeled = [...ROOMS, ...CLOSETS]
  const hatchRects = [...ROOMS, ...CLOSETS, ...BLANK, { name: '', sf: '', x: b3Left, y: 438, w: 584 - b3Left, h: 212 }]
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

      {/* door openings (clean white gaps) */}
      {gap(195, 218, 34, 'h', 'g1')}
      {gap(360, 260, 38, 'h', 'g2')}
      {gap(400, 367, 38, 'h', 'g3')}
      {gap(164, 438, 38, 'h', 'g4')}
      {gap(430, 438, 38, 'h', 'g5')}
      {gap(584, 240, 40, 'v', 'g6')}
      {gap(317, 150, 34, 'v', 'g7')}
      {gap(540, 367, 36, 'h', 'g8')}
      {incoming && gap(317, 393, 32, 'v', 'ga1')}
      {incoming && gap(584, 393, 32, 'v', 'ga2')}

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
      <Vanity x={126} y={238} w={28} h={100} basins={2} vertical />
      <WasherDryer x={138} y={356} />
      <Vanity x={322} y={108} w={84} h={18} basins={2} />
      <Tub x={430} y={110} w={92} h={40} />
      <Toilet x={527} y={150} dir="left" />
      <g stroke={FIXTURE} strokeWidth={0.7} fill="none"><line x1={321} y1={268} x2={527} y2={268} /><line x1={321} y1={273} x2={527} y2={273} /></g>
      {SHAFTS.map((s, i) => <Shaft key={i} {...s} />)}
      <Stair x={596} y={400} w={52} h={210} />

      {/* doors */}
      <Door x={195} y={218} len={34} rot={270} />
      <Door x={360} y={260} len={38} rot={270} />
      <Door x={400} y={367} len={38} rot={270} />
      <Door x={164} y={438} len={38} rot={90} />
      <Door x={430} y={438} len={38} rot={90} />
      <Door x={584} y={240} len={40} rot={0} />
      <Door x={317} y={150} len={34} rot={0} />
      <Door x={540} y={367} len={36} rot={270} />

      {/* room labels */}
      {labeled.map((r) => (
        <g key={`lbl${r.name}${r.sf}${r.x}`}>
          {r.name
            ? (<><text x={r.x + r.w / 2} y={r.y + r.h / 2 - 2} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>{r.name}</text>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 13} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text></>)
            : (<text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle" fontSize={10} fill={FIXTURE}>{r.sf}</text>)}
        </g>
      ))}
      {/* Bedroom 3 label (SF turns bold yellow when modified, on Incoming) */}
      <text x={b3Left + (584 - b3Left) / 2} y={538} textAnchor="middle" fontSize={12} fontWeight={600} fill={INK}>BEDROOM 3</text>
      <text x={b3Left + (584 - b3Left) / 2} y={553} textAnchor="middle" fontSize={incoming ? 11 : 10} fontWeight={incoming ? 700 : 400} fill={incoming ? YELLOW : FIXTURE}>{b3SF}</text>

      {/* === DETECTED CHANGES (coloured objects) === */}
      {/* removed toilet — red, Current pane only, back flush to right wall of Bath 2 (39 SF) */}
      {!incoming && <Toilet x={236} y={300} dir="left" color={TYPE_META.removed.color} bold />}

      {/* added corridor doors — green, Incoming only */}
      {incoming && (<>
        <Door x={317} y={393} len={32} rot={0} accent={TYPE_META.added.color} />
        <Door x={584} y={393} len={32} rot={180} accent={TYPE_META.added.color} />
      </>)}

      {/* modified partition — moved Bedroom 3 wall drawn yellow, Incoming only */}
      {incoming && wallRect({ d: 'v', y1: 438, y2: 650, x: b3Left, t: T_INT }, 'b3y', YELLOW, YELLOW, 1)}

      {/* dashed locating tint + numbered marker for each marked change */}
      {marked.map((c) => {
        const r = HILITE[c.id]
        const color = TYPE_META[c.type].color
        const active = focus === c.id
        const idx = CHANGES.findIndex((x) => x.id === c.id) + 1
        return (
          <g key={c.id}>
            {r && <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={color} fillOpacity={active ? 0.16 : 0.08} stroke={color} strokeWidth={active ? 3 : 2} strokeOpacity={0.9} strokeDasharray="7 4" />}
            <circle cx={c.marker.x} cy={c.marker.y} r={13} fill={color} stroke="#fff" strokeWidth={2} />
            <text x={c.marker.x} y={c.marker.y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">{idx}</text>
          </g>
        )
      })}

      {/* grid bubbles (on top) */}
      {V_GRID.map((g) => <g key={`vb${g.l}`}><circle cx={g.x} cy={62} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} /><text x={g.x} y={66} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text></g>)}
      {H_GRID.map((g) => <g key={`hb${g.l}`}><circle cx={ENV.x + ENV.w + 26} cy={g.y} r={12} fill="#fff" stroke={GRID} strokeWidth={0.8} /><text x={ENV.x + ENV.w + 26} y={g.y + 4} textAnchor="middle" fontSize={11} fill={FIXTURE}>{g.l}</text></g>)}
    </svg>
  )
}
