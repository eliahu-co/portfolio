// app/HA-DrawingAnalyzer/sections/DemoVideo.tsx
// Prototype walkthrough video. No autoplay: the user clicks Play; once it
// finishes a Replay button appears to watch it again. Native controls are
// available while it plays (pause/scrub).

'use client'

import { useRef, useState } from 'react'

type State = 'idle' | 'playing' | 'ended'

export default function DemoVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<State>('idle')

  const play = () => ref.current?.play()
  const replay = () => {
    if (!ref.current) return
    ref.current.currentTime = 0
    ref.current.play()
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <video
        ref={ref}
        src="/drawinganalyzer/demovideo.mp4"
        poster="/drawinganalyzer/ha-drawing-analyzer-poster.jpg"
        preload="auto"
        playsInline
        controls={state === 'playing'}
        className="absolute inset-0 h-full w-full object-cover"
        onPlay={() => setState('playing')}
        onEnded={() => setState('ended')}
      />
      {state !== 'playing' && (
        <button
          type="button"
          onClick={state === 'ended' ? replay : play}
          aria-label={state === 'ended' ? 'Replay video' : 'Play video'}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/35 transition-colors hover:bg-black/25"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-autodesk-blue text-white shadow-lg">
            {state === 'ended' ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-[0.1em] text-white/90">
            {state === 'ended' ? 'Replay' : 'Play walkthrough'}
          </span>
        </button>
      )}
    </div>
  )
}
