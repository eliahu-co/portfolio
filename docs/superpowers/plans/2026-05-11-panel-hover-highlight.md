# Panel Layer Hover Highlight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hover any mesh in the Three.js wall panel → the entire layer it belongs to emits a white glow, and its HTML label appears at full opacity.

**Architecture:** All changes are in `components/PanelScene.tsx`. A `Map<THREE.Mesh, LayerName>` built at GLTF load enables O(1) layer lookup on raycast hit. A `THREE.Raycaster` runs each animation frame; when the hovered layer changes, emissive properties are updated on all layer meshes and the label opacity logic is overridden for the hovered layer.

**Tech Stack:** Three.js `Raycaster`, `MeshStandardMaterial.emissive` / `emissiveIntensity`, existing `layerGroups` + `labelRefs` maps.

---

### Task 1: Add constants, refs, and raycaster instance

**Files:**
- Modify: `components/PanelScene.tsx` — add two module-level constants and three locals inside `useEffect`

- [ ] **Step 1: Add two module-level constants after the existing `PARALLAX_LERP` line (line 67)**

Find this line:
```typescript
const PARALLAX_LERP     = 0.05
```

Add immediately after it:
```typescript
const HOVER_EMISSIVE_COLOR     = new THREE.Color(0xffffff)
const HOVER_EMISSIVE_INTENSITY = 0.25
```

- [ ] **Step 2: Add three locals inside `useEffect`, after the existing `let scrollProgress = 0` line (currently ~line 197)**

Find:
```typescript
    let scrollProgress = 0
```

Add immediately after:
```typescript
    const meshToLayer = new Map<THREE.Mesh, LayerName>()
    const raycaster   = new THREE.Raycaster()
    let hoveredLayer: LayerName | null = null
```

- [ ] **Step 3: Verify the file compiles**

```bash
cd C:\Users\Eliahu\projects\portfolio
npx tsc --noEmit
```

