# CV Confidence Levels & Two-Pass Workflow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-change confidence levels and a two-pass review workflow (first validation surfaces an unintended toilet removal → Cancel → re-upload → clean validation → Submit) to the existing `app/HA-DrawingAnalyzer/demo` prototype, with pass-aware demo cues.

**Architecture:** Drive everything off a `pass` (1 | 2) in the `FormaPrototype` state machine plus a `passes`/`confidence` field on each `Change`. `ChangeValidation` and `FloorPlan` filter what they render by the current pass; the toilet is only "removed" in pass 1. Demo cues (shakes + an "oops" callout) are gated by pass.

**Tech Stack:** Next.js 14 App Router, React client components, TypeScript, Tailwind, inline SVG. No new deps. No test runner — verify with `npx tsc --noEmit` and the render/screenshot harness below.

**Spec:** `docs/superpowers/specs/2026-06-06-cv-confidence-and-two-pass-design.md`

**Confidence colors (reuse type palette, but render as a small dot + neutral label so it reads as "confidence"):** High `#2e7d32`, Medium `#b8860b`, Low `#c62828`.

**Letter rule (unchanged):** a change's marker/badge letter is `String.fromCharCode(65 + CHANGES.findIndex(x => x.id === c.id))` so letters stay stable when pass 2 hides the toilet (A doors · B bedroom3 · C bedroom2 · D wall · E toilet).

---

## File structure

- `app/HA-DrawingAnalyzer/demo/data.ts` — add `passes` + `confidence` to `Change`; add `CONF_META`; drop `shownIn`.
- `app/HA-DrawingAnalyzer/demo/FloorPlan.tsx` — add `pass` prop; render change-objects/markers by active pass; toilet present in pass 2.
- `app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx` — add `pass` prop; filter rail by pass; confidence dot+label; pass-aware cues (toilet card shake + callout, Cancel shake in pass 1, Confirm shake in pass 2); pass FloorPlan `pass`.
- `app/HA-DrawingAnalyzer/demo/FilesScreen.tsx` — replace version-inferred button with an explicit `action: 'upload' | 'submit'` prop.
- `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx` — add `pass` + `awaitingUpload` + `reuploadHint` state; two upload cycles (V1→V2→V3); cancel/confirm wiring; re-upload hint; pass everything down.

---

### Task 1: Data model — `passes` + `confidence`

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/data.ts`

- [ ] **Step 1: Update the `Change` type** — replace `shownIn` with `passes`, add `confidence`. Replace the existing `type Change = {...}` block with:

```ts
export type Confidence = 'High' | 'Medium' | 'Low'

export type Change = {
  id: string
  type: ChangeType
  title: string
  description: string
  passes: number[]                   // which review passes report this change
  confidence: Confidence             // how sure the AI is this is a real change
  crop: string                       // SVG viewBox "minX minY w h" for thumbnail
  marker: { x: number; y: number }   // marker chip center in plan coords
}
```

- [ ] **Step 2: Update `CHANGES`** — keep the existing order/crops/markers; swap `shownIn: 'incoming'` for `passes`, add `confidence`. Replace the whole `CHANGES` array with:

```ts
export const CHANGES: Change[] = [
  { id: 'doors',    type: 'added',    title: 'Doors added',          description: '2 doors added — Laundry and Corridor.',  passes: [1, 2], confidence: 'High',   crop: '470 345 150 120', marker: { x: 450, y: 402 } },
  { id: 'bedroom3', type: 'modified', title: 'Bedroom 3 area changed', description: 'Area 138 SF → 149 SF (+8%).',           passes: [1, 2], confidence: 'High',   crop: '332 430 260 224', marker: { x: 508, y: 551 } },
  { id: 'bedroom2', type: 'modified', title: 'Bedroom 2 area changed', description: 'Area 126 SF → 116 SF (−8%).',           passes: [1, 2], confidence: 'High',   crop: '116 432 240 222', marker: { x: 284, y: 551 } },
  { id: 'wall',     type: 'modified', title: 'Wall moved',           description: 'Partition between Bedroom 2 and 3 relocated.', passes: [1, 2], confidence: 'Medium', crop: '270 470 150 150', marker: { x: 340, y: 548 } },
  { id: 'toilet',   type: 'removed',  title: 'Toilet removed',       description: 'Toilet removed from Bath 2.',            passes: [1],    confidence: 'High',   crop: '116 230 150 130', marker: { x: 206, y: 300 } },
]
```

- [ ] **Step 3: Add `CONF_META`** below `TYPE_META`:

```ts
export const CONF_META: Record<Confidence, string> = {
  High: '#2e7d32',
  Medium: '#b8860b',
  Low: '#c62828',
}
```

- [ ] **Step 4: Verify** — `npx tsc --noEmit` will now FAIL in `FloorPlan.tsx`/`ChangeValidation.tsx` (they still reference `shownIn`). That's expected; Tasks 2–3 fix it. Confirm the only errors are about `shownIn`/missing `pass`, nothing else in `data.ts`.

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: errors only in `FloorPlan.tsx` and `ChangeValidation.tsx` referencing `shownIn`.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/data.ts
git commit -m "feat(demo): add passes + confidence to change data model"
```

