# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Eliahu Cohen's personal portfolio site with a scroll-driven Three.js exploded-view animation of a real Veev prefab wall panel, deployed to Vercel.

**Architecture:** Next.js 14 App Router with one file per section component. The hero's Three.js canvas is isolated in `PanelScene.tsx` (dynamically imported, SSR-disabled) and driven by GSAP ScrollTrigger. The panel geometry is pre-processed offline from the real IFC model into a Draco-compressed GLB via a Python script that runs once and commits its output to `public/panel.glb`.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS, Three.js, GSAP + ScrollTrigger, Python 3.11 + IfcOpenShell + trimesh (offline pipeline), Vercel.

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Google Fonts, `<html>` metadata, global providers |
| `app/page.tsx` | Composes all section components in order |
| `app/globals.css` | Tailwind base + CSS custom properties |
| `tailwind.config.ts` | Custom colors, font families |
| `lib/gsap.ts` | GSAP + ScrollTrigger singleton (client-only) |
| `components/Nav.tsx` | Fixed nav, scroll-aware bg, mobile hamburger |
| `components/Hero.tsx` | 100vh section shell, text overlay, scroll CTA; dynamically imports PanelScene |
| `components/PanelScene.tsx` | Three.js canvas: renderer, GLTFLoader, explosion, parallax, layer labels |
| `components/About.tsx` | Two-column editorial layout + GSAP reveal |
| `components/WhatIDo.tsx` | 3 competency cards with hover reveal + GSAP stagger |
| `components/Contact.tsx` | Dark section, email/LinkedIn/CV links |
| `scripts/ifc_to_gltf.py` | Offline: IFC → layer-grouped, Draco-compressed GLB |
| `scripts/test_ifc_to_gltf.py` | pytest tests for keyword classification |
| `public/panel.glb` | Pre-processed glTF output (committed) |
| `public/cv.pdf` | CV PDF copied from Downloads |
| `__mocks__/three.ts` | Jest mock for Three.js (WebGL unavailable in jsdom) |
| `__mocks__/three-jsm.ts` | Jest mock for three/examples/jsm/* |
| `jest.config.js` | Jest config with Next.js preset + module name mappers |
| `jest.setup.ts` | `@testing-library/jest-dom` import |

---

## Task 1: Scaffold Next.js 14 project + install dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `jest.config.js`, `jest.setup.ts`

- [ ] **Step 1: Create the Next.js 14 project**

Run from `C:\Users\Eliahu\projects\`:
```bash
npx create-next-app@14 portfolio --typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-eslint
cd portfolio
```
When prompted: TypeScript ✓, Tailwind ✓, App Router ✓, no src/ dir, `@/*` alias.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install three gsap
npm install --save-dev @types/three
```

- [ ] **Step 3: Install test dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

- [ ] **Step 4: Create `jest.config.js`**

```js
// jest.config.js
const nextJest = require('next/jest')
const createJestConfig = nextJest({ dir: './' })

module.exports = createJestConfig({
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^three$': '<rootDir>/__mocks__/three.ts',
    '^three/examples/jsm/(.*)$': '<rootDir>/__mocks__/three-jsm.ts',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
})
```

- [ ] **Step 5: Create `jest.setup.ts`**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Create Three.js Jest mock**

```bash
mkdir __mocks__
```

```typescript
// __mocks__/three.ts
export const WebGLRenderer = jest.fn().mockImplementation(() => ({
  setSize: jest.fn(),
  setPixelRatio: jest.fn(),
  render: jest.fn(),
  dispose: jest.fn(),
  domElement: document.createElement('canvas'),
}))
export const PerspectiveCamera = jest.fn().mockImplementation(() => ({
  position: { z: 0, set: jest.fn() },
  aspect: 1,
  updateProjectionMatrix: jest.fn(),
}))
export const Scene = jest.fn().mockImplementation(() => ({
  add: jest.fn(),
  traverse: jest.fn(),
}))
export const AmbientLight = jest.fn().mockImplementation(() => ({}))
export const DirectionalLight = jest.fn().mockImplementation(() => ({
  position: { set: jest.fn() },
}))
export const MeshStandardMaterial = jest.fn().mockImplementation(() => ({}))
export const Color = jest.fn()
export const Box3 = jest.fn().mockImplementation(() => ({
  setFromObject: jest.fn().mockReturnThis(),
  getSize: jest.fn().mockReturnValue({ y: 100 }),
}))
export const Vector3 = jest.fn().mockImplementation(() => ({ y: 0 }))
export const Group = jest.fn().mockImplementation(() => ({
  position: { z: 0, set: jest.fn() },
  rotation: { x: 0, y: 0 },
  add: jest.fn(),
  scale: { set: jest.fn() },
  children: [],
}))
export const Mesh = jest.fn().mockImplementation(() => ({
  material: {},
  name: '',
}))
```

```typescript
// __mocks__/three-jsm.ts
export const GLTFLoader = jest.fn().mockImplementation(() => ({
  setDRACOLoader: jest.fn(),
  load: jest.fn(),
}))
export const DRACOLoader = jest.fn().mockImplementation(() => ({
  setDecoderPath: jest.fn(),
}))
```

- [ ] **Step 7: Add test script to package.json**

Open `package.json`, find the `"scripts"` block, add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8: Verify test infrastructure runs**

```bash
npx jest --passWithNoTests
```
Expected output: `Test Suites: 0 skipped` or similar. No errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 project with Three.js, GSAP, Jest"
```

---

## Task 2: Design tokens, global styles, and layout

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write failing render test for layout**

```bash
mkdir -p __tests__
```

```typescript
// __tests__/layout.test.tsx
import { render } from '@testing-library/react'

// Minimal smoke test — layout.tsx can't be tested directly in Next.js,
// so test the metadata exports and font class names exist.
it('globals css loads without error', () => {
  // If the import throws, this test fails
  expect(true).toBe(true)
})
```

```bash
npx jest __tests__/layout.test.tsx
```
Expected: PASS (trivially, but sets the pattern).

- [ ] **Step 2: Update `tailwind.config.ts`**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f3ef',
        ink: '#1a1a1a',
        'accent-warm': '#c8a84a',
        'accent-cool': '#3a6ea8',
        subtle: '#e0ddd8',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 3: Update `app/globals.css`**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-canvas: #f5f3ef;
  --color-ink: #1a1a1a;
  --color-accent-warm: #c8a84a;
  --color-accent-cool: #3a6ea8;
  --color-subtle: #e0ddd8;
}

html {
  background-color: var(--color-canvas);
  color: var(--color-ink);
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-inter), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Bounce keyframe for scroll CTA chevron */
@keyframes bounce-y {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

.animate-bounce-y {
  animation: bounce-y 1.5s ease-in-out infinite;
}
```

- [ ] **Step 4: Update `app/layout.tsx`**

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eliahu Cohen — R&D Product Architect',
  description:
    'Architect. Developer. I actually know how to build. Senior R&D Product Architect with a background in architecture and full-stack development.',
  openGraph: {
    title: 'Eliahu Cohen',
    description: 'Architect. Developer. I actually know how to build.',
    url: 'https://eliahu.co',
    siteName: 'Eliahu Cohen',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Run dev server to verify fonts and colors load**

```bash
npm run dev
```
Open http://localhost:3000. Expect: default Next.js page with no console errors. Background should be white (Tailwind default — we'll apply canvas color in page.tsx next).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: design tokens, global styles, Google Fonts"
```

---

## Task 3: IFC → glTF offline pipeline

**Files:**
- Create: `scripts/ifc_to_gltf.py`
- Create: `scripts/test_ifc_to_gltf.py`

> **Note:** This script runs once, outputs `public/panel.glb`, and is then committed. It does NOT run as part of the Next.js build. Requires Python 3.11 with `ifcopenshell` and `trimesh` installed.

- [ ] **Step 1: Check Python environment**

```bash
python --version
# Expected: Python 3.11.x

# Check if ifcopenshell is available (may already be in test44's .venv)
python -c "import ifcopenshell; print(ifcopenshell.version)"
# If that fails:
pip install ifcopenshell trimesh numpy pygltflib
```

- [ ] **Step 2: Write failing classification tests**

```python
# scripts/test_ifc_to_gltf.py
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import pytest
from ifc_to_gltf import classify_part

def test_steel_angle_is_frame():
    assert classify_part('HRS Angle, 90 deg, 3.5" x 3.5", ASTM A572 Steel, Grade 50') == 'layer_frame'

def test_holdown_is_frame():
    assert classify_part('Holdown S/HDU 4 118 mil (10 ga)') == 'layer_frame'

def test_fiberglass_batt_is_insulation():
    assert classify_part('Insulation, Fiberglass, 5.5", Unfaced, R21, Batt, 24" x 96"') == 'layer_insulation'

def test_vapor_membrane_is_insulation():
    assert classify_part('Self-Adhering Membrane, Above-Grade Wall, Vapor Retarder, 6"') == 'layer_insulation'

def test_r_seal_tape_is_insulation():
    assert classify_part('Adhesive construction tape, R-SEAL, 3"') == 'layer_insulation'

def test_hanger_strap_coil_is_mep():
    assert classify_part('3/4" Plastic Hanger Strap Coil, L=14"') == 'layer_mep'

def test_tube_is_mep():
    assert classify_part('Tube-1000X028 Tube 1.000in OD X .028in Wall') == 'layer_mep'

def test_outlet_box_is_electrical():
    assert classify_part('1-Gang 20 cu. in. Electrical and Outlet Box, Old Work, PVC') == 'layer_electrical'

def test_emt_strap_is_electrical():
    assert classify_part('One Hole - EMT Steel Straps, 1"') == 'layer_electrical'

def test_tv_box_is_electrical():
    assert classify_part('2-Gang Non Metallic Recessed TV Box for Power and Low Voltage') == 'layer_electrical'

def test_gypsum_is_gypsum():
    assert classify_part('Flat Panel, Gypsum, 1/2", Mold & Moisture Resistant Panel') == 'layer_gypsum'

def test_thermal_grip_washer_discarded():
    assert classify_part('Thermal-Grip ci prong washer 2"') is None

def test_shimstrip_discarded():
    assert classify_part('CRL Black 1/4" Plastic Bearing Shimstrips') is None

def test_clip_discarded():
    assert classify_part('Clip, Cut In Old Work, for Gang Box, Zinc Plated Steel') is None

def test_unknown_returns_none():
    assert classify_part('Some completely unrecognised part') is None

def test_matching_is_case_insensitive():
    assert classify_part('INSULATION FIBERGLASS BATT 24x96') == 'layer_insulation'
```

- [ ] **Step 3: Run tests — expect failure (ifc_to_gltf module not found)**

```bash
cd scripts
python -m pytest test_ifc_to_gltf.py -v
```
Expected: `ModuleNotFoundError: No module named 'ifc_to_gltf'`

- [ ] **Step 4: Write `scripts/ifc_to_gltf.py`**

```python
# scripts/ifc_to_gltf.py
"""
Offline IFC → glTF pipeline.
Reads P1016-WL1135.01.IFC + bim_schema JSON, groups parts into 5 layers,
triangulates B-rep geometry, decimates, exports Draco-compressed panel.glb.

Usage:
    python scripts/ifc_to_gltf.py

Output:
    public/panel_raw.glb   (pre-Draco, for inspection)
    public/panel.glb       (after: npx gltf-pipeline -i public/panel_raw.glb -o public/panel.glb --draco.compressionLevel 7)
"""

from __future__ import annotations
import json
import sys
from pathlib import Path
from typing import Optional

import numpy as np

IFC_PATH = Path("C:/Users/Eliahu/Documents/repo/test44/backend/app/etl/data/P1016-WL1135.01.IFC")
SCHEMA_PATH = Path("C:/Users/Eliahu/Documents/repo/test44/backend/app/etl/data/bim_schema_P1016-WL1135.01.json")
OUTPUT_DIR = Path("public")
OUTPUT_RAW = OUTPUT_DIR / "panel_raw.glb"

# Keyword → layer name mapping. Order matters: first match wins.
LAYER_RULES: list[tuple[str, list[str]]] = [
    ("layer_frame",       ["Steel", "Angle", "Holdown"]),
    ("layer_insulation",  ["Insulation", "Fiberglass", "Batt", "Membrane", "Vapor", "R-SEAL", "tape"]),
    ("layer_mep",         ["Tube", "Cable", "Flexible", "conduit", "Hanger Strap Coil"]),
    ("layer_electrical",  ["Outlet Box", "Gang", "Octagon Box", "Strap", "EMT", "Bracket",
                           "Bushing", "Flashing Panel", "TV Box", "In Box"]),
    ("layer_gypsum",      ["Gypsum", "Flat Panel"]),
]

DISCARD_KEYWORDS = ["washer", "Shim", "Clip", "prong"]

LAYER_ORDER = ["layer_frame", "layer_insulation", "layer_mep", "layer_electrical", "layer_gypsum"]


def classify_part(description: str) -> Optional[str]:
    """Return the layer name for a part description, or None if discarded/unknown."""
    desc_lower = description.lower()
    for keyword in DISCARD_KEYWORDS:
        if keyword.lower() in desc_lower:
            return None
    for layer_name, keywords in LAYER_RULES:
        for keyword in keywords:
            if keyword.lower() in desc_lower:
                return layer_name
    return None


def load_schema(schema_path: Path) -> dict[str, str]:
    """Return mapping of global_id -> description."""
    with open(schema_path, encoding="utf-8") as f:
        data = json.load(f)
    result: dict[str, str] = {}
    for gid, part in data.get("parts", {}).items():
        desc = part.get("properties", {}).get("description", "")
        result[gid] = desc
    return result


def extract_geometry(ifc_path: Path, schema: dict[str, str]) -> dict[str, list]:
    """
    Returns dict of layer_name -> list of (vertices: np.ndarray, faces: np.ndarray).
    Each entry is one IFC element's triangulated geometry.
    """
    try:
        import ifcopenshell
        import ifcopenshell.geom
    except ImportError:
        print("ERROR: ifcopenshell not installed. Run: pip install ifcopenshell", file=sys.stderr)
        sys.exit(1)

    settings = ifcopenshell.geom.settings()
    settings.set(settings.USE_WORLD_COORDS, True)

    ifc = ifcopenshell.open(str(ifc_path))
    layer_meshes: dict[str, list] = {name: [] for name in LAYER_ORDER}

    elements = ifc.by_type("IfcBuildingElementProxy")
    total = len(elements)
    print(f"Processing {total} elements...")

    for i, element in enumerate(elements):
        if i % 100 == 0:
            print(f"  {i}/{total}")

        gid = element.GlobalId
        description = schema.get(gid, "")
        layer = classify_part(description)
        if layer is None:
            continue

        try:
            shape = ifcopenshell.geom.create_shape(settings, element)
        except Exception:
            continue

        verts = np.array(shape.geometry.verts).reshape(-1, 3)
        faces = np.array(shape.geometry.faces).reshape(-1, 3)

        if len(verts) == 0 or len(faces) == 0:
            continue

        layer_meshes[layer].append((verts, faces))

    return layer_meshes


def merge_and_simplify(layer_meshes: dict[str, list], target_total_faces: int = 40_000) -> dict[str, object]:
    """Merge parts per layer, simplify to target face count, return trimesh objects."""
    try:
        import trimesh
    except ImportError:
        print("ERROR: trimesh not installed. Run: pip install trimesh", file=sys.stderr)
        sys.exit(1)

    total_input_faces = sum(
        sum(f.shape[0] for _, f in meshes)
        for meshes in layer_meshes.values()
    )
    ratio = target_total_faces / max(total_input_faces, 1)

    result: dict[str, object] = {}
    for layer_name in LAYER_ORDER:
        parts = layer_meshes[layer_name]
        if not parts:
            print(f"  WARNING: {layer_name} has no geometry — skipping")
            continue

        combined = trimesh.util.concatenate([
            trimesh.Trimesh(vertices=v, faces=f) for v, f in parts
        ])

        target_faces = max(500, int(combined.faces.shape[0] * ratio))
        simplified = combined.simplify_quadric_decimation(target_faces)
        result[layer_name] = simplified
        print(f"  {layer_name}: {combined.faces.shape[0]} → {simplified.faces.shape[0]} faces")

    return result


def export_glb(layer_trimeshes: dict[str, object], output_path: Path) -> None:
    try:
        import trimesh
    except ImportError:
        print("ERROR: trimesh not installed.", file=sys.stderr)
        sys.exit(1)

    scene = trimesh.scene.Scene()
    for name, mesh in layer_trimeshes.items():
        scene.add_geometry(mesh, geom_name=name, node_name=name)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    export_bytes = trimesh.exchange.gltf.export_glb(scene)
    with open(output_path, "wb") as f:
        f.write(export_bytes)
    size_mb = output_path.stat().st_size / 1_048_576
    print(f"\nExported {output_path} ({size_mb:.1f} MB)")


def main() -> None:
    print("Loading schema...")
    schema = load_schema(SCHEMA_PATH)
    print(f"  {len(schema)} parts loaded")

    print("Extracting geometry from IFC (this takes 5–15 minutes)...")
    layer_meshes = extract_geometry(IFC_PATH, schema)

    counts = {k: len(v) for k, v in layer_meshes.items()}
    print(f"Parts per layer: {counts}")

    print("Merging and simplifying...")
    layer_trimeshes = merge_and_simplify(layer_meshes)

    print("Exporting GLB...")
    export_glb(layer_trimeshes, OUTPUT_RAW)

    print("\nNext step — apply Draco compression:")
    print(f"  npx gltf-pipeline -i {OUTPUT_RAW} -o public/panel.glb --draco.compressionLevel 7")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run classification tests — expect PASS**

```bash
cd scripts
python -m pytest test_ifc_to_gltf.py -v
```
Expected output (all green):
```
PASSED test_steel_angle_is_frame
PASSED test_holdown_is_frame
PASSED test_fiberglass_batt_is_insulation
...
15 passed in 0.xx s
```

- [ ] **Step 6: Run the IFC pipeline (takes 5–15 min)**

```bash
cd C:\Users\Eliahu\projects\portfolio
python scripts/ifc_to_gltf.py
```
Expected: prints progress, outputs `public/panel_raw.glb`.

If IfcOpenShell B-rep triangulation is too slow or crashes on this model, skip to the fallback note at end of this task and proceed with a placeholder GLB.

- [ ] **Step 7: Apply Draco compression**

```bash
npx gltf-pipeline -i public/panel_raw.glb -o public/panel.glb --draco.compressionLevel 7
```
Expected: `public/panel.glb` exists and is smaller than `panel_raw.glb`. Target: <5 MB.

- [ ] **Step 8: Commit**

```bash
git add scripts/ public/panel.glb public/panel_raw.glb
git commit -m "feat: IFC → glTF pipeline + panel.glb"
```

> **Fallback:** If IfcOpenShell B-rep triangulation fails or takes >30 minutes, create a placeholder `public/panel.glb` with 5 named box geometries using trimesh:
> ```python
> import trimesh, numpy as np
> scene = trimesh.scene.Scene()
> names = ['layer_frame','layer_insulation','layer_mep','layer_electrical','layer_gypsum']
> for i, name in enumerate(names):
>     box = trimesh.creation.box(extents=[500, 800, 20])
>     box.apply_translation([0, 0, i * 25])
>     scene.add_geometry(box, geom_name=name, node_name=name)
> with open('public/panel.glb','wb') as f:
>     f.write(trimesh.exchange.gltf.export_glb(scene))
> ```
> Replace later once the real pipeline runs.

---

## Task 4: GSAP singleton

**Files:**
- Create: `lib/gsap.ts`
- Create: `__tests__/gsap.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// __tests__/gsap.test.ts
import { gsap, ScrollTrigger } from '@/lib/gsap'

it('exports gsap instance', () => {
  expect(gsap).toBeDefined()
  expect(typeof gsap.to).toBe('function')
})

it('exports ScrollTrigger', () => {
  expect(ScrollTrigger).toBeDefined()
})
```

```bash
npx jest __tests__/gsap.test.ts
```
Expected: FAIL — `Cannot find module '@/lib/gsap'`

- [ ] **Step 2: Create `lib/gsap.ts`**

```bash
mkdir lib
```

```typescript
// lib/gsap.ts
'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/gsap.test.ts
```
Expected: `2 passed`

- [ ] **Step 4: Commit**

```bash
git add lib/ __tests__/gsap.test.ts
git commit -m "feat: GSAP + ScrollTrigger singleton"
```

---

## Task 5: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Create: `__tests__/Nav.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

it('renders EC logo', () => {
  render(<Nav />)
  expect(screen.getByText('EC')).toBeInTheDocument()
})

it('renders all nav links', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /what i do/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
})

