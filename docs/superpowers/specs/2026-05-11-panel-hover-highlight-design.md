# Panel Layer Hover Highlight Design

**Goal:** When the user hovers over any mesh in the Three.js wall panel, the entire layer that mesh belongs to glows, and its HTML label appears at full opacity.

**Architecture:** Add a `THREE.Raycaster` to `PanelScene.tsx`. Each animation frame, cast a ray through the current mouse NDC position against a flat list of all layer meshes. Identify which `LayerName` the closest hit belongs to. Apply an emissive glow to every mesh in that layer and clear it on all others. Expose the hovered layer name to the label system so labels respond independently of scroll progress.

**Tech Stack:** Three.js `Raycaster`, `MeshStandardMaterial.emissive` + `emissiveIntensity`, existing `layerGroups` and `labelRefs` maps in `PanelScene.tsx`.

---

## Data structures

- `meshToLayer: Map<THREE.Mesh, LayerName>` — built during GLTF load, maps every mesh to its layer. Used for O(1) lookup on raycast hit.
- `hoveredLayer: LayerName | null` — mutable ref tracking the current hover state. Updated each frame; drives both emissive and label opacity.
- `HOVER_EMISSIVE_COLOR: THREE.Color` — constant `#ffffff`.
- `HOVER_EMISSIVE_INTENSITY: number` — `0.25`.

## Raycasting

- One `THREE.Raycaster` instance, created once outside the animation loop.
- Mouse NDC is already tracked in `mouseX` / `mouseY` (existing `onMouseMove` handler). Use these directly.
- Each frame: `raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera)`, intersect against `[...meshToLayer.keys()]`.
- Take the first (closest) intersection. Read its layer from `meshToLayer`. If no hit, layer is `null`.

## Emissive application

- When `hoveredLayer` changes:
  - For every `LayerName`, iterate its `layerGroup` children and cast to `THREE.Mesh`.
  - If layer === `hoveredLayer`: set `material.emissive = HOVER_EMISSIVE_COLOR`, `material.emissiveIntensity = HOVER_EMISSIVE_INTENSITY`.
  - Otherwise: set `material.emissiveIntensity = 0`.
- Only update materials when `hoveredLayer` actually changes (compare to previous value) to avoid redundant writes every frame.

## Label behaviour

- Labels currently use scroll-driven opacity (0 → 1 as scroll progresses past 0.03–0.08).
- When a layer is hovered, its label is shown at full opacity (`1`) regardless of scroll position.
- When hover ends, label returns to scroll-driven opacity.
- Implementation: in the label update block inside the render loop, check `hoveredLayer === name` first; if true, set `el.style.opacity = '1'` and skip the scroll calculation for that label.

## Cleanup / edge cases

- On mouse leave from the window (`mouseleave` event), set `mouseX = mouseY = 9999` (off-screen) so the ray misses all meshes and hover clears naturally.
- Glass layer has `opacity: 0.2` — emissive still applies; the slight glow is visible and intentional.
- Mobile: raycasting is skipped (`isMobile()` guard already present on mouse handling).
