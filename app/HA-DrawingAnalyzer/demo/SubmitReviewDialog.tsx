// app/HA-DrawingAnalyzer/demo/SubmitReviewDialog.tsx
// "Submit for review" modal (modeled on Forma's page3), shown after the user
// confirms the detected changes. Fields are pre-filled for the demo; clicking
// Submit is what actually files the review.

'use client'

const BLUE = '#0d66d0'

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-[12px] font-medium text-[#1a1a1a] mb-1.5">
      {children}{required && <span className="text-[#c62828]"> *</span>}
    </p>
  )
}

function PersonChip({ initials, name, color }: { initials: string; name: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#eef1f4] rounded-full pl-1 pr-2.5 py-0.5">
      <span className="grid place-items-center h-5 w-5 rounded-full text-white text-[9px] font-semibold" style={{ background: color }}>{initials}</span>
      <span className="text-[12px] text-[#1a1a1a]">{name}</span>
    </span>
  )
}

export default function SubmitReviewDialog({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[55] grid place-items-center" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl w-[520px] max-w-[92vw] font-sans text-[#1a1a1a]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-[18px] font-medium">Submit for review</h2>
          <button onClick={onCancel} aria-label="Close" className="text-[#5a5a5a] hover:text-[#1a1a1a] text-lg leading-none w-6 h-6 grid place-items-center">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 pb-2 flex flex-col gap-4">
          <div>
            <Label required>Approval workflow</Label>
            <div className="flex items-center justify-between border border-[#d9d9d9] rounded px-3 h-9 text-[13px]">
              <span>Home Assignment Review Process</span>
              <span className="text-[#5a5a5a]">▾</span>
            </div>
          </div>

          <div>
            <Label required>Review name</Label>
            <div className="border border-[#d9d9d9] rounded px-3 h-9 flex items-center text-[13px]">Product Manager Application</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-medium text-[#1a1a1a]">Reviewer<span className="text-[#c62828]"> *</span></p>
                <button className="demo-mock text-[12px]" style={{ color: BLUE }}>Add reviewers</button>
              </div>
              <div className="border border-[#d9d9d9] rounded px-2 h-9 flex items-center">
                <PersonChip initials="OS" name="Or Shanoon" color="#0d66d0" />
              </div>
            </div>
            <div>
              <Label>Notify</Label>
              <div className="border border-[#d9d9d9] rounded px-2 h-9 flex items-center">
                <PersonChip initials="NC" name="Noa Constantin" color="#6b4fa0" />
              </div>
            </div>
          </div>

          <div>
            <Label required>Files for review</Label>
            <p className="text-[12px] text-[#5a5a5a] mb-2">Total: <span className="font-medium text-[#1a1a1a]">1 file</span></p>
            <div className="flex items-center gap-2 border border-[#eee] rounded px-2.5 py-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded text-[8px] font-bold text-[#c62828] border border-[#c62828]/40 bg-[#c62828]/5 shrink-0">PDF</span>
              <span className="text-[12.5px] truncate flex-1">P1016 Bulletin 1 - Second Floor Plan.pdf</span>
              <span className="inline-block text-[11px] text-[#0d66d0] border border-[#0d66d0]/50 rounded-full px-1.5 leading-5 shrink-0">V2</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#eee] pt-3 text-[13px] text-[#5a5a5a]">
            <span>Notes</span>
            <span>▾</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button onClick={onCancel} className="text-[13px] font-medium" style={{ color: BLUE }}>Cancel</button>
          <button onClick={onSubmit} className="text-[13px] font-semibold text-white rounded px-4 py-2 shadow-sm hover:opacity-90" style={{ background: BLUE }}>Submit</button>
        </div>
      </div>
    </div>
  )
}