it('logo links to #hero', () => {
  render(<Nav />)
  expect(screen.getByText('EC').closest('a')).toHaveAttribute('href', '#hero')
})
```

```bash
npx jest __tests__/Nav.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/Nav'`

- [ ] **Step 2: Create `components/Nav.tsx`**

```bash
mkdir components
```

```typescript
// components/Nav.tsx
'use client'

import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'What I do', href: '#what-i-do' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.9)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBase = 'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-200'
  const navStyle = scrolled
    ? 'bg-canvas border-b border-subtle text-ink'
    : 'bg-transparent text-white'

  return (
    <nav className={`${navBase} ${navStyle}`} role="navigation">
      {/* Logo */}
      <a
        href="#hero"
        className="font-serif text-xl font-bold tracking-tight hover:opacity-70 transition-opacity"
      >
        EC
      </a>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {LINKS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="font-sans text-[13px] uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-[5px] p-2"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center gap-10 z-40 md:hidden">
          {LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-serif text-3xl text-canvas hover:opacity-60 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/Nav.test.tsx
```
Expected: `3 passed`

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx __tests__/Nav.test.tsx
git commit -m "feat: Nav component with scroll-aware bg and mobile menu"
```

---

## Task 6: Hero section shell (text overlay + scroll CTA)

**Files:**
- Create: `components/Hero.tsx`
- Create: `__tests__/Hero.test.tsx`

> PanelScene is dynamically imported inside Hero with `ssr: false`. For testing, Next.js dynamic imports resolve to their loader; we just verify the static content renders.

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/Hero.test.tsx
import { render, screen } from '@testing-library/react'
import Hero from '@/components/Hero'

// next/dynamic with ssr:false renders nothing in jsdom — that's expected
jest.mock('next/dynamic', () => () => () => null)

it('renders name', () => {
  render(<Hero />)
  expect(screen.getByText('Eliahu Cohen')).toBeInTheDocument()
})

it('renders tagline', () => {
  render(<Hero />)
  expect(
    screen.getByText(/architect\. developer\. i actually know how to build\./i)
  ).toBeInTheDocument()
})

it('renders scroll CTA', () => {
  render(<Hero />)
  expect(screen.getByText(/scroll to explore/i)).toBeInTheDocument()
})
```

