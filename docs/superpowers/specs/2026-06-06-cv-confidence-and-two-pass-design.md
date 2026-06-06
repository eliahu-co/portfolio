# Change Validation Prototype — Confidence Levels & Two-Pass Workflow (Design)

Date: 2026-06-06
Author: Eliahu Cohen (with Claude)
Status: Approved — ready for implementation plan

## Context

Enhancement to the existing interactive prototype at `app/HA-DrawingAnalyzer/demo`
(route `/HA-DrawingAnalyzer/demo`). Two additions:

1. **Per-change confidence levels** in the Change Validation review rail.
2. **A two-pass review workflow** that demonstrates the *value* of Change
   Validation — the first validation surfaces an **unintended** change (a removed
   toilet); the user cancels, uploads a corrected drawing, the second validation
   is clean, and the review is submitted.

Still a fully mocked, desktop-only, ~30–60s demo. No backend, no AI, no real diffing.

## Goals & non-goals

**Goal:** Make the demo tell a believable story — Change Validation catches an
unintended change before it ships — and add confidence as PM-credible metadata.

**Non-goals:** real diffing/AI, persistence, multi-sheet, new chrome. Verification
stays manual (click-through) + `npx tsc --noEmit` + headless screenshots.

## Workflow (state machine)

Linear, guided path:

1. **Files** — `P1016 Bulletin 1 - Second Floor Plan.pdf` at **V1 · Approved**.
2. **Upload modified drawing** → progress → row becomes **V2** (this is *pass 1*).
3. **Submit for review** → "Generating change review…" → **Change Validation (pass 1)**:
   five changes — Doors added, Wall moved, Bedroom 2 area, Bedroom 3 area, **Toilet removed**.
4. **Cancel** → back to **Files** at V2, with a hint to upload a corrected drawing.
5. **Upload modified drawing** again → progress → row becomes **V3** (this is *pass 2*).
6. **Submit for review** → **Change Validation (pass 2)**: four changes (toilet is
   back in the drawing, so it is no longer reported).
7. **Confirm changes** → Submit-for-review modal → **Submit** → Files at **V3** with
   the **In review** badge + the existing "Demo ended" banner.

**State:** add `pass: 1 | 2` alongside the existing `version` and `status`.
Version increments **V1 → V2 → V3**. Restart resets to V1 / pass 1 / status none.

- `handleUploadComplete`: V1→V2 (pass 1) on first upload; V2→V3 (pass 2) on second.
- `handleSubmit` (Files): runs the validating delay then shows Change Validation for
  the current pass.
- **Cancel** (pass 1): return to Files at V2; surface the "unintended change" hint;
  the target row re-enables **Upload modified drawing**.
- **Confirm** (pass 2): open the Submit-for-review modal; its Submit files the review.

## Change data (`data.ts`)

Each `Change` gains `passes: number[]` and `confidence: 'High' | 'Medium' | 'Low'`.
**Confidence = how confident the AI is that this is a real change.**

| id        | type     | passes | confidence |
|-----------|----------|--------|------------|
| doors     | added    | [1, 2] | High       |
| wall      | modified | [1, 2] | Medium     |
| bedroom3  | modified | [1, 2] | High       |
| bedroom2  | modified | [1, 2] | High       |
| toilet    | removed  | [1]    | High       |

Rationale: the wall move is the subtler geometric change, so the model is only
**Medium** sure it is a real change; the area recalcs and added/removed objects are
clear differences (**High**).

`ChangeValidation` renders `CHANGES.filter(c => c.passes.includes(currentPass))`.
(No change is "Low" in this dataset; the dot/label badge still supports Low if one
is later flipped to showcase it.)

## Floor plan

`FloorPlan` (incoming variant) renders only the change-objects active in the
current pass:

- **Pass 1 incoming:** green corridor doors, yellow moved wall, area highlights,
  and the **toilet as a red dashed ghost + marker** (removed).
- **Pass 2 incoming:** green doors, yellow wall, area highlights, and the **toilet
  present in normal ink** — no red ghost, no toilet marker (it was restored).

**Mechanism:** pass the active pass (or the active change set) into `FloorPlan`; the
toilet-removed treatment + marker render only when the toilet change is active. The
Current (V1) pane is unchanged.

## Confidence badge (review rail)

Each change card shows a confidence indicator: a small **dot** (green = High,
amber = Medium, red = Low) + the word **High / Medium / Low** in neutral gray text.
Placed near the colored type tag but visually distinct from it (the dot is small and
the label is neutral, so it reads as "confidence", not a second type tag).

## Demo guidance (pass-aware annotations)

To steer the guided demo, with cues styled as **demo annotations** (clearly not part
of the Forma UI):

- **Pass 1:**
  - The **Toilet removed** card shakes (reuse the existing `demo-shake` keyframe) and
    shows a demo-note callout: *"Oops — let's say the designer didn't mean to remove
    this toilet. Cancel instead of submitting the review."*
  - The **Cancel** button shakes.
- **Pass 2:**
  - The **Confirm changes** button shakes (cue to finish). No callout, no cancel-shake.

The callout is a small distinct annotation (e.g., warm/dark note styling with a
pointer toward the toilet card), not Forma chrome.

## Components touched

- `FormaPrototype.tsx` — `pass` state; two upload cycles (V2 then V3); cancel/confirm
  wiring; post-cancel "unintended change" hint; pass passed down to the screens.
- `data.ts` — `passes` + `confidence` on `Change`; type updates.
- `ChangeValidation.tsx` — filter changes by pass; confidence dot+label badge;
  pass-aware demo cues (toilet card shake + callout, Cancel shake, pass-2 Confirm
  shake).
- `FloorPlan.tsx` — pass-aware change rendering (toilet present in pass 2).
- `FilesScreen.tsx` — re-enable **Upload modified drawing** after a cancel; V3 +
  updated "Last updated".
- `page.tsx` — `demo-shake` keyframe already present; add demo-note callout styling
  if needed.

## Verification

Manual click-through of the full path (upload → V2 → pass 1 → Cancel → upload → V3 →
pass 2 → Confirm → Submit → In review + Demo ended), plus the confidence badges and
pass-aware cues. `npx tsc --noEmit` clean. Desktop-first; mobile guard unchanged.
