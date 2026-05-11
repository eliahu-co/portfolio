// components/PanelScene.tsx
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ScrollTrigger } from '@/lib/gsap'

// ── Layer configuration ──────────────────────────────────────────────────────
//
// WL1135.glb node classification (IFC type → layer):
//   IfcMember, IfcPlate                    → layer_frame      (steel studs, tracks, plates)
//   IfcBuildingElementProxy / MCH*         → layer_mep        (conduit hangers, mechanical)
//   IfcReinforcingMesh                     → layer_mep        (cable runs)
//   IfcBuildingElementProxy / ELC*, MIS*   → layer_electrical (outlets, boxes, brackets)
//   IfcBuildingElementProxy / WIN*         → layer_frame      (window frame assembly)
//   IfcCovering / WPM*                     → layer_gypsum     (exterior wall membrane)

const LAYER_NAMES = [
  'Gypsum',
  'OSB',
  'Insulation',
  'Framing',
  'MEP',
  'Window',
  'Glass',
] as const

type LayerName = (typeof LAYER_NAMES)[number]

interface LayerConfig {
  /** IFC-metre offset along the wall thickness axis (correctionGroup local Y) */
  targetOffset: number
  color:        string
  label:        string
  threshold:    number
  /** scroll progress (0–1) at which this layer begins exploding; defaults to 0 */
  startAt?:     number
  opacity?:     number
}

const LAYER_CONFIG: Record<LayerName, LayerConfig> = {
  'Gypsum':     { targetOffset:   4,  color: '#B0B0B0', label: 'Interior Finish',    threshold: 0.1,  startAt: 0.18 },
  'Window':     { targetOffset:   6,  color: '#8aa3b0', label: 'Glazing',           threshold: 0.25, startAt: 0 },
  'Glass':      { targetOffset:   6,  color: '#c8dde8', label: '',                  threshold: 0.25, startAt: 0,    opacity: 0.2 },
  'Framing':    { targetOffset:   0,  color: '#555555', label: 'Framing',           threshold: 0.4 },
  'MEP':        { targetOffset:   0,  color: '#197aff', label: 'MEP',               threshold: 0.4 },
  'OSB':        { targetOffset:  -3,  color: '#ffe221', label: 'Sheathing',         threshold: 0.55 },
  'Insulation': { targetOffset:  -5,  color: '#675962', label: 'Thermal Insulation', threshold: 0.7 },
}

// ── Presentation constants ───────────────────────────────────────────────────

// Use these to manually nudge the entire panel left/right or up/down (in world units)
// E.g., if it visually feels slightly to the right, try x: -10 or -20
const MANUAL_OFFSET = { x: 0, y: 0 }

// Front-Right-Top isometric.
// WL1135.glb is Blender/GLTF Y-up: the wall face is already in the XY plane.
// rotation.y ≈ -0.3 reveals the right edge; rotation.x ≈ -0.2 reveals the top.
const BASE_ROTATION = {
  x: -0.2,  // slight downward camera tilt (top edge visible)
  y: -0.3,  // rotate so right side of wall comes toward viewer
}
const PARALLAX_STRENGTH = { x: 0.15, y: 0.15 }
const PARALLAX_LERP     = 0.05
const HOVER_EMISSIVE_HEX       = 0xffffff
const HOVER_EMISSIVE_INTENSITY = 0.25

// WL1135.glb is Blender/GLTF Y-up. GLTF Y = height = 3.23 m (single storey).
// Target ≈ 60 % of frustum height (874 world units at FOV=5°, z=10 000).
// 874 × 0.60 / 3.23 ≈ 162 — but wall is 14.2 m wide so cap at 130 to avoid clipping.
const SCALE = 130

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// ── IFC-node → layer classifier ───────────────────────────────────────────────