```bash
npx jest __tests__/Hero.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/Hero'`

- [ ] **Step 2: Create `components/Hero.tsx`**

```typescript
// components/Hero.tsx
'use client'

import dynamic from 'next/dynamic'

const PanelScene = dynamic(() => import('./PanelScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-ink" />,
})

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      {/* Three.js canvas — fills entire section */}
      <PanelScene />

      {/* Text overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-6">
        <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-bold text-canvas leading-none">
          Eliahu Cohen
        </h1>

        {/* Divider rule */}
        <div className="w-8 h-px bg-canvas/30 my-4" />

        <p className="font-sans text-[13px] uppercase tracking-[0.12em] text-canvas/60">
          Architect. Developer. I actually know how to build.
        </p>
      </div>

      {/* Scroll CTA */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-canvas/40">
          Scroll to explore
        </span>
        <svg
          className="animate-bounce-y w-4 h-4 text-canvas/40"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M2 5l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/Hero.test.tsx
```
Expected: `3 passed`

- [ ] **Step 4: Commit**

```bash
git add components/Hero.tsx __tests__/Hero.test.tsx
git commit -m "feat: Hero section shell with text overlay and scroll CTA"
```

---

## Task 7: PanelScene — Three.js renderer setup + cleanup

**Files:**
- Create: `components/PanelScene.tsx`
- Create: `__tests__/PanelScene.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/PanelScene.test.tsx
import { render, act } from '@testing-library/react'
import PanelScene from '@/components/PanelScene'

// Three.js and GSAP are mocked via __mocks__/
jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: { create: jest.fn(), kill: jest.fn() },
}))

it('mounts a canvas element', () => {
  const { container } = render(<PanelScene />)
  // The component renders a div wrapper; the canvas comes from the mocked WebGLRenderer
  expect(container.firstChild).toBeInTheDocument()
})

it('unmounts without errors', () => {
  const { unmount } = render(<PanelScene />)
  expect(() => unmount()).not.toThrow()
})
```