Expected: no errors (new variables are declared but not yet used — TypeScript won't error on unused locals by default in Next.js).

- [ ] **Step 4: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "feat(hover): add raycaster, meshToLayer map, and emissive constants"
```

---

### Task 2: Populate meshToLayer during GLTF load

**Files:**
- Modify: `components/PanelScene.tsx` — one line added inside the GLTF mesh loop

- [ ] **Step 1: Find the line inside the GLTF load callback that adds the child to its layer group**

```typescript
          layerGroups[layerName]?.add(child)
```

- [ ] **Step 2: Add the meshToLayer registration immediately after that line**

```typescript
          layerGroups[layerName]?.add(child)
          meshToLayer.set(child, layerName)
```

- [ ] **Step 3: Verify the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "feat(hover): populate meshToLayer during GLTF load"
```

---

### Task 3: Add mouseleave handler

**Files:**
- Modify: `components/PanelScene.tsx` — add `mouseleave` listener alongside existing `mousemove`

When the cursor leaves the browser window, `mouseX`/`mouseY` retain their last position, so the ray keeps hitting meshes. Setting them to `9999` (off-screen NDC) ensures the hover clears.

- [ ] **Step 1: Find the existing mousemove handler and its registration**

```typescript
    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return
      mouseX = (e.clientX / window.innerWidth)  * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove)
```

- [ ] **Step 2: Add a mouseleave handler immediately after the mousemove registration**

```typescript
    const onMouseLeave = () => { mouseX = 9999; mouseY = 9999 }
    window.addEventListener('mouseleave', onMouseLeave)
```

- [ ] **Step 3: Register the cleanup in the existing return block**

Find:
```typescript
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
```

Change to:
```typescript
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
```

- [ ] **Step 4: Verify the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "feat(hover): add mouseleave handler to clear hover state"
```

---

### Task 4: Raycasting + emissive update in the animation loop

**Files:**
- Modify: `components/PanelScene.tsx` — add raycast block inside `animate()`

- [ ] **Step 1: Find the top of the `animate` function**

```typescript
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      if (!isMobile()) {
```

- [ ] **Step 2: Insert the raycast + emissive block immediately after `rafId = requestAnimationFrame(animate)` and before the parallax block**

```typescript
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      // ── Hover: raycast → emissive glow ──────────────────────────────────────
      if (!isMobile() && meshToLayer.size > 0) {
        raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera)
        const hits = raycaster.intersectObjects([...meshToLayer.keys()], false)
        const newHovered: LayerName | null = hits.length > 0
          ? (meshToLayer.get(hits[0].object as THREE.Mesh) ?? null)
          : null

        if (newHovered !== hoveredLayer) {
          hoveredLayer = newHovered
          LAYER_NAMES.forEach((name) => {
            const group = layerGroups[name]
            if (!group) return
            const intensity = name === hoveredLayer ? HOVER_EMISSIVE_INTENSITY : 0
            group.children.forEach((child) => {
              if (child instanceof THREE.Mesh) {
                const mat = child.material as THREE.MeshStandardMaterial
                mat.emissive.copy(HOVER_EMISSIVE_COLOR)
                mat.emissiveIntensity = intensity
              }
            })
          })
        }
      }

      if (!isMobile()) {
```

- [ ] **Step 3: Verify the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Start the dev server and manually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Hover over the 3D panel — meshes in the hovered layer should glow white. Moving off a layer should clear the glow. Moving the cursor off the window entirely should clear all glows.

- [ ] **Step 5: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "feat(hover): raycast each frame and apply emissive glow to hovered layer"
```

---

### Task 5: Labels show at full opacity on hover

**Files:**
- Modify: `components/PanelScene.tsx` — update the label projection block in `animate()`

Currently labels use scroll-driven opacity. When a layer is hovered its label should always be at `1`, regardless of scroll position.

- [ ] **Step 1: Find the label projection block inside `animate()`**

```typescript
      // Project each layer's bottom-left anchor to screen space and move its label there.
      LAYER_NAMES.forEach((name) => {
        const group = layerGroups[name]
        const el = labelRefs.current[name]
        const anchor = layerAnchors[name]
        if (!group || !el || !anchor) return

        const worldPos = anchor.clone()
        group.localToWorld(worldPos)
        const ndc = worldPos.project(camera)

        el.style.left = `${(ndc.x * 0.5 + 0.5) * container.clientWidth}px`
        el.style.top  = `${(-ndc.y * 0.5 + 0.5) * container.clientHeight + 12}px`
      })
```

- [ ] **Step 2: Add the hover opacity override at the end of each iteration**

```typescript
      // Project each layer's bottom-left anchor to screen space and move its label there.
      LAYER_NAMES.forEach((name) => {
        const group = layerGroups[name]
        const el = labelRefs.current[name]
        const anchor = layerAnchors[name]
        if (!group || !el || !anchor) return

        const worldPos = anchor.clone()
        group.localToWorld(worldPos)
        const ndc = worldPos.project(camera)

        el.style.left = `${(ndc.x * 0.5 + 0.5) * container.clientWidth}px`
        el.style.top  = `${(-ndc.y * 0.5 + 0.5) * container.clientHeight + 12}px`

        // Hover overrides scroll-driven opacity
        if (hoveredLayer === name) el.style.opacity = '1'
      })
```

- [ ] **Step 3: Verify the file compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual verification**

Open `http://localhost:3000`. Before scrolling, hover over panel meshes — the label for the hovered layer should appear immediately at full opacity. Scroll partway so labels are visible via scroll; hover a different layer — that layer's label should be at full opacity while the others follow scroll-driven opacity.

- [ ] **Step 5: Commit**

```bash
git add components/PanelScene.tsx
git commit -m "feat(hover): show hovered layer label at full opacity"
```

---

### Task 6: Push branch

- [ ] **Step 1: Push the branch**

```bash
git push origin 3d_elements
```

Expected output includes `3d_elements -> 3d_elements`.
