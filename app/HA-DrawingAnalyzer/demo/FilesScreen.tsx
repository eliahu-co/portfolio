import { FILE_ROWS } from './data'

type TreeNode = {
  label: string
  open?: boolean
  selected?: boolean
  children?: TreeNode[]
}

// Static folder tree data
const TREE: TreeNode[] = [
  {
    label: 'P1016',
    open: true,
    children: [
      {
        label: 'Bulletin 1',
        open: true,
        children: [
          { label: '01 Submitted' },
          { label: '02 Under Review' },
          { label: '03 Revised' },
          { label: '04 Work In Progress', selected: true },
          { label: '05 NTA Approved' },
        ],
      },
    ],
  },
]

function FolderNode({
  label,
  open,
  selected,
  depth,
  children,
}: {
  label: string
  open?: boolean
  selected?: boolean
  depth: number
  children?: React.ReactNode
}) {
  const isLeaf = !children
  return (
    <div>
      <div
        className={[
          'flex items-center gap-1.5 px-3 py-[3px] cursor-pointer text-[13px]',
          selected
            ? 'bg-[#0d66d0]/10 text-[#0d66d0] font-medium rounded mx-1'
            : 'text-[#3c4043] hover:bg-[#f5f5f5]',
        ].join(' ')}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        {isLeaf ? (
          <span className="text-[10px] text-[#9e9e9e]">—</span>
        ) : open ? (
          <span className="text-[10px]">▾</span>
        ) : (
          <span className="text-[10px]">▸</span>
        )}
        {!isLeaf && (
          <span className="text-[12px]">📁</span>
        )}
        <span className="truncate">{label}</span>
      </div>
      {open && children && <div>{children}</div>}
    </div>
  )
}

function renderTree(
  nodes: TreeNode[],
  depth = 0,
): React.ReactNode {
  return nodes.map((node) => (
    <FolderNode
      key={node.label}
      label={node.label}
      open={node.open}
      selected={node.selected}
      depth={depth}
    >
      {node.children ? renderTree(node.children, depth + 1) : undefined}
    </FolderNode>
  ))
}

function PdfGlyph() {
  return (
    <span className="inline-flex items-center justify-center text-[9px] font-bold text-[#c62828] border border-[#c62828]/40 rounded-sm px-[2px] leading-4 shrink-0 bg-[#c62828]/5">
      PDF
    </span>
  )
}

export default function FilesScreen({
  version,
  status,
  onUpload,
  onSubmit,
  busyHint,
}: {
  version: 1 | 2
  status: 'none' | 'in-review'
  onUpload: () => void
  onSubmit: () => void
  busyHint?: string | null
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-5 pt-4 pb-0 shrink-0">
        <h1 className="text-[20px] font-medium text-[#1a1a1a]">Files</h1>

        {/* Tab row */}
        <div className="demo-mock flex gap-5 mt-3 text-[13px] border-b border-[#e6e6e6]">
          <button className="pb-2 text-[#0d66d0] font-medium border-b-2 border-[#0d66d0] -mb-px">
            Folders
          </button>
          <button className="pb-2 text-[#5a5a5a] hover:text-[#1a1a1a]">
            Packages
          </button>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0 overflow-auto">
        {/* Left: folder tree */}
        <aside className="demo-mock w-[220px] shrink-0 border-r border-[#e6e6e6] py-3 text-[13px] overflow-y-auto bg-white">
          {renderTree(TREE)}
        </aside>

        {/* Right: file table */}
        <div className="flex-1 min-w-0 p-3 overflow-x-auto">
          {/* Table header */}
          <div
            className="grid text-[11px] uppercase tracking-wide text-[#5a5a5a] border-b border-[#e6e6e6] pb-1.5 mb-0"
            style={{ gridTemplateColumns: '1fr 70px 80px 120px 150px 140px' }}
          >
            <span className="px-2">Name</span>
            <span className="px-2">Revision</span>
            <span className="px-2">Version</span>
            <span className="px-2">Review status</span>
            <span className="px-2">Last updated</span>
            <span className="px-2">Updated by</span>
          </div>

          {/* Table rows */}
          {FILE_ROWS.map((row) => {
            const isTarget = !!row.isTarget
            const displayVersion = isTarget ? version : 1
            const versionBumped = isTarget && version === 2
            const updated = versionBumped ? 'Jun 10, 2026 17:30' : row.updated

            return (
              <div
                key={row.id}
                className="grid items-center border-b border-[#f0f0f0] text-[13px] py-2.5 hover:bg-[#0d66d0]/[0.03] group"
                style={{ gridTemplateColumns: '1fr 70px 80px 120px 150px 140px' }}
              >
                {/* Name + inline action (action sits right beside the filename) */}
                <div className="flex items-center gap-2.5 px-2 min-w-0">
                  <PdfGlyph />
                  <span className="truncate text-[#1a1a1a]">{row.name}</span>
                  {isTarget && status !== 'in-review' && (
                    busyHint ? (
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-[#0d66d0]/30 border-t-[#0d66d0] animate-spin" aria-hidden="true" />
                        <span className="text-[12px] text-[#5a5a5a] whitespace-nowrap">{busyHint}</span>
                      </span>
                    ) : version === 1 ? (
                      <span className="demo-shake relative inline-flex rounded shrink-0">
                        <span className="absolute inset-0 rounded ring-2 ring-[#0d66d0]/30 animate-pulse" />
                        <button onClick={onUpload} className="relative text-[12px] text-[#0d66d0] border border-[#0d66d0]/50 bg-white rounded px-2.5 py-1 hover:bg-[#0d66d0]/5 whitespace-nowrap">
                          Upload modified drawing
                        </button>
                      </span>
                    ) : (
                      <span className="relative inline-flex rounded shrink-0">
                        <span className="absolute inset-0 rounded ring-2 ring-[#0d66d0]/30 animate-pulse" />
                        <button onClick={onSubmit} className="relative text-[12px] text-white bg-[#0d66d0] rounded px-2.5 py-1 hover:opacity-90 whitespace-nowrap">
                          Submit for review
                        </button>
                      </span>
                    )
                  )}
                </div>

                {/* Revision */}
                <span className="px-2 text-[#5a5a5a]">—</span>

                {/* Version */}
                <div className="px-2">
                  <span
                    className={[
                      'inline-block text-[11px] text-[#0d66d0] border border-[#0d66d0]/50 rounded-full px-1.5 leading-5',
                      versionBumped ? 'bg-[#0d66d0]/10' : '',
                    ].join(' ')}
                  >
                    V{displayVersion}
                  </span>
                </div>

                {/* Review status */}
                <div className="px-2">
                  {isTarget && status === 'in-review' ? (
                    <span className="inline-block text-[11px] text-[#b8860b] bg-[#b8860b]/10 border border-[#b8860b]/50 rounded-full px-1.5 leading-5">In review</span>
                  ) : isTarget && version === 1 ? (
                    <span className="inline-block text-[11px] text-[#2e7d32] bg-[#2e7d32]/10 border border-[#2e7d32]/50 rounded-full px-1.5 leading-5">Approved</span>
                  ) : null}
                </div>

                {/* Last updated */}
                <span className="px-2 text-[#5a5a5a]">{updated}</span>

                {/* Updated by */}
                <span className="px-2 text-[#5a5a5a]">{row.by}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
