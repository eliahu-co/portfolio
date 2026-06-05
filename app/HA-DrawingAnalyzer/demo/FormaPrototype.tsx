'use client'
import { useState } from 'react'
import FormaShell from './FormaShell'
import FilesScreen from './FilesScreen'
import UploadDialog from './UploadDialog'

export default function FormaPrototype() {
  const [version, setVersion] = useState<1 | 2>(1)
  const [status] = useState<'none' | 'in-review'>('none')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)

  function handleUploadComplete() {
    setUploadOpen(false)
    setVersion(2)
  }
  function handleSubmit() {
    setValidating(true)
    setTimeout(() => { setValidating(false) }, 1100)
    // NOTE: screen switch to the review screen is wired in a later task
  }

  return (
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
  )
}