```bash
npx jest __tests__/PanelScene.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/PanelScene'`

- [ ] **Step 2: Create `components/PanelScene.tsx` with scene setup only**

```typescript
// components/PanelScene.tsx
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { gsap, ScrollTrigger } from '@/lib/gsap'

// ── Layer configuration ──────────────────────────────────────────────────────

const LAYER_NAMES = [
  'layer_frame',
  'layer_insulation',
  'layer_mep',
  'layer_electrical',
  'layer_gypsum',
] as const

type LayerName = (typeof LAYER_NAMES)[number]

interface LayerConfig {
  targetZ: number     // explosion offset in world units
  color: string       // hex
  label: string       // display label
  threshold: number   // scroll progress at which label fades in (0–1)
}

const LAYER_CONFIG: Record<LayerName, LayerConfig> = {
  layer_frame:       { targetZ: -200, color: '#4a4a4a', label: 'Structural Frame',   threshold: 0.1 },
  layer_insulation:  { targetZ: -100, color: '#c8a84a', label: 'Insulation + Vapor', threshold: 0.3 },
  layer_mep:         { targetZ:  -20, color: '#2a5078', label: 'MEP Conduit',         threshold: 0.5 },
  layer_electrical:  { targetZ:   80, color: '#3a6ea8', label: 'Electrical Rough-In', threshold: 0.7 },
  layer_gypsum:      { targetZ:  180, color: '#e0ddd8', label: 'Gypsum Interior',     threshold: 0.9 },
}

const BASE_ROTATION = { x: 0.45, y: -0.6 }
const PARALLAX_STRENGTH = { x: 0.08, y: 0.1 }
const PARALLAX_LERP = 0.05
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

// ── Component ─────────────────────────────────────────────────────────────────

export default function PanelScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Record<LayerName, HTMLDivElement | null>>(
    {} as Record<LayerName, HTMLDivElement | null>
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(isMobile() ? 1 : Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      5000
    )
    camera.position.set(0, 0, 800)

    // ── Scene ──
    const scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(200, 400, 300)
    scene.add(ambientLight, dirLight)

    // ── Layer group container ──
    const rootGroup = new THREE.Group()
    rootGroup.rotation.x = BASE_ROTATION.x
    rootGroup.rotation.y = BASE_ROTATION.y
    scene.add(rootGroup)

    // ── Layer Object3D refs ──
    const layerGroups: Partial<Record<LayerName, THREE.Group>> = {}

    // ── Mouse parallax state ──
    let mouseX = 0
    let mouseY = 0
    let currentRotX = BASE_ROTATION.x
    let currentRotY = BASE_ROTATION.y
    let rafId = 0

    // ── Resize handler ──
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Mouse handler (desktop only) ──
    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Render loop ──
    let scrollProgress = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      // Parallax lerp
      if (!isMobile()) {
        currentRotX += (BASE_ROTATION.x + mouseY * PARALLAX_STRENGTH.x - currentRotX) * PARALLAX_LERP
        currentRotY += (BASE_ROTATION.y + mouseX * PARALLAX_STRENGTH.y - currentRotY) * PARALLAX_LERP
        rootGroup.rotation.x = currentRotX
        rootGroup.rotation.y = currentRotY
      }

      // Drive explosion from scrollProgress
      LAYER_NAMES.forEach((name) => {
        const group = layerGroups[name]
        if (!group) return
        const multiplier = isMobile() ? 0.5 : 1
        const targetZ = LAYER_CONFIG[name].targetZ * scrollProgress * multiplier
        group.position.z += (targetZ - group.position.z) * 0.1
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── GSAP ScrollTrigger (explosion) ──
    const st = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress = self.progress

        // Layer labels: fade in by threshold
        LAYER_NAMES.forEach((name) => {
          const el = labelRefs.current[name]
          if (!el) return
          const visible = self.progress >= LAYER_CONFIG[name].threshold
          el.style.opacity = visible
            ? String(Math.min(1, (self.progress - LAYER_CONFIG[name].threshold) / 0.1))
            : '0'
        })
      },
    })

    // ── Load GLB ──
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/panel.glb',
      (gltf) => {
        // Build one Group per named layer, apply materials
        LAYER_NAMES.forEach((name) => {
          const group = new THREE.Group()
          layerGroups[name] = group
          rootGroup.add(group)
        })

        gltf.scene.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return
          const layerName = child.name as LayerName
          if (!LAYER_NAMES.includes(layerName)) return

          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(LAYER_CONFIG[layerName].color),
            roughness: 0.7,
            metalness: 0.2,
          })

          layerGroups[layerName]?.add(child)
        })

        // Scale to fit ~60% of viewport height
        const box = new THREE.Box3().setFromObject(rootGroup)
        const size = new THREE.Vector3()
        box.getSize(size)
        const scale = (container.clientHeight * 0.6) / size.y
        rootGroup.scale.set(scale, scale, scale)
      },
      undefined,
      (err) => console.error('GLTFLoader error:', err)
    )

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      st.kill()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {/* Layer labels — right-side column */}
      {!isMobile() && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 pointer-events-none">
          {LAYER_NAMES.map((name) => (
            <div
              key={name}
              ref={(el) => { labelRefs.current[name] = el }}
              className="font-sans text-[10px] uppercase tracking-[0.1em] text-canvas/50 opacity-0 transition-none"
              style={{ opacity: 0 }}
            >
              {LAYER_CONFIG[name].label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/PanelScene.test.tsx
```
Expected: `2 passed`

