'use client'
import { useState } from 'react'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'
import UploadDialog from './UploadDialog'
import ChangeValidation from './ChangeValidation'
import SubmitReviewDialog from './SubmitReviewDialog'

export default function FormaPrototype() {
  const [screen, setScreen] = useState<'files' | 'review'>('files')
  const [version, setVersion] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'none' | 'in-review'>('none')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function handleUploadComplete() {
    setUploadOpen(false)
    setVersion(2)
  }
  function handleSubmit() {
    setValidating(true)
    setTimeout(() => { setValidating(false); setScreen('review') }, 1100)
  }
  // Confirming the detected changes opens the Submit-for-review modal.
  function handleConfirm() {
    setSubmitOpen(true)
  }
  // The modal's Submit is what actually files the review.
  function handleSubmitReview() {
    setSubmitOpen(false)
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
    setSubmitOpen(false)
    setToast(null)
  }

  return (
    <div className="relative">
      {screen === 'review' ? (
        <>
          <ChangeValidation onReturn={handleReturn} onConfirm={handleConfirm} />
          {submitOpen && <SubmitReviewDialog onSubmit={handleSubmitReview} onCancel={() => setSubmitOpen(false)} />}
        </>
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

      {/* Toast (top-center, clear of the demo control) */}
      {toast && (
        <div className="fixed top-[88px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-[#1a1a1a] text-white text-[13px] px-4 py-2.5 rounded shadow-lg">
          <span className="grid place-items-center h-4 w-4 rounded-full bg-[#2e7d32] text-[10px]" aria-hidden>✓</span>
          {toast}
        </div>
      )}

      {/* Demo control — deliberately distinct from the Forma UI (dark pill, centered) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-[#111316] text-white rounded-full px-1.5 py-1 shadow-lg ring-1 ring-white/10">
        <a href="/HA-DrawingAnalyzer" className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/90 hover:text-white bg-white/10 hover:bg-white/15 rounded-full px-2.5 py-1 no-underline">
          ← Home assignment
        </a>
        <button onClick={handleRestart} className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/90 hover:text-white bg-white/10 hover:bg-white/15 rounded-full px-2.5 py-1">
          ↺ Restart demo
        </button>
      </div>
    </div>
  )
}
