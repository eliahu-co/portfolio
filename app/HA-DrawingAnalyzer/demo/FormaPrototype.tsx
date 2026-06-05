'use client'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'

export default function FormaPrototype() {
  return (
    <FormaShell>
      <FilesScreen version={1} status="none" onUpload={() => {}} onSubmit={() => {}} />
    </FormaShell>
  )
}