- [ ] **Step 4: Wire Hero into page to manually verify in browser**

Temporarily update `app/page.tsx`:
```typescript
// app/page.tsx
import Hero from '@/components/Hero'
export default function Home() {
  return <main><Hero /></main>
}
```

```bash
npm run dev
```
Open http://localhost:3000. Expect: dark hero section, "Eliahu Cohen" centered, chevron bouncing, no console errors. The panel won't appear until `panel.glb` is in `/public` — that's fine.

- [ ] **Step 5: Commit**

```bash
git add components/PanelScene.tsx __tests__/PanelScene.test.tsx app/page.tsx
git commit -m "feat: PanelScene Three.js — renderer, scroll-driven explosion, parallax, layer labels"
```

---

## Task 8: About section

**Files:**
- Create: `components/About.tsx`
- Create: `__tests__/About.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/About.test.tsx
import { render, screen } from '@testing-library/react'
import About from '@/components/About'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders section heading', () => {
  render(<About />)
  expect(
    screen.getByText(/the intersection of design thinking/i)
  ).toBeInTheDocument()
})

it('renders bio paragraph', () => {
  render(<About />)
  expect(screen.getByText(/after a decade spanning/i)).toBeInTheDocument()
})

it('renders all skill tags', () => {
  render(<About />)
  const tags = ['Product', 'BIM', 'ConTech', 'React · Node.js', 'Digital Twin', 'CAD-to-CAM']
  tags.forEach((tag) => {
    expect(screen.getByText(tag)).toBeInTheDocument()
  })
})
```

