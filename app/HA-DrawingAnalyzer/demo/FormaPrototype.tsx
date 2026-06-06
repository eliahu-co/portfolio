'use client'
import { useState } from 'react'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'
import UploadDialog from './UploadDialog'
import ChangeValidation from './ChangeValidation'
import SubmitReviewDialog from './SubmitReviewDialog'

export default function FormaPrototype() {
  const [screen, setScreen] = useState<'files' | 'review'>('files')
  const [version, setVersion] = useState<1 | 2 | 3>(1)
  const [pass, setPass] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'none' | 'in-review'>('none')
  const [awaitingUpload, setAwaitingUpload] = useState(true)   // true = next action is "upload"
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [uploaded, setUploaded] = useState(false)              // "new version uploaded" banner
  const [reuploadHint, setReuploadHint] = useState(false)      // "unintended change found" hint after cancel

  function handleUploadComplete() {
    setUploadOpen(false)
    setReuploadHint(false)
    if (version === 1) { setVersion(2); setPass(1) }
    else { setVersion(3); setPass(2) }
    setAwaitingUpload(false)
    setUploaded(true)
  }
  function handleSubmit() {            // Files "Submit for review"
    setUploaded(false)
    setValidating(true)
    setTimeout(() => { setValidating(false); setScreen('review') }, 1100)
  }
  function handleConfirm() {           // CV "Confirm changes" → open submit modal
    setSubmitOpen(true)
  }
  function handleSubmitReview() {      // modal Submit → file the review, end demo
    setSubmitOpen(false)
    setScreen('files')
    setStatus('in-review')
  }
  function handleReturn() {            // CV "Cancel"
    setScreen('files')
    if (pass === 1) { setAwaitingUpload(true); setReuploadHint(true) } // upload a corrected drawing
  }
  function handleRestart() {
    setScreen('files'); setVersion(1); setPass(1); setStatus('none')
    setAwaitingUpload(true); setUploadOpen(false); setValidating(false)
    setSubmitOpen(false); setUploaded(false); setReuploadHint(false)
  }

  const done = status === 'in-review'
  const action: 'upload' | 'submit' = awaitingUpload ? 'upload' : 'submit'

  return (
    <div className="relative">
      {screen === 'review' ? (
        <>
          <ChangeValidation onReturn={handleReturn} onConfirm={handleConfirm} pass={pass} />
          {submitOpen && <SubmitReviewDialog onSubmit={handleSubmitReview} onCancel={() => setSubmitOpen(false)} />}
        </>
      ) : (
        <FormaShell>
          <FilesScreen
            version={version}
            status={status}
            action={action}
            onUpload={() => setUploadOpen(true)}
            onSubmit={handleSubmit}
            busyHint={validating ? 'Generating change review…' : null}
          />
          {uploadOpen && (
            <UploadDialog onComplete={handleUploadComplete} onCancel={() => setUploadOpen(false)} />
          )}
        </FormaShell>
      )}

      {/* Unintended-change hint after cancelling pass 1 */}
      {reuploadHint && (
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-white border border-[#c62828]/40 rounded-lg shadow-lg px-4 py-2.5">
          <span className="grid place-items-center h-6 w-6 rounded-full bg-[#c62828] text-white text-[12px]" aria-hidden>!</span>
          <div>
            <p className="text-[13px] font-medium text-[#1a1a1a]">Review cancelled — unintended change found</p>
            <p className="text-[11px] text-[#5a5a5a]">Upload a corrected drawing, then submit again.</p>
          </div>
        </div>
      )}

      {/* Upload success banner */}
      {uploaded && !done && (
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-white border border-[#d9d9d9] rounded-lg shadow-lg px-4 py-2.5">
          <span className="grid place-items-center h-6 w-6 rounded-full bg-[#2e7d32] text-white text-[12px]" aria-hidden>✓</span>
          <div>
            <p className="text-[13px] font-medium text-[#1a1a1a]">New version uploaded successfully</p>
            <p className="text-[11px] text-[#5a5a5a]">The drawing is now V{version} — submit it for review.</p>
          </div>
        </div>
      )}

      {/* Completion banner — demo ends after the review is filed */}
      {done && (
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-white border border-[#d9d9d9] rounded-lg shadow-lg px-4 py-2.5">
          <span className="grid place-items-center h-6 w-6 rounded-full bg-[#2e7d32] text-white text-[12px]" aria-hidden>✓</span>
          <div>
            <p className="text-[13px] font-medium text-[#1a1a1a]">Submitted for review · Demo ended</p>
            <p className="text-[11px] text-[#5a5a5a]">The drawing is now In review.</p>
          </div>
          <button onClick={handleRestart} className="ml-2 text-[12px] font-semibold text-white bg-[#0d66d0] rounded px-3 py-1.5 hover:opacity-90">
            ↺ Restart demo
          </button>
        </div>
      )}

      {/* Demo control — reuses the home-assignment button language (autodesk-blue squares) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2">
        <a href="/HA-DrawingAnalyzer" className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white bg-autodesk-blue rounded-sm px-4 py-2 no-underline shadow-md hover:opacity-90 transition-opacity">
          ← Home assignment
        </a>
        <button onClick={handleRestart} className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-white bg-autodesk-blue rounded-sm px-4 py-2 shadow-md hover:opacity-90 transition-opacity">
          ↺ Restart demo
        </button>
      </div>
    </div>
  )
}