function classifyNode(nodeName: string, meshName?: string): LayerName | null {
  // If the node exactly matches one of our active layers
  if (LAYER_NAMES.includes(nodeName as LayerName)) return nodeName as LayerName
  
  const lower = nodeName.toLowerCase()
  const lowerMesh = (meshName || nodeName).toLowerCase()

  // Glass panes — must precede the Window catch-all
  if (
    lower.includes('glass') || lower.includes('glaz') ||
    lowerMesh.includes('glass') || lowerMesh.includes('glaz')
  ) return 'Glass'

  if (lower.includes('window') || lower.includes('win')) return 'Window'
  if (lower.includes('gypsum')) return 'Gypsum'
  if (lower.includes('osb')) return 'OSB'
  if (lower.includes('insulation')) return 'Insulation'

  // If we hit the joint "Framing and MEP" collection, split them by their mesh IFC identifiers!
  if (lower.includes('framing') || lower.includes('mep')) {
    const isMEP = 
      lowerMesh.includes('cable') || 
      lowerMesh.includes('reinforcingmesh') || 
      lowerMesh.includes('/elc') || 
      lowerMesh.includes('/mis') || 
      (lowerMesh.includes('ifcbuildingelementproxy') && lowerMesh.includes('/mch'))

    return isMEP ? 'MEP' : 'Framing'
  }

  // Fallback for raw IFC nodes (if collections were not exported)
  const slash    = nodeName.indexOf('/')
  const ifcType  = slash >= 0 ? nodeName.slice(0, slash) : nodeName
  
  if (ifcType === 'IfcReinforcingMesh' || lowerMesh.includes('/elc') || lowerMesh.includes('/mis')) return 'MEP'
  if (ifcType === 'IfcMember' || ifcType === 'IfcPlate' || ifcType === 'IfcBuildingElementProxy') return 'Framing'
  if (ifcType === 'IfcCovering') return 'Gypsum'

  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PanelScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Partial<Record<LayerName, HTMLDivElement | null>>>({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true // Fixes Z-fighting at extreme camera distances
      })
    } catch {
      return  // WebGL unavailable (e.g. Strict Mode double-invoke exhausted contexts)
    }
    
    // Use fallback sizes in case container is 0-sized on mount
    const initialWidth = container.clientWidth || window.innerWidth
    const initialHeight = container.clientHeight || window.innerHeight
    
    renderer.setSize(initialWidth, initialHeight)
    renderer.setPixelRatio(isMobile() ? 1 : Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Camera — FOV 5° ≈ orthographic, no perspective distortion ──
    const camera = new THREE.PerspectiveCamera(
      5,
      initialWidth / initialHeight,
      5000,   // Tight near plane to improve depth buffer precision
      20000   // Tight far plane to improve depth buffer precision
    )
    camera.position.set(0, 0, 10000)

    // ── Scene & lights ──
    const scene      = new THREE.Scene()
    const ambient    = new THREE.AmbientLight(0xffffff, 0.6)
    const dirLight   = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(2000, 4000, 6000)
    const fillLight  = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-3000, 1000, 2000)
    scene.add(ambient, dirLight, fillLight)

    // ── Root group — presentation + mouse parallax ──
    const rootGroup = new THREE.Group()
    rootGroup.rotation.x = BASE_ROTATION.x
    rootGroup.rotation.y = BASE_ROTATION.y
    rootGroup.scale.setScalar(SCALE)
    scene.add(rootGroup)

    // ── Correction group — centres the model at the rootGroup origin ──
    // We will dynamically compute the GLTF bounding box and update this position after load
    const correctionGroup = new THREE.Group()
    rootGroup.add(correctionGroup)

    // ── One group per layer (children of correctionGroup) ──
    const layerGroups: Partial<Record<LayerName, THREE.Group>> = {}
    LAYER_NAMES.forEach((name) => {
      const g = new THREE.Group()
      layerGroups[name] = g
      correctionGroup.add(g)
    })

    // ── Label anchor points — bottom-left corner of each layer in its group's local space ──
    // Populated after GLTF loads; read every frame to position HTML labels in screen space.
    const layerAnchors: Partial<Record<LayerName, THREE.Vector3>> = {}

    // ── Mouse parallax state ──
    let mouseX = 0, mouseY = 0
    let currentRotX = BASE_ROTATION.x
    let currentRotY = BASE_ROTATION.y
    let rafId = 0
    let scrollProgress = 0

    // ── Hover / raycasting state ──
    const meshToLayer = new Map<THREE.Mesh, LayerName>()
    const raycaster   = new THREE.Raycaster()
    let hoveredLayer: LayerName | null = null

    // ── Resize ──
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) continue
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    })
    resizeObserver.observe(container)

    // ── Mouse (desktop only) ──
    const onMouseMove = (e: MouseEvent) => {
      if (isMobile()) return
      mouseX = (e.clientX / window.innerWidth)  * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Render loop ──
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      if (!isMobile()) {
        currentRotX += (BASE_ROTATION.x + mouseY * PARALLAX_STRENGTH.x - currentRotX) * PARALLAX_LERP
        currentRotY += (BASE_ROTATION.y + mouseX * PARALLAX_STRENGTH.y - currentRotY) * PARALLAX_LERP
        rootGroup.rotation.x = currentRotX
        rootGroup.rotation.y = currentRotY
      }

      // Explode layers along GLTF Z (wall depth axis).
      // With rootGroup.rotation.y ≈ -0.3, a Z offset partially projects to screen X
      // → layers appear to separate horizontally across the screen.
      LAYER_NAMES.forEach((name) => {
        const group = layerGroups[name]
        if (!group) return
        const cfg = LAYER_CONFIG[name]
        const multiplier = isMobile() ? 0.5 : 1
        const start = cfg.startAt ?? 0
        const effective = start > 0
          ? Math.max(0, (scrollProgress - start) / (1 - start))
          : scrollProgress
        const target = cfg.targetOffset * effective * multiplier
        group.position.z += (target - group.position.z) * 0.1
      })

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

      renderer.render(scene, camera)
    }
    animate()

    // ── GSAP ScrollTrigger ──
    const st = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end:   '+=50vh',
      pin:   true,
      scrub: 1,
      onUpdate: (self: { progress: number }) => {
        scrollProgress = self.progress
        const labelOpacity = String(Math.min(1, Math.max(0, (self.progress - 0.03) / 0.05)))
        LAYER_NAMES.forEach((name) => {
          const el = labelRefs.current[name]
          if (!el) return
          el.style.opacity = labelOpacity
        })
      },
    })

    // ── GLTF + Draco loader ──
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/WL1135.glb',
      (gltf: { scene: THREE.Object3D }) => {
        // Snapshot before reparenting to avoid mutating live children arrays.
        const candidates: THREE.Object3D[] = []
        const collect = (node: THREE.Object3D) => {
          for (const child of [...node.children]) {
            candidates.push(child)
            if (child.children.length) collect(child)
          }
        }
        collect(gltf.scene)

        // 1. Dynamically find the exact center of the imported GLTF model
        const gltfBox = new THREE.Box3().setFromObject(gltf.scene)
        const gltfCenter = new THREE.Vector3()
        gltfBox.getCenter(gltfCenter)
        
        // 2. Shift the correction group by exactly the negative center.
        // This ensures that the model's physical pivot point is perfectly centered at 0,0,0.
        // When the mouse orbits, it will spin exactly around its center mass instead of swinging wide.
        correctionGroup.position.set(-gltfCenter.x, -gltfCenter.y, -gltfCenter.z)

        // Ensure all world matrices are calculated before reparenting
        gltf.scene.updateMatrixWorld(true)

        for (const child of candidates) {
          if (!(child instanceof THREE.Mesh)) continue

          // Traverse up the node's hierarchy to see if it or any parent belongs to a known collection
          // We pass child.name so the split-logic knows the exact mesh identity
          let layerName: LayerName | null = null
          let current: THREE.Object3D | null = child
          while (current && current !== gltf.scene) {
            const classified = classifyNode(current.name, child.name)
            if (classified) {
              layerName = classified
              break
            }
            current = current.parent
          }
          if (!layerName) continue

          const cfg = LAYER_CONFIG[layerName]

          // Bake the transform relative to the glTF scene root
          // This prevents meshes from jumping or scaling incorrectly when removed from their original hierarchy
          child.matrix.copy(child.matrixWorld)
          child.matrix.decompose(child.position, child.quaternion, child.scale)

          // Recompute normals for smooth shading (ACC "blend" mode equivalent)
          try { child.geometry.computeVertexNormals() } catch { /* ok */ }

          child.material = new THREE.MeshStandardMaterial({
            color:       new THREE.Color(cfg.color),
            roughness:   0.6,
            metalness:   0.05,
            side:        THREE.DoubleSide,
            transparent: (cfg.opacity ?? 1) < 1,
            opacity:     cfg.opacity ?? 1,
          })

          // Hard-edge outlines at 45° — skips internal tessellation diagonals
          try {
            child.add(new THREE.LineSegments(
              new THREE.EdgesGeometry(child.geometry, 45),
              new THREE.LineBasicMaterial({ color: 0x1a1a1a }),
            ))
          } catch { /* ok */ }

          layerGroups[layerName]?.add(child)
        }

        // --- Auto-center the visual bounding box of the loaded model ---
        // Once everything is assigned and the initial rotation is applied, 
        // we compute the exact screen-space bounding box and center it perfectly.
        scene.updateMatrixWorld(true)
        const box = new THREE.Box3().setFromObject(rootGroup)
        const center = new THREE.Vector3()
        box.getCenter(center)
        
        rootGroup.position.x = -center.x + MANUAL_OFFSET.x
        rootGroup.position.y = -center.y + MANUAL_OFFSET.y

        // Lock label anchors now that rootGroup is in its final position.
        // Each anchor is the bottom-left/front corner of the layer's bbox stored in
        // the layer group's local space, so localToWorld() in the render loop gives
        // the correct screen position as the group's Z offset changes during explosion.
        scene.updateMatrixWorld(true)
        LAYER_NAMES.forEach((name) => {
          const group = layerGroups[name]
          if (!group || group.children.length === 0) return
          const layerBox = new THREE.Box3().setFromObject(group)
          if (layerBox.isEmpty()) return
          const worldAnchor = new THREE.Vector3(layerBox.min.x, layerBox.min.y, layerBox.min.z)
          group.worldToLocal(worldAnchor)
          layerAnchors[name] = worldAnchor
        })

      },
      undefined,
      (err: unknown) => console.error('GLTFLoader error:', err),
    )

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      st.kill()
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed" style={{ top: 0, bottom: 0, left: '-20vw', right: '-20vw', zIndex: 0 }}>
      <div className="hidden md:block absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {LAYER_NAMES.filter(name => LAYER_CONFIG[name].label).map((name) => (
          <div
            key={name}
            ref={(el) => { labelRefs.current[name] = el }}
            className="absolute font-sans text-[10px] uppercase tracking-[0.1em] text-ink/50 whitespace-nowrap"
            style={{ opacity: 0, left: 0, top: 0 }}
          >
            {LAYER_CONFIG[name].label}
          </div>
        ))}
      </div>
    </div>
  )
}
