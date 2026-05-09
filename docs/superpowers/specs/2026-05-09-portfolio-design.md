# Portfolio Site — Design Spec
**Date:** 2026-05-09  
**Status:** Approved for implementation

---

## Overview

Personal portfolio for Eliahu Cohen — Senior R&D Product Architect targeting PM and BIM Management roles in ConTech/PropTech. The site's central feature is a scroll-driven exploded-view animation of a real prefab wall panel assembly exported from a CATIA/3DEXPERIENCE IFC model used in production at Veev.

**Live URL:** Vercel (TBD)  
**Project root:** `C:\Users\Eliahu\projects\portfolio`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| 3D | Three.js |
| Animation | GSAP + ScrollTrigger plugin |
| IFC processing | Python 3.11 + IfcOpenShell (offline, one-time) |
| glTF compression | Draco (via `gltf-pipeline` CLI) |
| Deployment | Vercel |

No third-party UI libraries.

---

## Design System

| Token | Value |
|---|---|
| Background | `#f5f3ef` (off-white) |
| Foreground | `#1a1a1a` (near-black) |
| Accent warm | `#c8a84a` (insulation gold — from panel layer palette) |
| Accent cool | `#3a6ea8` (electrical blue — from panel layer palette) |
| Heading font | Playfair Display (Google Fonts) |
| Body font | Inter (Google Fonts) |
| No gradients, no shadows, no rounded corners (except 2px on tags) |

Mobile-first responsive. Breakpoints follow Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px).

---

## IFC Processing Pipeline

**Source file:** `C:\Users\Eliahu\Documents\repo\test44\backend\app\etl\data\P1016-WL1135.01.IFC` (24.2 MB, IFC4, CATIA export)  
**Schema file:** `C:\Users\Eliahu\Documents\repo\test44\backend\app\etl\data\bim_schema_P1016-WL1135.01.json` (1,903 parts, 52 assemblies)  
**Output:** `public/panel.glb` (Draco-compressed, target <5 MB)

### Layer grouping rules

The script groups every part by matching its `description` field (from the BIM schema JSON) against keyword rules. Parts not matching any group are discarded.

| Group name (glTF mesh name) | Match keywords | Representative geometry | Color |
|---|---|---|---|
| `layer_frame` | `"Steel"`, `"Angle"`, `"Holdown"`, `"MCH"` | ASTM A572 steel angles, holdowns | `#4a4a4a` |
| `layer_insulation` | `"Insulation"`, `"Fiberglass"`, `"Batt"`, `"Membrane"`, `"Vapor"`, `"R-SEAL"`, `"tape"` | R13/R21 fiberglass batts + vapor membrane | `#c8a84a` |
| `layer_mep` | `"Tube"`, `"Cable"`, `"Flexible"`, `"conduit"`, `"Hanger Strap Coil"` | Steel tube, flexible conduit, cables | `#2a5078` |
| `layer_electrical` | `"Outlet Box"`, `"Gang"`, `"Octagon Box"`, `"Strap"`, `"EMT"`, `"Bracket"`, `"Bushing"`, `"Flashing Panel"`, `"TV Box"`, `"In Box"` | Outlet boxes, cable straps, LV brackets | `#3a6ea8` |
| `layer_gypsum` | `"Gypsum"`, `"Flat Panel"` | ½" mold-resistant gypsum panels | `#e0ddd8` |
| **Discard** | `"washer"`, `"Shim"`, `"Clip"`, `"prong"` | ~700 Thermal-Grip washers, shimstrips | — |

### Script: `scripts/ifc_to_gltf.py`

Steps:
1. Load IFC with `ifcopenshell.open()`
2. Load BIM schema JSON for description lookup by `global_id`
3. For each `IfcBuildingElementProxy` in the main assembly, classify by description keyword
4. Use `ifcopenshell.geom` with `OBJ` serializer to triangulate B-rep geometry per part
5. Merge all parts in the same group into a single merged mesh
6. Write one OBJ per group
7. Convert each OBJ to glTF, then merge all 5 into one multi-mesh GLB
8. Run `gltf-pipeline -i panel.gltf -o panel.glb --draco.compressionLevel 7`
9. Copy output to `public/panel.glb`

**Decimation target:** ~40,000 total triangles across all 5 groups (B-rep from CATIA is dense; use `open3d` or `trimesh` for mesh simplification after triangulation).

---

## File Structure