---

### Task 2: `FloorPlan` — pass-aware rendering

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/FloorPlan.tsx`

- [ ] **Step 1: Add the `pass` prop.** Change the component signature/destructure to:

```tsx
export default function FloorPlan({
  version, focus, viewBox, onFocus, pass = 1,
}: {
  version: 'current' | 'incoming'
  focus?: string | null
  viewBox?: string
  onFocus?: (id: string | null) => void
  pass?: 1 | 2
}) {
```

- [ ] **Step 2: Replace the `marked` computation** (the line `const marked = CHANGES.filter((c) => c.shownIn === version)`) with active-by-pass + a helper:

```tsx
  const active = version === 'incoming' ? CHANGES.filter((c) => c.passes.includes(pass)) : []
  const has = (id: string) => active.some((c) => c.id === id)
```

- [ ] **Step 3: Make the toilet pass-aware.** Replace the existing Bath 2 toilet change line:

```tsx
      {/* Bath 2 (39 SF) toilet: solid normally; red dashed ghost only when "removed" is active (pass 1) */}
      <Toilet x={236} y={300} dir="left" color={has('toilet') ? TYPE_META.removed.color : FIXTURE} bold={has('toilet')} dashed={has('toilet')} />
```

- [ ] **Step 4: Gate the added doors + moved wall on `has(...)`.** Replace the two incoming-only blocks:

```tsx
      {/* added corridor doors — green, when active */}
      {has('doors') && (<>
        <Door x={240} y={395} len={30} rot={0} mirror accent={TYPE_META.added.color} />
        <Door x={584} y={390} len={30} rot={0} mirror accent={TYPE_META.added.color} />
      </>)}

      {/* modified partition — moved Bedroom 3 wall drawn yellow, when active */}
      {has('wall') && wallRect({ d: 'v', y1: 438, y2: 650, x: b3Left, t: T_INT }, 'b3y', YELLOW, YELLOW, 1)}
```

- [ ] **Step 5: Drive markers off `active`.** In the markers block, change `{marked.map((c) => {` to `{active.map((c) => {`. Leave the rest of that block (dots/rect/halo/letter logic) unchanged.

- [ ] **Step 6: Verify with the render harness.** Create `scratch-render.tsx` at repo root:

```tsx
import { renderToStaticMarkup } from 'react-dom/server'
import FloorPlan from './app/HA-DrawingAnalyzer/demo/FloorPlan'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp')
async function out(el: JSX.Element, file: string) {
  let svg = renderToStaticMarkup(el)
  svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="760" ')
  await sharp(Buffer.from(svg)).png().toFile(file)
}
async function main() {
  await out(<FloorPlan version="incoming" pass={1} />, 'scratch-pass1.png')
  await out(<FloorPlan version="incoming" pass={2} />, 'scratch-pass2.png')
  console.log('rendered')
}
main()
```

Run:
```bash
npx tsc --noEmit 2>&1 | head -10
npx tsc scratch-render.tsx --jsx react-jsx --module commonjs --target es2019 --esModuleInterop --moduleResolution node --skipLibCheck --outDir scratch-build && node scratch-build/scratch-render.js
```
Expected: `tsc --noEmit` clean; `scratch-pass1.png` shows the red dashed toilet ghost + its marker; `scratch-pass2.png` shows the toilet present in normal ink with NO toilet marker (doors/wall/areas identical in both). Open both PNGs to confirm.

- [ ] **Step 7: Clean up + commit**

```bash
rm -rf scratch-render.tsx scratch-build scratch-pass1.png scratch-pass2.png
git add app/HA-DrawingAnalyzer/demo/FloorPlan.tsx
git commit -m "feat(demo): pass-aware floor plan (toilet restored in pass 2)"
```

---

### Task 3: `ChangeValidation` — pass filter + confidence badges

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx`

- [ ] **Step 1: Import `CONF_META`.** Update the data import to include it:

```tsx
import { CHANGES, TYPE_META, CONF_META } from './data'
```

- [ ] **Step 2: Add `pass` to props.** Change the component signature to:

```tsx
export default function ChangeValidation({
  onReturn,
  onConfirm,
  pass,
}: {
  onReturn: () => void
  onConfirm: () => void
  pass: 1 | 2
}) {
```

- [ ] **Step 3: Pass `pass` into the Incoming pane.** In `Pane`, add `pass` to its props and forward it to `FloorPlan`:

```tsx
function Pane({ version, focus, onFocus, pass }: { version: 'current' | 'incoming'; focus?: string | null; onFocus?: (id: string | null) => void; pass?: 1 | 2 }) {
```
and inside its body change the FloorPlan to:
```tsx
        <FloorPlan version={version} focus={focus} onFocus={onFocus} pass={pass} />
```
Then update the two pane usages:
```tsx
            <Pane version="current" />
            <Pane version="incoming" focus={focus} onFocus={setFocus} pass={pass} />
```

- [ ] **Step 4: Filter the rail by pass + fix the letter + add the confidence badge.** Replace the rail's `{CHANGES.map((c, i) => {` opening through the type-tag/title region so the card maps over the filtered list, computes a stable letter, and shows a confidence dot+label. Concretely:

Change the map header:
```tsx
            {CHANGES.filter((c) => c.passes.includes(pass)).map((c) => {
              const active = focus === c.id
              const color = TYPE_META[c.type].color
              const letter = String.fromCharCode(65 + CHANGES.findIndex((x) => x.id === c.id))
```

Change the numbered badge `{i + 1}` (inside the card) to `{letter}`.

Add the confidence badge next to the `<TypeTag .../>` (in the same row that holds the badge + type tag):
```tsx
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-[#5a5a5a]">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ background: CONF_META[c.confidence] }} />
                        {c.confidence}
                      </span>
```

- [ ] **Step 5: Update the rail header count** so it reflects the current pass. Replace the count line:
```tsx
            <p className="text-[11px] text-[#5a5a5a] mt-0.5">{CHANGES.filter((c) => c.passes.includes(pass)).length} changes detected · object-level diff</p>
```

- [ ] **Step 6: Verify.** Temporarily render the hero via a scratch route. Create `app/HA-DrawingAnalyzer/demo/preview/page.tsx`:

```tsx
'use client'
import ChangeValidation from '../ChangeValidation'
export default function Preview() {
  return (
    <div className="demo-root">
      <ChangeValidation onReturn={() => {}} onConfirm={() => {}} pass={1} />
      <style>{`.demo-root, .demo-root * { cursor: auto !important; }`}</style>
    </div>
  )
}
```

Run the dev server if not running (`npm run dev`), then:
```bash
curl -s -o /dev/null --max-time 45 "http://localhost:3000/HA-DrawingAnalyzer/demo/preview"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars --screenshot="scratch-hero1.png" --window-size=1680,1000 "http://localhost:3000/HA-DrawingAnalyzer/demo/preview"
```
Expected (`scratch-hero1.png`, pass 1): rail shows 5 cards A–E, each with a confidence dot+label (Wall = amber/Medium, others green/High), and the Incoming pane shows the red toilet ghost. Then change `pass={1}` → `pass={2}` in the preview, re-screenshot to `scratch-hero2.png`: 4 cards (A,B,C,D — no toilet), toilet present in the plan. `npx tsc --noEmit` clean.

- [ ] **Step 7: Remove the scratch route + commit**

```bash
rm -rf app/HA-DrawingAnalyzer/demo/preview .next/types/app/HA-DrawingAnalyzer/demo/preview scratch-hero1.png scratch-hero2.png
git add app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx
git commit -m "feat(demo): filter review by pass + per-change confidence badges"
```

---

### Task 4: `ChangeValidation` — pass-aware demo cues

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx`

- [ ] **Step 1: Shake + annotate the toilet card.** Inside the rail card `<button>` (the one mapping over changes), add `demo-shake` to the card className when `c.id === 'toilet'`, and render an "oops" callout above the card's content. At the top of the `<button>`'s children add:

```tsx
                  {c.id === 'toilet' && (
                    <div className="absolute -top-2 left-2 right-2 -translate-y-full rounded-md bg-[#1a1a1a] text-white text-[11px] leading-snug px-2.5 py-1.5 shadow-lg">
                      <span className="font-semibold">Demo note — </span>
                      the designer didn&apos;t mean to remove this toilet. Hit <span className="font-semibold">Cancel</span> instead of submitting.
                    </div>
                  )}
```
Make the card `relative` and conditionally `demo-shake` by changing its className to include `relative` and `${c.id === 'toilet' ? 'demo-shake' : ''}`. (The card already has `rounded-md border bg-white p-2.5 flex gap-3 ...`; append `relative` and the conditional shake.)

- [ ] **Step 2: Shake the footer action per pass.** In the footer, add `demo-shake` to **Cancel** when `pass === 1` and to **Confirm changes** when `pass === 2`. Update the two buttons' classNames to append:
  - Cancel: `${pass === 1 ? 'demo-shake' : ''}`
  - Confirm: `${pass === 2 ? 'demo-shake' : ''}`

- [ ] **Step 3: Verify.** Recreate the same `preview/page.tsx` from Task 3 Step 6 (pass={1}), dev server running, screenshot `scratch-cues.png` at `1680x1000`. Expected: a dark "Demo note" callout sits above the Toilet card, and the Cancel button is present (shake is periodic; the callout + card position confirm wiring). Switch to `pass={2}` and confirm the callout/toilet card are gone and only Confirm is cued. Then delete the preview route.

```bash
rm -rf app/HA-DrawingAnalyzer/demo/preview .next/types/app/HA-DrawingAnalyzer/demo/preview scratch-cues.png
npx tsc --noEmit 2>&1 | head -5
```
Expected: tsc clean.

- [ ] **Step 4: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/ChangeValidation.tsx
git commit -m "feat(demo): pass-aware demo cues (toilet note + shakes)"
```

---

### Task 5: `FilesScreen` — explicit action prop

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/FilesScreen.tsx`

- [ ] **Step 1: Add `action` to props.** Change the signature to:

```tsx
export default function FilesScreen({
  version, status, action, onUpload, onSubmit, busyHint,
}: {
  version: 1 | 2 | 3
  status: 'none' | 'in-review'
  action: 'upload' | 'submit'
  onUpload: () => void
  onSubmit: () => void
  busyHint?: string | null
}) {
```

- [ ] **Step 2: Drive the inline button off `action` instead of `version`.** Replace the inline-action ternary (the `busyHint ? ... : version === 1 ? <Upload> : <Submit>` block) with `busyHint`-first, then `action`:

```tsx
                  {isTarget && status !== 'in-review' && (
                    busyHint ? (
                      <span className="flex items-center gap-1.5 shrink-0">
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-[#0d66d0]/30 border-t-[#0d66d0] animate-spin" aria-hidden="true" />
                        <span className="text-[12px] text-[#5a5a5a] whitespace-nowrap">{busyHint}</span>
                      </span>
                    ) : action === 'upload' ? (
                      <span className="demo-shake relative inline-flex rounded shrink-0">
                        <span className="absolute inset-0 rounded ring-2 ring-[#0d66d0]/30 animate-pulse" />
                        <button onClick={onUpload} className="relative text-[12px] text-[#0d66d0] border border-[#0d66d0]/50 bg-white rounded px-2.5 py-1 hover:bg-[#0d66d0]/5 whitespace-nowrap">
                          Upload modified drawing
                        </button>
                      </span>
                    ) : (
                      <span className="demo-shake relative inline-flex rounded shrink-0">
                        <span className="absolute inset-0 rounded ring-2 ring-[#0d66d0]/30 animate-pulse" />
                        <button onClick={onSubmit} className="relative text-[12px] text-white bg-[#0d66d0] rounded px-2.5 py-1 hover:opacity-90 whitespace-nowrap">
                          Submit for review
                        </button>
                      </span>
                    )
                  )}
```

- [ ] **Step 3: Keep the version pill + "Last updated" working for V3.** The existing `versionBumped = isTarget && version === 2` only highlights at V2. Change it to highlight at V2 or V3:

```tsx
            const versionBumped = isTarget && version >= 2
            const updated = versionBumped ? 'Jun 10, 2026 17:30' : row.updated
```
(The Version pill already renders `V{displayVersion}`, so V3 shows automatically.)

- [ ] **Step 4: Verify** — `npx tsc --noEmit` will FAIL in `FormaPrototype.tsx` (it doesn't pass `action` yet). Confirm the only new errors are in `FormaPrototype.tsx`. Commit.

```bash
git add app/HA-DrawingAnalyzer/demo/FilesScreen.tsx
git commit -m "feat(demo): Files screen driven by explicit action prop (supports V3)"
```

---

### Task 6: `FormaPrototype` — two-pass state machine

**Files:**
- Modify: `app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx`

- [ ] **Step 1: Replace the component state + handlers.** Swap the state block and handlers for:

```tsx
  const [screen, setScreen] = useState<'files' | 'review'>('files')
  const [version, setVersion] = useState<1 | 2 | 3>(1)
  const [pass, setPass] = useState<1 | 2>(1)
  const [status, setStatus] = useState<'none' | 'in-review'>('none')
  const [awaitingUpload, setAwaitingUpload] = useState(true) // true = next action is "upload"
  const [uploadOpen, setUploadOpen] = useState(false)
  const [validating, setValidating] = useState(false)
  const [submitOpen, setSubmitOpen] = useState(false)
  const [uploaded, setUploaded] = useState(false)       // "new version uploaded" banner
  const [reuploadHint, setReuploadHint] = useState(false) // "unintended change found" hint after cancel

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
  function handleConfirm() {           // CV "Confirm changes" → submit modal
    setSubmitOpen(true)
  }
  function handleSubmitReview() {      // modal Submit → file the review, end demo
    setSubmitOpen(false)
    setScreen('files')
    setStatus('in-review')
  }
  function handleReturn() {            // CV "Cancel"
    setScreen('files')
    if (pass === 1) { setAwaitingUpload(true); setReuploadHint(true) } // re-upload a corrected drawing
  }
  function handleRestart() {
    setScreen('files'); setVersion(1); setPass(1); setStatus('none')
    setAwaitingUpload(true); setUploadOpen(false); setValidating(false)
    setSubmitOpen(false); setUploaded(false); setReuploadHint(false)
  }

  const done = status === 'in-review'
  const action: 'upload' | 'submit' = awaitingUpload ? 'upload' : 'submit'
```

- [ ] **Step 2: Pass `pass` + `action` down, and render the review pass.** Update the render's screen switch:

```tsx
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
```

- [ ] **Step 3: Add the post-cancel hint banner.** Just before the "Upload success banner" block, add:

```tsx
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
```

The existing "Upload success banner" (`{uploaded && !done && ...}`) and "Demo ended" banner (`{done && ...}`) stay as-is. (Note: `uploaded` and `reuploadHint` are mutually exclusive — uploading clears the hint.)

- [ ] **Step 4: Verify the full flow end-to-end.** Dev server running, open `http://localhost:3000/HA-DrawingAnalyzer/demo` in a real browser and click through:
  1. Row V1 · Approved, action = "Upload modified drawing" (shaking).
  2. Upload → progress → V2; "New version uploaded" banner; action = "Submit for review".
  3. Submit → "Generating change review…" → Change Validation **pass 1**: 5 cards A–E with confidence dots; Toilet card has the dark "Demo note" callout; Incoming pane shows red toilet ghost; **Cancel** is cued.
  4. Cancel → back to Files V2; red "Review cancelled — unintended change found" hint; action = "Upload modified drawing" again.
  5. Upload → V3; Submit → Change Validation **pass 2**: 4 cards (no toilet); toilet present in plan; **Confirm changes** cued.
  6. Confirm → Submit-for-review modal → Submit → Files V3 with **In review** badge + **Demo ended** banner.
  7. Restart demo → back to V1.

Run: `npx tsc --noEmit 2>&1 | head -5`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add app/HA-DrawingAnalyzer/demo/FormaPrototype.tsx
git commit -m "feat(demo): two-pass review flow (cancel → re-upload → submit)"
```

---

### Task 7: Final verification & polish

**Files:** (touch-ups only, as needed)

- [ ] **Step 1: Full manual run-through** of all 7 steps in Task 6 Step 4. Confirm: confidence badges read correctly (Wall = Medium/amber, rest High/green), letters stay A–D in pass 2, the toilet callout + shakes only show where intended, banners don't overlap, and Restart fully resets.

- [ ] **Step 2: Headless screenshots** of pass 1 and pass 2 review screens (use the temporary `preview/page.tsx` from Task 3 Step 6, toggling `pass`) and the Files screen, to eyeball confidence badges + the toilet callout. Delete the preview route after.

- [ ] **Step 3: Typecheck** — `npx tsc --noEmit` clean.

- [ ] **Step 4: Commit any polish, then push**

```bash
git add app/HA-DrawingAnalyzer/demo
git commit -m "polish(demo): confidence + two-pass final pass"
git push origin main
```

---

## Self-review notes

- **Spec coverage:** two-pass workflow (T6), `passes`/`confidence` data (T1), pass-aware floor plan w/ toilet restored in pass 2 (T2), pass filter + confidence dot/label badges (T3), pass-aware demo cues — toilet shake+callout, Cancel shake pass 1, Confirm shake pass 2 (T4), post-cancel re-upload affordance + hint (T5 action prop, T6 hint), version V3 (T5/T6).
- **Letters stay stable** because the badge/marker letter is derived from `CHANGES.findIndex(byId)`, not the filtered map index.
- **Type consistency:** `Change` gains `passes:number[]` + `confidence:Confidence`; `FloorPlan` adds `pass?:1|2`; `ChangeValidation` adds `pass:1|2`; `FilesScreen` adds `action:'upload'|'submit'` and widens `version` to `1|2|3`; `FormaPrototype` owns `pass`, `awaitingUpload`, `reuploadHint`. `CONF_META` keyed by `Confidence`.
- **No tests** is intentional (no runner; matches the existing prototype). Each task ends in tsc + a concrete visual check + commit.
- **Known intra-task tsc failures** (T1, T5) are expected and resolved by the next task; called out explicitly so the implementer doesn't thrash.