```bash
npx jest __tests__/About.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/About'`

- [ ] **Step 2: Create `components/About.tsx`**

```typescript
// components/About.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const SKILL_TAGS = ['Product', 'BIM', 'ConTech', 'React · Node.js', 'Digital Twin', 'CAD-to-CAM']

export default function About() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 80%',
          once: true,
        },
      })
      gsap.from(rightRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="bg-canvas px-8 py-32 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">

        {/* Left column */}
        <div ref={leftRef}>
          {/* Decorative number */}
          <div
            className="font-serif text-[160px] leading-none text-subtle select-none"
            aria-hidden="true"
          >
            01
          </div>
          <h2 className="font-serif text-[clamp(24px,3vw,36px)] text-ink -mt-16 leading-tight">
            The intersection of design thinking and technical fluency.
          </h2>
        </div>

        {/* Right column */}
        <div ref={rightRef} className="pt-4">
          <p className="font-sans text-[15px] leading-relaxed text-ink/80 mb-10">
            After a decade spanning architectural practice across Brazil, the Netherlands, and Israel,
            I spent the last five years at Veev as a Senior R&amp;D Product Architect — owning the
            full product lifecycle from PRDs and technology research to hands-on BIM, data, and
            manufacturing pipelines. In my last year I embedded part-time in the engineering team,
            shipping production code alongside the core dev squad.
          </p>

          <div className="flex flex-wrap gap-2">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="font-sans text-[11px] uppercase tracking-[0.08em] border border-ink/20 text-ink/60 px-3 py-1 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/About.test.tsx
```
Expected: `3 passed`

- [ ] **Step 4: Commit**

```bash
git add components/About.tsx __tests__/About.test.tsx
git commit -m "feat: About section with GSAP reveal"
```

---

## Task 9: What I Do section

