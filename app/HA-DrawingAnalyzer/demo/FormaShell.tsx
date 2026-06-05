import React from 'react'

const NAV_ITEMS_TOP = [
  { label: 'Files', active: true },
  { label: 'Specifications' },
  { label: 'Reviews' },
  { label: 'Transmittals' },
  { label: 'Issues' },
  { label: 'Boards' },
]

const NAV_ITEMS_BOTTOM = [
  { label: 'Reports' },
  { label: 'Members' },
  { label: 'Bridge' },
]

export default function FormaShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen font-sans">
      {/* Top bar */}
      <div className="h-9 bg-[#1a1a1a] text-white flex items-center px-3 gap-2 shrink-0">
        <span className="text-[10px] text-white/60 mr-0.5">▲</span>
        <span className="text-[11px] font-semibold tracking-wide">AUTODESK</span>
        <span className="text-[13px]">Forma</span>
        <div className="ml-auto flex items-center gap-3 text-white/80">
          <span className="text-[13px] cursor-pointer hover:text-white">✦</span>
          <span className="text-[13px] cursor-pointer hover:text-white">?</span>
          <div className="h-6 w-6 rounded-full bg-[#0d66d0] text-white text-[10px] grid place-items-center font-medium cursor-pointer">
            EC
          </div>
        </div>
      </div>

      {/* Sub bar */}
      <div className="h-11 bg-white border-b border-[#e6e6e6] flex items-center px-3 gap-3 text-[#1a1a1a] shrink-0">
        {/* App icon */}
        <div className="h-6 w-6 rounded bg-[#0d66d0]/10 text-[#0d66d0] grid place-items-center text-[11px] shrink-0">
          ▦
        </div>
        {/* App name */}
        <span className="text-[13px] font-medium">Data Management</span>
        <span className="text-[11px] text-[#5a5a5a]">▾</span>

        {/* Divider */}
        <div className="h-4 w-px bg-[#e6e6e6] mx-0.5" />

        {/* Back arrow */}
        <span className="text-[13px] text-[#9e9e9e] cursor-pointer hover:text-[#1a1a1a]">←</span>

        {/* Breadcrumb */}
        <span className="text-[13px] text-[#1a1a1a]">P1016 · SFH2X</span>
        <span className="text-[11px] text-[#5a5a5a]">▾</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <nav className="w-[200px] shrink-0 border-r border-[#e6e6e6] bg-white py-3 text-[13px] flex flex-col">
          <div className="flex flex-col">
            {NAV_ITEMS_TOP.map((item) => (
              <div
                key={item.label}
                className={
                  item.active
                    ? 'flex items-center gap-2.5 px-4 py-1.5 text-[#0d66d0] font-medium border-l-2 border-[#0d66d0] -ml-[2px] cursor-pointer'
                    : 'flex items-center gap-2.5 px-4 py-1.5 text-[#3c4043] hover:bg-[#f5f5f5] cursor-pointer'
                }
              >
                <div
                  className={
                    item.active
                      ? 'h-4 w-4 rounded-sm bg-[#0d66d0]/20 shrink-0'
                      : 'h-4 w-4 rounded-sm bg-[#3c4043]/15 shrink-0'
                  }
                />
                {item.label}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col">
            {NAV_ITEMS_BOTTOM.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-4 py-1.5 text-[#3c4043] hover:bg-[#f5f5f5] cursor-pointer"
              >
                <div className="h-4 w-4 rounded-sm bg-[#3c4043]/15 shrink-0" />
                {item.label}
              </div>
            ))}
          </div>

          {/* Collapse glyph at bottom */}
          <div className="mt-auto px-4 py-2 text-[#9e9e9e] text-[13px] cursor-pointer hover:text-[#3c4043]">
            ←
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-auto bg-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  )
}
