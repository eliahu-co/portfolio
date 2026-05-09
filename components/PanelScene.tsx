// components/PanelScene.tsx
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { ScrollTrigger } from '@/lib/gsap'

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
  targetZ: number
  color: string
  label: string
  threshold: number
}

const LAYER_CONFIG: Record<LayerName, LayerConfig> = {
  // targetZ in IFC millimetres — explosion offsets are large because IFC units = mm
  layer_frame:       { targetZ: -2000, color: '#4a4a4a', label: 'Structural Frame',   threshold: 0.1 },
  layer_insulation:  { targetZ: -1000, color: '#c8a84a', label: 'Insulation + Vapor', threshold: 0.3 },
  layer_mep:         { targetZ:  -200, color: '#2a5078', label: 'MEP Conduit',         threshold: 0.5 },
  layer_electrical:  { targetZ:   800, color: '#3a6ea8', label: 'Electrical Rough-In', threshold: 0.7 },
  layer_gypsum:      { targetZ:  1800, color: '#e0ddd8', label: 'Gypsum Interior',     threshold: 0.9 },
}

// IFC exports are Z-up; Three.js is Y-up.
// -PI/2 stands the panel upright, +0.2 tilts the top slightly back for isometric read.
const BASE_ROTATION = { x: -Math.PI / 2 + 0.2, y: 0.5 }
const PARALLAX_STRENGTH = { x: 0.08, y: 0.1 }
const PARALLAX_LERP = 0.05

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PanelScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Partial<Record<LayerName, HTMLDivElement | null>>>({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(isMobile() ? 1 : Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // ── Camera ──
    // FOV 5° at z=10000 approximates an orthographic/isometric projection,
    // matching the CAD reference look without perspective distortion.
    const camera = new THREE.PerspectiveCamera(
      5,
      container.clientWidth / container.clientHeight,
      1,
      200000
    )
    camera.position.set(0, 0, 10000)

    // ── Scene ──
    const scene = new THREE.Scene()
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    // Key light from upper-right front (matches CAD isometric reference)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9)
    dirLight.position.set(2000, 4000, 6000)
    // Fill light from left to soften shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-3000, 1000, 2000)
    scene.add(ambientLight, dirLight, fillLight)

    // ── Root group (holds all layers, receives base + parallax rotation) ──
    const rootGroup = new THREE.Group()
    rootGroup.rotation.x = BASE_ROTATION.x
    rootGroup.rotation.y = BASE_ROTATION.y
    scene.add(rootGroup)

    // ── One Group per layer, all start at z=0 ──
    const layerGroups: Partial<Record<LayerName, THREE.Group>> = {}
    LAYER_NAMES.forEach((name) => {
      const group = new THREE.Group()
      layerGroups[name] = group
      rootGroup.add(group)
    })

    // ── Mouse parallax state ──
    let mouseX = 0
    let mouseY = 0
    let currentRotX = BASE_ROTATION.x
    let currentRotY = BASE_ROTATION.y
    let rafId = 0
    let scrollProgress = 0

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
    const animate = () => {
      rafId = requestAnimationFrame(animate)

      if (!isMobile()) {
        currentRotX += (BASE_ROTATION.x + mouseY * PARALLAX_STRENGTH.x - currentRotX) * PARALLAX_LERP
        currentRotY += (BASE_ROTATION.y + mouseX * PARALLAX_STRENGTH.y - currentRotY) * PARALLAX_LERP
        rootGroup.rotation.x = currentRotX
        rootGroup.rotation.y = currentRotY
      }

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

    // ── GSAP ScrollTrigger (drives explosion) ──
    const st = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      pin: true,
      scrub: 1,
      onUpdate: (self: { progress: number }) => {
        scrollProgress = self.progress

        LAYER_NAMES.forEach((name) => {
          const el = labelRefs.current[name]
          if (!el) return
          const cfg = LAYER_CONFIG[name]
          if (self.progress >= cfg.threshold) {
            const fade = Math.min(1, (self.progress - cfg.threshold) / 0.1)
            el.style.opacity = String(fade)
          } else {
            el.style.opacity = '0'
          }
        })
      },
    })

    // ── GLTFLoader + DRACOLoader ──
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/panel.glb',
      (gltf: { scene: THREE.Object3D }) => {
        gltf.scene.traverse((child: THREE.Object3D) => {
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

        // Fit panel to ~60% of viewport height and centre it at world origin.
        // Box3 is computed in world space (after the -PI/2 rotation fix),
        // so size.y is the panel height and center is the panel centroid.
        const box = new THREE.Box3().setFromObject(rootGroup)
        const center = new THREE.Vector3()
        const size = new THREE.Vector3()
        box.getCenter(center)
        box.getSize(size)
        if (size.y > 0) {
          const scale = (container.clientHeight * 0.6) / size.y
          rootGroup.scale.set(scale, scale, scale)
          // After scaling, world-space centre shifts by scale factor — offset rootGroup to re-centre
          rootGroup.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          )
        }
      },
      undefined,
      (err: unknown) => console.error('GLTFLoader error:', err)
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
      {/* Layer labels — right-side column, desktop only */}
      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-4 pointer-events-none">
        {LAYER_NAMES.map((name) => (
          <div
            key={name}
            ref={(el) => { labelRefs.current[name] = el }}
            className="font-sans text-[10px] uppercase tracking-[0.1em] text-canvas/50"
            style={{ opacity: 0 }}
          >
            {LAYER_CONFIG[name].label}
          </div>
        ))}
      </div>
    </div>
  )
}