```
portfolio/
├── app/
│   ├── layout.tsx          # fonts, metadata, global GSAP register
│   ├── page.tsx            # composes all sections in order
│   └── globals.css         # Tailwind base + custom CSS vars
├── components/
│   ├── Nav.tsx             # fixed nav, scroll-aware bg transition
│   ├── Hero.tsx            # section wrapper, scroll pin logic, text overlay
│   ├── PanelScene.tsx      # Three.js canvas — isolated, cleanup on unmount
│   ├── About.tsx           # two-column editorial layout
│   ├── WhatIDo.tsx         # 3 competency cards with hover reveal
│   └── Contact.tsx         # dark section, links, CV download
├── lib/
│   └── gsap.ts             # GSAP + ScrollTrigger singleton registration
├── public/
│   ├── panel.glb           # pre-processed output (committed)
│   └── cv.pdf              # Eliahu_CV.pdf (copied from Downloads)
├── scripts/
│   └── ifc_to_gltf.py      # offline IFC → glTF pipeline (run once)
├── docs/
│   └── superpowers/specs/  # this file
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

One file per section component. No barrel exports. No shared UI component library.

---

## Section Specs

### 1. Nav

- `position: fixed`, full width, `z-50`
- **Left:** "EC" in Playfair Display, 20px, links to `#hero`
- **Right:** three links — About · What I do · Contact — Inter 13px, letter-spacing 0.08em, uppercase
- **Scroll behaviour:** transparent with `color: #f5f3ef` over the hero (dark bg). Once scrolled past hero height, transitions to `background: #f5f3ef`, `color: #1a1a1a`, 1px bottom border `#e0ddd8`. Transition: 200ms ease.
- Active section tracked via `IntersectionObserver` on each section's `id`
- **Mobile:** hamburger menu (inline SVG, no library). Links stack vertically in a full-screen overlay.

---

### 2. Hero

**Structure:**
```
<section id="hero">           // 100vh, position: relative
  <PanelScene />              // absolute inset-0, z-0
  <div.text-overlay />        // absolute centered, z-10, pointer-events: none
  <div.scroll-cta />          // absolute bottom-8, centered, z-10
</section>
```

**Text overlay content:**
- Name: "Eliahu Cohen" — Playfair Display, 72px desktop / 40px mobile, weight 700
- Tagline: "Architect. Developer. I actually know how to build." — Inter, 14px, letter-spacing 0.1em, uppercase, color `#666`
- Tagline sits 16px below name, separated by a 32px wide 1px rule

**Scroll CTA:**
- Text: "Scroll to explore" — Inter 11px, uppercase, letter-spacing 0.12em, color `#888`
- Animated chevron (CSS keyframe bounce, 6px amplitude, 1.5s period)

**PanelScene.tsx — Three.js implementation:**

```
Scene setup:
- WebGLRenderer: antialias, alpha: true, size fills container
- Camera: PerspectiveCamera, fov 45, positioned at z=800 in world units
- Ambient light: intensity 0.4
- Directional light: position (200, 400, 300), intensity 0.8, castShadow: false
- No OrbitControls (parallax only via mousemove)

On mount:
- GLTFLoader.load('/panel.glb')
- Traverse scene, find meshes by name (layer_frame, layer_insulation, etc.)
- Store refs to each group's Object3D
- Apply MeshStandardMaterial per layer with colours from design system
- Fit panel to viewport: scale so panel fills ~60% of screen height
- Base rotation: rotateX(0.45) rotateY(-0.6) for isometric-ish read

Explosion offsets (world units, Z axis):
- layer_frame:       targetZ = -200
- layer_insulation:  targetZ = -100
- layer_mep:         targetZ = -20
- layer_electrical:  targetZ =  80
- layer_gypsum:      targetZ =  180
All assembled at targetZ = 0.

GSAP ScrollTrigger:
- trigger: '#hero'
- start: 'top top'
- end: 'bottom top'  (pin duration = 100vh of scroll)
- pin: true
- scrub: 1
- On update(self): lerp each layer's position.z toward targetZ * self.progress

Mouse parallax (requestAnimationFrame, not GSAP):
- Track normalised mouse position (-1 to 1) on the canvas
- Apply: group.rotation.x = baseX + mouseY * 0.08
         group.rotation.y = baseY + mouseX * 0.1
- Lerp factor: 0.05 per frame

Layer labels:
- CSS absolutely positioned <div> elements in a fixed right-side column overlaid on the canvas
- Column: position absolute, right: 32px, top 50%, transform translateY(-50%), display flex flex-col gap-16px
- Each label fades in (opacity 0→1) when scroll progress > layer's threshold
- Thresholds: frame 0.1, insulation 0.3, mep 0.5, electrical 0.7, gypsum 0.9
- Labels (top to bottom = exterior to interior): "Structural Frame", "Insulation + Vapor", "MEP Conduit", "Electrical Rough-In", "Gypsum Interior"
- Style: Inter 10px, uppercase, letter-spacing 0.1em, color #888
- No geometric connection lines — labels are self-explanatory from their vertical order

Cleanup on unmount:
- renderer.dispose()
- Cancel all animation frames
- ScrollTrigger.kill()
- Remove event listeners

Mobile fallback (< 768px):
- PanelScene renders with reduced quality: pixelRatio capped at 1
- Explosion offsets halved
- Mouse parallax disabled
- Labels hidden (too cramped)
```

---

### 3. About

**Layout:** Two-column CSS grid (50/50), collapses to single column below `md`.

