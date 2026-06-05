'use client'
import { useEffect, useState } from 'react'

export default function UploadDialog({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!uploading) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(prev + 3, 100)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [uploading])

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete()
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  function handleBrowseOrDropZone() {
    if (!uploading) {
      setUploading(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 grid place-items-center"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[440px] max-w-[90vw] p-6 font-sans text-[#1a1a1a]"
        onClick={e => e.stopPropagation()}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-medium">Upload new version</span>
          <button
            onClick={onCancel}
            className="text-[#5a5a5a] hover:text-[#1a1a1a] text-lg leading-none w-6 h-6 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!uploading ? (
          /* Drop zone */
          <div
            className="border-2 border-dashed border-[#d9d9d9] rounded-md py-8 px-4 text-center my-4 cursor-pointer hover:border-[#0d66d0] transition-colors"
            onClick={handleBrowseOrDropZone}
          >
            <div className="flex items-center justify-center mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f0f0f0] text-[#5a5a5a] text-lg">
                ⬆
              </span>
            </div>
            <p className="text-[13px] text-[#5a5a5a]">
              Drag a file here or{' '}
              <button
                className="text-[#0d66d0] underline"
                onClick={e => { e.stopPropagation(); handleBrowseOrDropZone() }}
              >
                Browse
              </button>
            </p>
          </div>
        ) : (
          /* File chip + progress */
          <div className="my-4">
            <div className="flex items-center gap-2 mb-2">
              {/* PDF glyph */}
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600 text-[11px] font-bold flex-shrink-0">
                PDF
              </span>
              <span className="text-[13px] text-[#1a1a1a] truncate flex-1">
                2025-0829 - P1016 Bulletin 1 - Drawings.pdf
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-[#e6e6e6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0d66d0] rounded-full transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
