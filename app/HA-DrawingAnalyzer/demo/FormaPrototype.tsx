'use client'
import { useState } from 'react'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'
import UploadDialog from './UploadDialog'
import ChangeValidation from './ChangeValidation'

export default function FormaPrototype() {
  const [screen, setScreen] = useState<'files' | 'review'>('files')
  const [version, setVersion] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'none' | 'in-review'>('none')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function handleUploadComplete() {
    setUploadOpen(false)
    setVersion(2)
  }
  function handleSubmit() {
    setValidating(true)
    setTimeout(() => { setValidating(false); setScreen('review') }, 1100)
  }
  function handleConfirm() {
    setScreen('files')
    setStatus('in-review')
    setToast('Submitted for review')
    setTimeout(() => setToast(null), 3200)
  }
  function handleReturn() {
    setScreen('files')
  }
  function handleRestart() {
    setScreen('files')
    setVersion(1)
    setStatus('none')
    setUploadOpen(false)
    setValidating(false)
    setToast(null)
  }

  return (
    <div className="relative">
      {screen === 'review' ? (
        <ChangeValidation onReturn={handleReturn} onConfirm={handleConfirm} />
      ) : (
        <FormaShell>
          <FilesScreen
            version={version}
            status={status}
            onUpload={() => setUploadOpen(true)}
            onSubmit={handleSubmit}
            busyHint={validating ? 'Generating change review…' : null}
          />
          {uploadOpen && (
            <UploadDialog onComplete={handleUploadComplete} onCancel={() => setUploadOpen(false)} />
          )}
        </FormaShell>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded shadow-lg">
          <span className="grid place-items-center h-4 w-4 rounded-full bg-[#2e7d32] text-[10px]" aria-hidden>✓</span>
          {toast}
        </div>
      )}

      {/* Prototype tag + restart */}
      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-[#5a5a5a] bg-white/90 border border-[#d9d9d9] rounded px-1.5 py-0.5 shadow-sm">
          Prototype
        </span>
        <button onClick={handleRestart} className="text-[11px] text-[#0d66d0] hover:underline bg-white border border-[#d9d9d9] rounded px-2 py-1 shadow-sm">
          ↺ Restart demo
        </button>
      </div>
    </div>
  )
}
