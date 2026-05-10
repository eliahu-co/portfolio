'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

// Replace with your own project photos in /public/work/
const IMAGES = [
  '/profile_pic.jpeg',
  '/profile_pic/up.jpeg',
  '/profile_pic/diagonal_up.jpeg',
  '/profile_pic/right.jpeg',
  '/profile_pic/down.jpeg',
  '/profile_pic/diagonal_down.jpeg',
]

const IMG_W_VW = 45   // each image width as % of viewport
const GAP_VW   = 2    // gap between images
const HOLD_S   = 1.8  // pause at centre
const TRAVEL_S = 0.9  // slide duration

// Duplicate for seamless looping: step through first copy, silently reset when done
const IMAGES_LOOP = [...IMAGES, ...IMAGES]

export default function WorkBanner() {
  const stripRef = useRef<HTMLDivElement>(null)
  const tlRef    = useRef<gsap.core.Tween | null>(null)
  const dtRef    = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const n    = IMAGES.length
    const step = IMG_W_VW + GAP_VW
    const getX = (i: number) => 50 - (i * step + IMG_W_VW / 2)

    let idx = 0
    gsap.set(strip, { x: `${getX(0)}vw` })

    const advance = () => {
      idx += 1
      tlRef.current = gsap.to(strip, {
        x: `${getX(idx)}vw`,
        duration: TRAVEL_S,
        ease: 'power2.inOut',
        onComplete: () => {
          // After completing the full cycle, teleport back to index 0 position.
          // The duplicate copy makes the image at idx===n look identical to idx===0,
          // so the reset is invisible to the user.
          if (idx >= n) {
            idx = 0
            gsap.set(strip, { x: `${getX(0)}vw` })
          }
          dtRef.current = gsap.delayedCall(HOLD_S, advance)
        },
      })
    }

    dtRef.current = gsap.delayedCall(HOLD_S, advance)

    return () => {
      tlRef.current?.kill()
      dtRef.current?.kill()
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-canvas" style={{ height: '60vh' }}>
      <div
        ref={stripRef}
        className="absolute top-0 h-full flex"
        style={{ gap: `${GAP_VW}vw`, willChange: 'transform' }}
      >
        {IMAGES_LOOP.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 h-full"
            style={{ width: `${IMG_W_VW}vw` }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes={`${IMG_W_VW}vw`}
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