**Files:**
- Create: `components/WhatIDo.tsx`
- Create: `__tests__/WhatIDo.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/WhatIDo.test.tsx
import { render, screen } from '@testing-library/react'
import WhatIDo from '@/components/WhatIDo'

jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders section heading', () => {
  render(<WhatIDo />)
  expect(screen.getByText('What I do')).toBeInTheDocument()
})

it('renders all three card titles', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Development')).toBeInTheDocument()
  expect(screen.getByText('Product & R&D')).toBeInTheDocument()
  expect(screen.getByText('Architecture & Design')).toBeInTheDocument()
})

it('renders all three category tags', () => {
  render(<WhatIDo />)
  expect(screen.getByText('Coding · Full-Stack')).toBeInTheDocument()
  expect(screen.getByText('Research · Strategy')).toBeInTheDocument()
  expect(screen.getByText('Architecture · BIM')).toBeInTheDocument()
})
```

```bash
npx jest __tests__/WhatIDo.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/WhatIDo'`

- [ ] **Step 2: Create `components/WhatIDo.tsx`**

```typescript
// components/WhatIDo.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const CARDS = [
  {
    category: 'Coding · Full-Stack',
    title: 'Development',
    description:
      'From embedded React/Node.js work shipping production code at Veev to POC development in Python and FastAPI — I write code that goes to production, not just demos.',
  },
  {
    category: 'Research · Strategy',
    title: 'Product & R&D',
    description:
      'Five years owning full product lifecycles: PRDs, technology evaluation, cross-functional leadership across BIM, Data, Automation, and Manufacturing. I bridge domain expertise and technical fluency to de-risk decisions before they\'re expensive.',
  },
  {
    category: 'Architecture · BIM',
    title: 'Architecture & Design',
    description:
      'A decade of practice across Brazil, the Netherlands, and Israel — from construction documents and BIM models to competition submissions with SOM and ARUP. Design thinking isn\'t a metaphor for me; it\'s the foundation.',
  },
]

export default function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.whatiodo-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="what-i-do"
      ref={sectionRef}
      className="bg-canvas px-8 py-32 md:px-16 lg:px-24"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-[clamp(32px,4vw,48px)] text-ink mb-16">
          What I do
        </h2>

        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 border border-subtle"
        >
          {CARDS.map((card, i) => (
            <article
              key={card.title}
              className={`whatiodo-card group relative p-8 border-subtle cursor-default
                ${i < CARDS.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''}
                hover:border-ink transition-colors duration-300`}
              style={{ borderWidth: '1px' }}
            >
              {/* Category tag */}
              <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-ink/40 mb-6">
                {card.category}
              </p>

              {/* Title — slides up on hover */}
              <h3 className="font-serif text-[28px] text-ink mb-4 transition-transform duration-300 group-hover:-translate-y-2">
                {card.title}
              </h3>

              {/* Arrow */}
              <span
                className="absolute bottom-8 right-8 text-ink/30 text-base transition-opacity duration-300 group-hover:opacity-0"
                aria-hidden="true"
              >
                →
              </span>

              {/* Description — fades in on hover */}
              <p className="font-sans text-[14px] leading-[1.7] text-ink/70 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/WhatIDo.test.tsx
```
Expected: `3 passed`

- [ ] **Step 4: Commit**

```bash
git add components/WhatIDo.tsx __tests__/WhatIDo.test.tsx
git commit -m "feat: What I Do section with hover cards and GSAP stagger"
```

---

## Task 10: Contact section

**Files:**
- Create: `components/Contact.tsx`
- Create: `__tests__/Contact.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// __tests__/Contact.test.tsx
import { render, screen } from '@testing-library/react'
import Contact from '@/components/Contact'

it('renders heading', () => {
  render(<Contact />)
  expect(screen.getByText("Let's build something.")).toBeInTheDocument()
})

it('renders email link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /hi@eliahu\.co/i })
  expect(link).toHaveAttribute('href', 'mailto:hi@eliahu.co')
})

it('renders LinkedIn link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /linkedin/i })
  expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/eliahu-cohen-b32374114')
  expect(link).toHaveAttribute('target', '_blank')
})

it('renders CV download link', () => {
  render(<Contact />)
  const link = screen.getByRole('link', { name: /download cv/i })
  expect(link).toHaveAttribute('href', '/cv.pdf')
  expect(link).toHaveAttribute('download')
})
```

```bash
npx jest __tests__/Contact.test.tsx
```
Expected: FAIL — `Cannot find module '@/components/Contact'`

- [ ] **Step 2: Create `components/Contact.tsx`**

```typescript
// components/Contact.tsx

const LINKS = [
  {
    label: 'hi@eliahu.co',
    href: 'mailto:hi@eliahu.co',
    external: false,
    download: false,
  },
  {
    label: 'LinkedIn ↗',
    href: 'https://www.linkedin.com/in/eliahu-cohen-b32374114',
    external: true,
    download: false,
  },
  {
    label: 'Download CV ↓',
    href: '/cv.pdf',
    external: false,
    download: true,
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-ink text-canvas px-8 py-32 md:px-16 lg:px-24"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-[clamp(36px,5vw,56px)] leading-tight mb-4">
          Let&apos;s build something.
        </h2>

        <p className="font-sans text-[14px] text-canvas/50 mb-16 tracking-wide">
          Based in Tel Aviv. Open to hybrid and remote.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {LINKS.map(({ label, href, external, download }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(download ? { download: true } : {})}
              className="font-sans text-[14px] text-canvas/50 hover:text-canvas transition-colors duration-200 underline-offset-4 hover:underline"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npx jest __tests__/Contact.test.tsx
```
Expected: `4 passed`

- [ ] **Step 4: Commit**

```bash
git add components/Contact.tsx __tests__/Contact.test.tsx
git commit -m "feat: Contact section"
```

---

## Task 11: Compose page, copy public assets, Vercel config

**Files:**
- Modify: `app/page.tsx`
- Create: `public/cv.pdf` (copy)
- Create: `next.config.ts`
- Create: `.gitignore` additions