**Left column:**
- Large decorative "01" — Playfair Display, 160px, color `#e8e4de`, line-height 1, sits behind heading
- Heading: "The intersection of design thinking and technical fluency." — Playfair Display, 36px, overlapping the "01"

**Right column:**
- Bio paragraph (from CV summary, condensed):
  > After a decade spanning architectural practice across Brazil, the Netherlands, and Israel, I spent the last five years at Veev as a Senior R&D Product Architect — owning the full product lifecycle from PRDs and technology research to hands-on BIM, data, and manufacturing pipelines. In my last year I embedded part-time in the engineering team, shipping production code alongside the core dev squad.
- Skill tags (pill style, 2px border, no fill): Product · BIM · ConTech · React · Node.js · Digital Twin · CAD-to-CAM
- Tag font: Inter 11px, uppercase, letter-spacing 0.08em

**GSAP animation:**
- Both columns: `y: 40 → 0`, `opacity: 0 → 1`
- Left column triggers first, right column staggered +0.15s
- ScrollTrigger: `start: 'top 80%'`, `once: true`

---

### 4. What I Do

**Section heading:** "What I do" — Playfair Display, 48px. No decorative number.

**Card grid:** 3 columns desktop, 1 column mobile. Gap: 1px (tight grid, no gutter). Cards flush to each other, separated only by 1px borders.

**Card structure (per card):**
```
<article>
  <div.card-front>       // always visible
    category tag         // Inter 10px uppercase letter-spacing — e.g. "Coding · Full-Stack"
    title                // Playfair Display 28px
    arrow icon           // → (16px, bottom right)
  </div.card-front>
  <div.card-hover>       // revealed on hover
    description          // Inter 14px, 1.7 line-height
  </div.card-hover>
</article>
```

Hover: title slides up 8px, description fades in from below. Transition: 300ms ease. Border color shifts from `#e0ddd8` to `#1a1a1a`.

**Card content:**

| # | Category | Title | Description |
|---|---|---|---|
| 1 | Coding · Full-Stack | Development | From embedded React/Node.js work shipping production code at Veev to POC development in Python and FastAPI — I write code that goes to production, not just demos. |
| 2 | Research · Strategy | Product & R&D | Five years owning full product lifecycles: PRDs, technology evaluation, cross-functional leadership across BIM, Data, Automation, and Manufacturing. I bridge domain expertise and technical fluency to de-risk decisions before they're expensive. |
| 3 | Architecture · BIM | Architecture & Design | A decade of practice across Brazil, the Netherlands, and Israel — from construction documents and BIM models to competition submissions with SOM and ARUP. Design thinking isn't a metaphor for me; it's the foundation. |

**GSAP animation:** Cards stagger in with `y: 30 → 0`, `opacity: 0 → 1`, stagger 0.1s. ScrollTrigger `start: 'top 75%'`, `once: true`.

---

### 5. Contact

**Layout:** Full-width dark section, `background: #1a1a1a`, `color: #f5f3ef`. Centered content, `padding: 120px 0`.

**Content:**
- Heading: "Let's build something." — Playfair Display, 56px desktop / 36px mobile
- Subline: "Based in Tel Aviv. Open to hybrid and remote." — Inter 14px, color `#888`
- Three action items (horizontal on desktop, stacked on mobile):
  - Email: `hi@eliahu.co` — plain link, underline on hover
  - LinkedIn: "LinkedIn ↗" — plain link, opens in new tab, `linkedin.com/in/eliahu-cohen-b32374114`
  - CV: "Download CV ↓" — `<a href="/cv.pdf" download>`, triggers file download
- Action items: Inter 14px, color `#888`, hover `#f5f3ef`, transition 200ms

**No form.** Contact is intentionally link-only — keeps it minimal and avoids spam/backend complexity.

---

## Animation System

All GSAP usage goes through `lib/gsap.ts` which registers ScrollTrigger once:

```ts
// lib/gsap.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

Components import from `lib/gsap.ts`, never directly from `gsap`.

ScrollTrigger instances created inside `useEffect` must be killed in the cleanup return. Pattern:

```ts
useEffect(() => {
  const ctx = gsap.context(() => { /* animations */ }, ref)
  return () => ctx.revert()
}, [])
```

---

## Open Questions / Deferred

- **Work section images:** Cards currently have no visual — just text. If you want thumbnail images per card, those would be added later.
- **IFC processing runtime:** Estimated 5–15 min for IfcOpenShell to triangulate the full B-rep. If B-rep triangulation is too slow/heavy, fall back to bounding-box geometry per part (still grouped by layer).
- **OG image / SEO metadata:** Basic `<meta>` tags in `layout.tsx` — no custom OG image generation for now.
- **Analytics:** None in scope.

---

## Out of Scope

- CMS or editable content
- Blog / writing section
- Password-protected work
- Dark mode toggle
- Animations on the Three.js labels (they fade in, no further motion)
- Any backend / API routes
