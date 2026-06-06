'use client'
import { useEffect, useState } from 'react'

export default function UploadDialog({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) {
  const [progress, setProgress] = useState(0)

  // Upload starts immediately — no drop-zone / Browse step.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return Math.min(p + 3, 100)
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100) return
    const t = setTimeout(onComplete, 250)
    return () => clearTimeout(t)
  }, [progress, onComplete])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[440px] max-w-[90vw] p-6 font-sans text-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-medium">Uploading modified drawing</span>
          <button
            onClick={onCancel}
            className="text-[#5a5a5a] hover:text-[#1a1a1a] text-lg leading-none w-6 h-6 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded text-[9px] font-bold text-[#c62828] border border-[#c62828]/40 bg-[#c62828]/5 flex-shrink-0">
            PDF
          </span>
          <span className="text-[13px] text-[#1a1a1a] truncate flex-1">
            P1016 Bulletin 1 - Second Floor Plan.pdf
          </span>
          <span className="text-[12px] text-[#5a5a5a] tabular-nums">{progress}%</span>
        </div>

        <div className="h-1.5 bg-[#e6e6e6] rounded-full overflow-hidden">
          <div className="h-full bg-[#0d66d0] rounded-full transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