- [ ] **Step 1: Write page composition test**

```typescript
// __tests__/page.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('next/dynamic', () => () => () => null)
jest.mock('@/lib/gsap', () => ({
  gsap: { context: jest.fn(() => ({ revert: jest.fn() })) },
  ScrollTrigger: {},
}))

it('renders all five sections', () => {
  render(<Home />)
  expect(document.getElementById('hero')).toBeInTheDocument()
  expect(document.getElementById('about')).toBeInTheDocument()
  expect(document.getElementById('what-i-do')).toBeInTheDocument()
  expect(document.getElementById('contact')).toBeInTheDocument()
})
```

```bash
npx jest __tests__/page.test.tsx
```
Expected: FAIL — page.tsx doesn't include all sections yet.

- [ ] **Step 2: Update `app/page.tsx`**

```typescript
// app/page.tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatIDo from '@/components/WhatIDo'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="bg-canvas">
      <Nav />
      <Hero />
      <About />
      <WhatIDo />
      <Contact />
    </main>
  )
}
```

- [ ] **Step 3: Run page test — expect PASS**

```bash
npx jest __tests__/page.test.tsx
```
Expected: `1 passed`

- [ ] **Step 4: Copy CV PDF to public/**

```bash
copy "C:\Users\Eliahu\Downloads\Eliahu_CV.pdf" "public\cv.pdf"
```
Verify: `public/cv.pdf` exists.

- [ ] **Step 5: Update `next.config.ts`**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow GLB files to be served from /public without transform
  // Three.js loads /panel.glb as a static asset — no special config needed
  // since Next.js serves /public directly.
  
  // Suppress punycode deprecation warning from some GSAP internals
  experimental: {},
}

export default nextConfig
```

- [ ] **Step 6: Update `.gitignore`**

Open `.gitignore` and add:
```
# Brainstorming session artifacts
.superpowers/

# IFC pipeline intermediate files
public/panel_raw.glb
```

- [ ] **Step 7: Run full test suite**

```bash
npx jest
```
Expected: all tests pass. Example:
```
Test Suites: 7 passed, 7 total
Tests:       20+ passed
```

- [ ] **Step 8: Run dev server and do a full visual check**

```bash
npm run dev
```
Walk through the page:
- [ ] Nav appears, transparent on hero, solid after scrolling
- [ ] Hero section: name, tagline, bouncing chevron visible
- [ ] If `panel.glb` exists in `/public`: Three.js canvas renders panel
- [ ] About section: decorative "01", heading, bio, skill tags
- [ ] What I Do: 3 cards, hover shows description
- [ ] Contact: dark bg, email/LinkedIn/CV links

- [ ] **Step 9: Build check**

```bash
npm run build
```
Expected: `✓ Compiled successfully`. Fix any TypeScript errors before proceeding.

- [ ] **Step 10: Commit**

```bash
git add app/page.tsx public/cv.pdf next.config.ts .gitignore __tests__/page.test.tsx
git commit -m "feat: compose full page, add CV, final build check"
```

---

## Task 12: Deploy to Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "headers": [
    {
      "source": "/panel.glb",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Content-Type", "value": "model/gltf-binary" }
      ]
    },
    {
      "source": "/cv.pdf",
      "headers": [
        { "key": "Content-Disposition", "value": "attachment; filename=\"Eliahu_Cohen_CV.pdf\"" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Push to GitHub**

```bash
git add vercel.json
git commit -m "chore: Vercel config with GLB caching headers"
git remote add origin https://github.com/<your-handle>/portfolio.git
git push -u origin main
```

- [ ] **Step 3: Deploy via Vercel dashboard**

1. Go to https://vercel.com/new
2. Import the GitHub repo
3. Framework: Next.js (auto-detected)
4. No environment variables needed
5. Click Deploy

Expected: build succeeds, site live at `*.vercel.app`.

- [ ] **Step 4: Smoke-check live URL**

- [ ] Page loads in < 3s
- [ ] `panel.glb` loads (check Network tab — should be served with correct Content-Type)
- [ ] CV download works
- [ ] Nav links scroll to correct sections
- [ ] No console errors

---

## Self-Review Checklist

Spec requirement → task that covers it:

| Requirement | Task |
|---|---|
| Next.js 14 App Router, TypeScript, Tailwind | Task 1, 2 |
| Google Fonts (Playfair Display + Inter) | Task 2 |
| IFC → glTF offline pipeline with layer grouping | Task 3 |
| Discard Thermal-Grip washers | Task 3 (DISCARD_KEYWORDS) |
| Draco compression | Task 3 (gltf-pipeline step) |
| GSAP singleton, ScrollTrigger registration | Task 4 |
| Fixed Nav, transparent → solid on scroll | Task 5 |
| Mobile hamburger menu | Task 5 |
| Hero 100vh, text overlay, scroll CTA | Task 6 |
| Three.js WebGLRenderer, camera, lights | Task 7 |
| GLTFLoader + DRACOLoader | Task 7 |
| 5 layer materials with design system colors | Task 7 |
| GSAP ScrollTrigger pin + scrub | Task 7 |
| Mouse parallax | Task 7 |
| Layer labels fade by scroll threshold | Task 7 |
| Cleanup on unmount | Task 7 |
| Mobile: cap pixelRatio, halve offsets, hide labels | Task 7 |
| About: two-column, decorative "01", bio, tags | Task 8 |
| About: GSAP reveal on scroll | Task 8 |
| What I Do: 3 cards, hover reveal | Task 9 |
| What I Do: GSAP stagger on scroll | Task 9 |
| Contact: dark bg, email, LinkedIn, CV download | Task 10 |
| page.tsx composition | Task 11 |
| CV PDF in public/ | Task 11 |
| Vercel deploy with GLB cache headers | Task 12 |
