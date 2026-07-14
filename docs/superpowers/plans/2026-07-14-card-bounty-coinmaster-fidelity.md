# Card Bounty Coin Master Fidelity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the interactive Card Bounty prototype so Cards Center, compact dialogs, Magical Chest purchase, and the Spin core loop closely follow the supplied Coin Master references while preserving deterministic, accessible product behavior.

**Architecture:** Keep `demoReducer` as the single state authority, add a shared purchase-preview selector, and move visual responsibilities into focused presentation components. Generated-original WebP artwork supplies illustration layers; live React and CSS continue to own every label, counter, button, meter, focus state, and interaction.

**Tech Stack:** Next.js 14, React 18, TypeScript, CSS Modules, Jest 30, Testing Library, Sharp 0.34, built-in image generation, and the in-app browser for responsive QA.

## Global Constraints

- Preserve all unrelated working-tree changes; stage only the exact files named by each task.
- Never merge to `main` or `master`.
- Do not add a runtime dependency.
- Keep the prototype deterministic: no random chest contents or reel outcomes.
- Every selectable target uses a Bounty threshold of exactly 300.
- Magical Chest remains 29,000,000 Coins, 8 Cards, and +3 Bounty progress per chest.
- Magical Chest opens at quantity 10; the default quote is 80 Cards, 290,000,000 Coins, and +30 progress.
- Starting Coins are exactly 3,200,000,000.
- Keep all UI text and controls live; generated images contain no text.
- Ordinary dialogs use one non-blurred 65-70% scrim and leave the underlying game state recognizable.
- Reward, guarantee, and collection celebrations remain full-screen transient overlays.
- Use `npm.cmd`, `npx.cmd`, and `node.exe` commands because PowerShell blocks the `.ps1` launchers.
- Do not use `npm.cmd run build` for final verification because its unrelated prebuild optimizer mutates `scripts/.optimize-manifest.json`; use `npx.cmd next build`.

## File Structure

### Create

- `app/MA-HomeAssignment/demo/demoVisualData.ts` - collection and deterministic reel artwork metadata.
- `app/MA-HomeAssignment/demo/RibbonDialog.tsx` - accessible modal shell and presentational frame.
- `app/MA-HomeAssignment/demo/RibbonDialog.module.css` - parchment, ribbon, scrim, sizing, and focus chrome.
- `app/MA-HomeAssignment/demo/BountyMeter.tsx` - shared accessible current/projected meter.
- `app/MA-HomeAssignment/demo/BountyMeter.module.css` - standard and compact meter layouts.
- `app/MA-HomeAssignment/demo/CollectionMedallion.tsx` - one Cards Center collection item.
- `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css` - fixed header/tabs and scrolling medallion grid.
- `app/MA-HomeAssignment/demo/BountyPanels.module.css` - intro, picker, confirmation, Active Bounty, and chest-shop content.
- `app/MA-HomeAssignment/demo/ChestPurchaseDialog.module.css` - open-chest purchase composition and projection tray.
- `app/MA-HomeAssignment/demo/SlotMachineBoard.tsx` - live nine-cell deterministic reel board.
- `app/MA-HomeAssignment/demo/SlotMachineBoard.module.css` - cabinet and reel animation geometry.
- `app/MA-HomeAssignment/demo/SpinReturnScreen.module.css` - core-loop scene, HUD, rails, meter, and Spin button.
- `app/MA-HomeAssignment/demo/__tests__/demoVisualData.test.ts`
- `app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx`
- `app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx`
- `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`
- `app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx`
- `app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx`
- `scripts/optimize-card-bounty-assets.js` - explicit Sharp CLI for generated images and poster output.
- `scripts/verify-card-bounty-assets.js` - required-path, format, dimension, alpha, and total-size validation.
- `public/coinmaster/card-bounty/generated/**` - optimized generated-original runtime artwork.
- `public/coinmaster/card-bounty-preview.webp` - assignment-page prototype poster.
- `public/coinmaster/card-bounty-preview.jpg` - Open Graph-compatible poster.

### Modify

- `app/MA-HomeAssignment/demo/demoData.ts` - 300-point economy, default quantities, and 3.2B starting balance.
- `app/MA-HomeAssignment/demo/demoReducer.ts` - quote selector, quantity clamping, and apply-once guards.
- `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx` - one ordinary-dialog host and purchase underlay.
- `app/MA-HomeAssignment/demo/CardsCenterScreen.tsx` - reference-faithful collection screen.
- `app/MA-HomeAssignment/demo/CardBountyPanel.tsx` - content-only Bounty states.
- `app/MA-HomeAssignment/demo/TargetPicker.tsx` - content-only picker.
- `app/MA-HomeAssignment/demo/ChestPurchaseDialog.tsx` - quote-driven purchase content.
- `app/MA-HomeAssignment/demo/RewardSequence.tsx` - open Magical Chest art and batch summary.
- `app/MA-HomeAssignment/demo/SpinReturnScreen.tsx` - generated scene and live reel board.
- `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css` - retain shell/rewards; remove migrated dashboard, dialog, purchase, and village rules.
- `app/MA-HomeAssignment/demo/page.tsx` - safe-area viewport metadata and new Open Graph poster.
- `app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts`
- `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`
- `app/MA-HomeAssignment/sections/PrototypePreview.tsx`
- `app/MA-HomeAssignment/sections/useCaseData.ts`
- `__tests__/ma-homeassignment.test.tsx`

---

### Task 1: Lock the 300-point economy and shared purchase quote

**Files:**
- Modify: `app/MA-HomeAssignment/demo/demoData.ts`
- Modify: `app/MA-HomeAssignment/demo/demoReducer.ts`
- Test: `app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts`

**Interfaces:**
- Produces: `DemoChest.defaultQuantity: number`.
- Produces: `PurchasePreview` and `getPurchasePreview(state: DemoState): PurchasePreview | null`.
- Preserves: existing `DemoAction` names and `DemoState` shape.

- [ ] **Step 1: Write failing economy and apply-once tests**

Update the helper so omitted quantity preserves the chest default:

```ts
function openChest(chestId: ChestId, quantity?: number, start = chooseWhaleBoat()) {
  let state = demoReducer(start, { type: 'CONFIRM_TARGET' })
  state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId })
  if (quantity !== undefined) {
    state = demoReducer(state, { type: 'SET_QUANTITY', quantity })
  }
  return demoReducer(state, { type: 'CONFIRM_PURCHASE' })
}
```

Add focused assertions:

```ts
it('opens Magical at ten and quotes the exact batch', () => {
  let state = demoReducer(chooseWhaleBoat(), { type: 'CONFIRM_TARGET' })
  state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId: 'magical' })

  expect(state.pendingPurchase).toEqual({ chestId: 'magical', quantity: 10 })
  expect(getPurchasePreview(state)).toMatchObject({
    quantity: 10,
    maxAffordable: 110,
    totalCards: 80,
    totalCost: 290_000_000,
    progressBefore: 0,
    progressGain: 30,
    progressAfter: 30,
    meterThreshold: 300,
    isAffordable: true,
  })
})

it('applies a confirmed quote exactly once', () => {
  const purchased = openChest('magical')
  const repeated = demoReducer(purchased, { type: 'CONFIRM_PURCHASE' })

  expect(purchased).toMatchObject({
    coins: 2_910_000_000,
    meterProgress: 30,
    lastCoinCost: 290_000_000,
    lastProgressEarned: 30,
    overlay: 'chest-opening',
  })
  expect(repeated).toBe(purchased)
})

it('reaches 300 in ten default Magical batches', () => {
  let state = demoReducer(chooseWhaleBoat(), { type: 'CONFIRM_TARGET' })
  for (let batch = 1; batch <= 10; batch += 1) {
    state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId: 'magical' })
    state = demoReducer(state, { type: 'CONFIRM_PURCHASE' })
    expect(state.meterProgress).toBe(batch * 30)
    state = demoReducer(state, { type: 'COMPLETE_CHEST_OPENING' })
    expect(state.overlay).toBe(batch === 10 ? 'guarantee' : 'bounty')
  }
  expect(state.coins).toBe(300_000_000)
})
```

Also update all stale `10` and `12` threshold fixtures to `300`, starting balance assertions to `3_200_000_000`, and per-chest remaining balances to `3_194_800_000`, `3_184_000_000`, and `3_171_000_000`.

- [ ] **Step 2: Run the reducer suite and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts
```

Expected: FAIL because `defaultQuantity` and `getPurchasePreview` do not exist and thresholds remain 10/12.

- [ ] **Step 3: Implement the economy constants and quote selector**

In `demoData.ts`, define `BOUNTY_THRESHOLD` before `TARGETS`, use it for every target, and add defaults:

```ts
export const BOUNTY_THRESHOLD = 300

export type DemoChest = {
  id: ChestId
  name: string
  price: number
  cardsPerChest: number
  bountyProgress: number
  defaultQuantity: number
  accent: 'wood' | 'gold' | 'magic'
}

// Wooden and Golden:
defaultQuantity: 1,

// Magical:
defaultQuantity: 10,

export const STARTING_COINS = 3_200_000_000
```

In `demoReducer.ts`, add:

```ts
export type PurchasePreview = {
  chest: DemoChest
  quantity: number
  maxAffordable: number
  totalCards: number
  totalCost: number
  progressBefore: number
  progressGain: number
  progressAfter: number
  meterThreshold: number
  isAffordable: boolean
}

function clampPurchaseQuantity(chest: DemoChest, coins: number, requested: number) {
  const normalized = Math.max(1, Math.floor(requested))
  const maxAffordable = Math.floor(coins / chest.price)
  return maxAffordable > 0 ? Math.min(normalized, maxAffordable) : 1
}

export function getPurchasePreview(state: DemoState): PurchasePreview | null {
  const pending = state.pendingPurchase
  if (!pending) return null
  const chest = getChest(pending.chestId)
  if (!chest) return null

  const maxAffordable = Math.floor(state.coins / chest.price)
  const quantity = clampPurchaseQuantity(chest, state.coins, pending.quantity)
  const totalCost = chest.price * quantity
  const availableProgress = Math.max(0, state.meterThreshold - state.meterProgress)
  const progressGain = Math.min(availableProgress, chest.bountyProgress * quantity)

  return {
    chest,
    quantity,
    maxAffordable,
    totalCards: chest.cardsPerChest * quantity,
    totalCost,
    progressBefore: state.meterProgress,
    progressGain,
    progressAfter: state.meterProgress + progressGain,
    meterThreshold: state.meterThreshold,
    isAffordable: maxAffordable >= quantity,
  }
}
```

Change `OPEN_CHEST_DIALOG` to validate the chest and initialize its clamped default. Guard `SET_QUANTITY`, `CONFIRM_PURCHASE`, and `CANCEL_PURCHASE` with `state.overlay === 'chest-quantity'`. Make `CONFIRM_PURCHASE` consume `getPurchasePreview(state)` for cost and progress instead of recalculating them.

- [ ] **Step 4: Run reducer tests and type checking**

Run:

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts
npx.cmd tsc --noEmit --incremental false
```

Expected: reducer suite PASS; TypeScript exits 0.

- [ ] **Step 5: Commit Task 1 only**

```powershell
git add app/MA-HomeAssignment/demo/demoData.ts app/MA-HomeAssignment/demo/demoReducer.ts app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts
git commit -m "feat(card-bounty): scale the deterministic bounty economy"
```

### Task 2: Generate, optimize, and catalog the original art layer

**Files:**
- Create: `public/coinmaster/card-bounty/generated/**`
- Create: `scripts/optimize-card-bounty-assets.js`
- Create: `scripts/verify-card-bounty-assets.js`
- Create: `app/MA-HomeAssignment/demo/demoVisualData.ts`
- Test: `app/MA-HomeAssignment/demo/__tests__/demoVisualData.test.ts`

**Interfaces:**
- Produces: `DemoCollection`, `DEMO_COLLECTIONS`, `ReelSymbol`, and `REEL_GRID`.
- Runtime assets are WebP; generated text is forbidden.

- [ ] **Step 1: Write the failing visual-data contract test**

```ts
import fs from 'node:fs'
import path from 'node:path'
import { DEMO_COLLECTIONS, REEL_GRID, REQUIRED_VISUAL_ASSETS } from '../demoVisualData'

it('provides eight collections and nine deterministic reel cells', () => {
  expect(DEMO_COLLECTIONS).toHaveLength(8)
  expect(REEL_GRID).toHaveLength(9)
  expect(new Set(DEMO_COLLECTIONS.map((item) => item.id)).size).toBe(8)
})

it.each(REQUIRED_VISUAL_ASSETS)('ships %s', (asset) => {
  expect(fs.existsSync(path.join(process.cwd(), 'public', asset))).toBe(true)
})
```

- [ ] **Step 2: Run the visual-data test and verify RED**

Run:

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/demoVisualData.test.ts
```

Expected: FAIL because `demoVisualData.ts` and the generated assets do not exist.

- [ ] **Step 3: Generate the exact artwork set**

Before generation, read and follow the `imagegen` skill. Use the supplied screenshots only as visual references. Generate original subjects, no logos, no text, and no copied characters.

For each collection, use this exact base prompt with the subject line below:

```text
Square 1:1 polished 2.5D mobile social-casino game collection portrait, original character or object, centered circular composition, saturated cyan/gold/red palette, thick dark-brown outline, glossy highlights, friendly exaggerated shapes, premium game icon lighting, no words, no letters, no numbers, no ribbon, no frame. Isolate the art against a flat chroma-green background.
```

Subjects and final paths:

- Adventurous sailor riding a whimsical whale-shaped wooden boat -> `collections/sinbad.webp`
- Cheerful retro robot explorer on a colorful alien planet -> `collections/space-travel.webp`
- Friendly brass submarine and bright coral sea life -> `collections/ocean.webp`
- Playful orange pet wearing a tiny explorer scarf -> `collections/pets.webp`
- Jovial original Viking captain with a blue-and-gold helmet -> `collections/vikings.webp`
- Enchanted rose castle with a tiny friendly dragon -> `collections/fairy-tales.webp`
- Brass airship inventor with oversized goggles -> `collections/steampunk.webp`
- Cozy snow guardian beside a glowing winter lantern -> `collections/winter-wonders.webp`

Generate the remaining assets with these exact prompts:

```text
Card Bounty badge: compact original mobile-game event emblem, three blue-backed fantasy cards fanned behind a golden target reticle and tiny treasure sparkle, chunky polished 2.5D rendering, dark brown outline, no text, isolated on chroma green.

Open chest: original purple-and-magenta magical treasure chest, lid open, cyan glow pouring upward, playful face-like lock hardware, chunky polished mobile-game rendering, no text, isolated on chroma green.

Spin background: portrait snowy-sky mobile-game scene, bright cyan sky, soft white clouds and snow banks, subtle warm wooden platform near center, no characters, no buildings, no slot machine, no interface, no text.

Slot cabinet: front-facing chunky wooden three-by-three slot-machine cabinet with exactly nine large empty cream reel windows in a rigid grid, gold trim, snow-dusted top edge, polished 2.5D mobile-game rendering, no symbols, no text, isolated on chroma green.

Reel symbols: generate separate square icons for an original smiling pig thief, gold crown coin, blue energy hammer, gold-and-blue shield, cyan energy barrel, and purple treasure chest; one centered object per image, thick dark-brown outline, no text, isolated on chroma green.

Pet: cheerful original orange desert cat cub standing and looking upward, polished 2.5D mobile-game cutout, no text, isolated on chroma green.

Side events: separate compact original raid shield emblem and tournament crown emblem, polished mobile-game icons, no text, isolated on chroma green.
```

Inspect every result with `view_image`. Regenerate any asset with text, copied branding, malformed anatomy, or a cabinet without exactly nine aligned empty windows.

- [ ] **Step 4: Remove chroma and optimize runtime assets**

Before processing, copy every returned imagegen file to a deterministic filename under `$env:TEMP\card-bounty-imagegen`. For example, the badge source becomes `card-bounty-badge.png` and its alpha output becomes `card-bounty-badge-alpha.png`. Then use the imagegen chroma-removal script for cutouts:

```powershell
python.exe "C:\Users\hi\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py" --input "$env:TEMP\card-bounty-imagegen\card-bounty-badge.png" --out "$env:TEMP\card-bounty-imagegen\card-bounty-badge-alpha.png" --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

Create `scripts/optimize-card-bounty-assets.js` as an explicit Sharp CLI accepting `--input`, `--output`, `--width`, `--height`, `--fit`, and `--quality`. It must call `sharp(input).resize({ width, height, fit, withoutEnlargement: true }).webp({ quality, alphaQuality: 90, effort: 6 }).toFile(output)` and create the output directory first.

Optimize to:

- Collections: 512x512 opaque WebP.
- Event badge: max 256x256 alpha WebP.
- Open chest: max 768x768 alpha WebP.
- Background: about 1024x1536 opaque WebP.
- Cabinet: max 1024x1024 alpha WebP.
- Symbols: 192x192 alpha WebP.
- Pet/events: max 384x384 alpha WebP.

- [ ] **Step 5: Implement the visual data catalog**

Define:

```ts
export type DemoCollection = {
  id: string
  name: string
  progress: number
  image: string
  ribbonTone: 'red' | 'violet' | 'blue' | 'green'
  rewardLabel: string
}

export type ReelSymbol = {
  id: string
  label: string
  image: string
}

export const DEMO_COLLECTIONS: readonly DemoCollection[] = [
  { id: 'sinbad', name: 'Sinbad', progress: 8, image: '/coinmaster/card-bounty/generated/collections/sinbad.webp', ribbonTone: 'blue', rewardLabel: '2,500 Spins' },
  { id: 'space-travel', name: 'Space Travel', progress: 7, image: '/coinmaster/card-bounty/generated/collections/space-travel.webp', ribbonTone: 'violet', rewardLabel: '10,000 Spins' },
  { id: 'ocean', name: 'Ocean', progress: 6, image: '/coinmaster/card-bounty/generated/collections/ocean.webp', ribbonTone: 'blue', rewardLabel: '1,000 Spins' },
  { id: 'pets', name: 'Pets', progress: 9, image: '/coinmaster/card-bounty/generated/collections/pets.webp', ribbonTone: 'red', rewardLabel: 'Complete' },
  { id: 'vikings', name: 'Vikings', progress: 8, image: '/coinmaster/card-bounty/generated/collections/vikings.webp', ribbonTone: 'green', rewardLabel: '5,000 Spins' },
  { id: 'fairy-tales', name: 'Fairy Tales', progress: 7, image: '/coinmaster/card-bounty/generated/collections/fairy-tales.webp', ribbonTone: 'red', rewardLabel: '1,500 Spins' },
  { id: 'steampunk', name: 'Steampunk', progress: 5, image: '/coinmaster/card-bounty/generated/collections/steampunk.webp', ribbonTone: 'violet', rewardLabel: '4,000 Spins' },
  { id: 'winter-wonders', name: 'Winter Wonders', progress: 3, image: '/coinmaster/card-bounty/generated/collections/winter-wonders.webp', ribbonTone: 'blue', rewardLabel: '7,500 Spins' },
]

const SYMBOLS = {
  energy: { id: 'energy', label: 'Energy barrel', image: '/coinmaster/card-bounty/generated/spin/symbol-energy.webp' },
  coin: { id: 'coin', label: 'Crown coin', image: '/coinmaster/card-bounty/generated/spin/symbol-coin.webp' },
  hammer: { id: 'hammer', label: 'Energy hammer', image: '/coinmaster/card-bounty/generated/spin/symbol-hammer.webp' },
  pig: { id: 'pig', label: 'Pig thief', image: '/coinmaster/card-bounty/generated/spin/symbol-pig.webp' },
} satisfies Record<string, ReelSymbol>

export const REEL_GRID = [
  SYMBOLS.energy,
  SYMBOLS.coin,
  SYMBOLS.energy,
  SYMBOLS.hammer,
  SYMBOLS.coin,
  SYMBOLS.coin,
  SYMBOLS.coin,
  SYMBOLS.pig,
  SYMBOLS.pig,
] as const

export const REQUIRED_VISUAL_ASSETS = [
  ...DEMO_COLLECTIONS.map((item) => item.image.slice(1)),
  'coinmaster/card-bounty/generated/card-bounty-badge.webp',
  'coinmaster/card-bounty/generated/magical-chest-open.webp',
  'coinmaster/card-bounty/generated/spin/snowy-background.webp',
  'coinmaster/card-bounty/generated/spin/slot-cabinet.webp',
  'coinmaster/card-bounty/generated/spin/symbol-pig.webp',
  'coinmaster/card-bounty/generated/spin/symbol-coin.webp',
  'coinmaster/card-bounty/generated/spin/symbol-hammer.webp',
  'coinmaster/card-bounty/generated/spin/symbol-shield.webp',
  'coinmaster/card-bounty/generated/spin/symbol-energy.webp',
  'coinmaster/card-bounty/generated/spin/symbol-chest.webp',
  'coinmaster/card-bounty/generated/spin/pet.webp',
  'coinmaster/card-bounty/generated/spin/event-raid.webp',
  'coinmaster/card-bounty/generated/spin/event-tournament.webp',
] as const
```

The six generated symbol assets all ship for visual variety; the deterministic nine-cell prototype uses energy, coin, hammer, and pig in the exact order above.

- [ ] **Step 6: Verify assets and visual data**

Create `scripts/verify-card-bounty-assets.js` with the required file list, Sharp metadata checks, alpha expectations, maximum dimensions, and a 2.5MB total generated-folder budget. Run:

```powershell
node.exe scripts/verify-card-bounty-assets.js
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/demoVisualData.test.ts
```

Expected: verification exits 0 and test PASS.

- [ ] **Step 7: Commit Task 2 only**

```powershell
git add app/MA-HomeAssignment/demo/demoVisualData.ts app/MA-HomeAssignment/demo/__tests__/demoVisualData.test.ts scripts/optimize-card-bounty-assets.js scripts/verify-card-bounty-assets.js public/coinmaster/card-bounty/generated
git commit -m "feat(card-bounty): add generated game artwork"
```

### Task 3: Build the Ribbon dialog and 300-point meter primitives

**Files:**
- Create: `app/MA-HomeAssignment/demo/RibbonDialog.tsx`
- Create: `app/MA-HomeAssignment/demo/RibbonDialog.module.css`
- Create: `app/MA-HomeAssignment/demo/BountyMeter.tsx`
- Create: `app/MA-HomeAssignment/demo/BountyMeter.module.css`
- Test: `app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx`

**Interfaces:**
- Produces: `RibbonFrame` for a non-semantic visible underlay.
- Produces: `RibbonDialog` with `compact | tall | purchase` sizing.
- Produces: reusable named `BountyMeter` progressbar.

- [ ] **Step 1: Write failing primitive tests**

```tsx
render(
  <RibbonDialog title="Card Bounty" onClose={onClose}>
    <button type="button">First</button>
    <button type="button">Last</button>
  </RibbonDialog>,
)
expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toBeInTheDocument()
fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
expect(onClose).toHaveBeenCalledTimes(1)

render(<BountyMeter label="Bounty progress" progress={30} threshold={300} />)
expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute('aria-valuenow', '30')
expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '300')
expect(screen.getAllByTestId('bounty-milestone')).toHaveLength(9)
```

Also test Tab and Shift+Tab wrap, focus restoration on unmount, and `RibbonFrame` renders no dialog role.

- [ ] **Step 2: Run primitive tests and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx
```

Expected: FAIL because both modules are missing.

- [ ] **Step 3: Implement `RibbonFrame` and `RibbonDialog`**

Use these contracts:

```tsx
export type RibbonDialogSize = 'compact' | 'tall' | 'purchase'

export type RibbonFrameProps = {
  title: string
  size?: RibbonDialogSize
  hero?: ReactNode
  closeControl?: ReactNode
  children: ReactNode
  className?: string
}

export type RibbonDialogProps = Omit<RibbonFrameProps, 'closeControl'> & {
  onClose: () => void
  closeLabel?: string
}
```

`RibbonDialog` owns the scrim, `role="dialog"`, `aria-modal`, generated title id, Escape behavior, Tab containment, and close button. Capture the previously focused element in a mount-only effect and restore it only on unmount. Do not put the inline `onClose` callback in the restoration effect dependency list because the one-second countdown causes rerenders.

`RibbonFrame` owns only the visible parchment, ribbon, hero slot, body scroll region, and optional close control. Its overflow remains visible while the body itself scrolls.

- [ ] **Step 4: Implement the shared meter**

```tsx
export type BountyMeterProps = {
  label: string
  progress: number
  threshold: number
  targetImage?: string
  variant?: 'standard' | 'compact'
}
```

Clamp fill to 0-100%, expose `aria-valuetext="30 of 300 Bounty progress"`, and render exactly nine internal milestone marks at 10%-90%. The target endpoint represents 300; never create `threshold - 1` DOM nodes.

- [ ] **Step 5: Add reference geometry**

In `RibbonDialog.module.css`:

- Scrim: `rgba(13, 6, 3, .7)`, no `backdrop-filter`.
- Frame width: compact 88%, tall/purchase 92%.
- Max heights: compact 72dvh, tall 84dvh, purchase 68dvh.
- Parchment: warm peach gradient, 3-4px brown outline, inner cream highlight, heavy lower shadow.
- Ribbon: red, overlaps top edge, dark red folds, white chunky title with brown shadow.
- Close: 48px red circle overlapping top-right.
- Purchase hero: absolute, centered, protruding above ribbon.

Add `prefers-reduced-motion` rules that disable sustained pulse and arrival animations.

- [ ] **Step 6: Run tests and commit**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx
git add app/MA-HomeAssignment/demo/RibbonDialog.tsx app/MA-HomeAssignment/demo/RibbonDialog.module.css app/MA-HomeAssignment/demo/BountyMeter.tsx app/MA-HomeAssignment/demo/BountyMeter.module.css app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx
git commit -m "feat(card-bounty): add Coin Master dialog primitives"
```

### Task 4: Rebuild Cards Center

**Files:**
- Create: `app/MA-HomeAssignment/demo/CollectionMedallion.tsx`
- Create: `app/MA-HomeAssignment/demo/CardsCenterScreen.module.css`
- Modify: `app/MA-HomeAssignment/demo/CardsCenterScreen.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx`

**Interfaces:**
- Consumes: `DEMO_COLLECTIONS`.
- Produces: one accessible `Open Card Bounty` button and a list of eight medallions.
- New screen props: `{ countdown: number; onOpenBounty: () => void }`.

- [ ] **Step 1: Write the failing Cards Center contract**

```tsx
render(<CardsCenterScreen countdown={85_272} onOpenBounty={onOpenBounty} />)

expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
const list = screen.getByRole('list', { name: 'Card collections' })
expect(within(list).getAllByRole('listitem')).toHaveLength(8)
expect(screen.getAllByRole('button', { name: 'Open Card Bounty' })).toHaveLength(1)
expect(screen.queryByLabelText(/Coins/i)).not.toBeInTheDocument()
expect(screen.getByRole('navigation', { name: 'Cards Center views' })).toBeInTheDocument()
```

- [ ] **Step 2: Run and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx
```

Expected: FAIL because the current component still requires Coins/Spins and renders only four rectangular tiles.

- [ ] **Step 3: Implement the collection screen**

Use this fixed internal hierarchy:

```tsx
<div className={styles.screen}>
  <header className={styles.header}>
    <span className={styles.info} aria-hidden="true">i</span>
    <h1>Cards Center</h1>
    <a href="/MA-HomeAssignment#prototype" aria-label="Close Cards Center">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" /></svg>
    </a>
  </header>
  <div className={styles.scrollBody}>
    <button type="button" aria-label="Open Card Bounty" onClick={onOpenBounty}>
      <img src="/coinmaster/card-bounty/generated/card-bounty-badge.webp" alt="" />
      <time>{formatCountdown(countdown)}</time>
    </button>
    <ul aria-label="Card collections">
      {DEMO_COLLECTIONS.map((collection) => (
        <CollectionMedallion key={collection.id} collection={collection} />
      ))}
    </ul>
  </div>
  <nav aria-label="Cards Center views">
    <span aria-current="page"><CardBack /><b>Sets</b></span>
    <span><CardBack /><b>Albums</b></span>
  </nav>
</div>
```

`CollectionMedallion` renders a list item, circular image, colored ribbon, green progress capsule, `progress/9`, and reward label. Decorative images use empty alt text; the list item receives an accessible label containing name and progress.

- [ ] **Step 4: Match the reference composition**

In `CardsCenterScreen.module.css`:

- Use a three-row grid: 118px header, scrolling body, 86px tabs.
- Use saturated teal patterned body without dashboard cards.
- Render two equal medallion columns with 14-18px gaps.
- Let medallions occupy about 42% of stage width.
- Place the compact Bounty badge near the left edge of the scroll body.
- Make header/tab positioning stage-local, never browser `position: fixed`.
- Keep the title oversized, white, compact, and heavily shadowed.
- Use warm beige tabs with the Sets ribbon crossing the upper edge.

- [ ] **Step 5: Run tests and commit**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx
git add app/MA-HomeAssignment/demo/CollectionMedallion.tsx app/MA-HomeAssignment/demo/CardsCenterScreen.tsx app/MA-HomeAssignment/demo/CardsCenterScreen.module.css app/MA-HomeAssignment/demo/__tests__/CardsCenterScreen.test.tsx
git commit -m "feat(card-bounty): rebuild Cards Center"
```

### Task 5: Recompose Card Bounty into compact shared dialogs

**Files:**
- Create: `app/MA-HomeAssignment/demo/BountyPanels.module.css`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPanel.tsx`
- Modify: `app/MA-HomeAssignment/demo/TargetPicker.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.module.css`
- Test: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

**Interfaces:**
- Consumes: `RibbonDialog`, `RibbonFrame`, and `BountyMeter`.
- Panels become content-only and no longer emit `role="dialog"`.
- Preserves all existing reducer action wiring.

- [ ] **Step 1: Add failing compact-dialog and single-dialog assertions**

After opening and confirming a target:

```tsx
expect(screen.getAllByRole('dialog')).toHaveLength(1)
expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toHaveAttribute('data-size', 'tall')
expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute('aria-valuemax', '300')
expect(screen.getByText('0/300')).toBeInTheDocument()
```

After opening Magical purchase:

```tsx
expect(screen.getAllByRole('dialog')).toHaveLength(1)
expect(screen.getByRole('dialog', { name: 'Magical Chest' })).toBeInTheDocument()
expect(screen.getByTestId('active-bounty-underlay')).toHaveAttribute('aria-hidden', 'true')
```

- [ ] **Step 2: Run the integration suite and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
```

Expected: FAIL because existing panels occupy nearly the full stage and each owns its dialog semantics.

- [ ] **Step 3: Convert panels to content-only components**

Remove `PanelHeader` and all outer `bountyPanel` wrappers. Keep these contracts:

```ts
IntroPanel({ countdown, onChoose })
TargetPicker({ countdown, onSelect })
TargetConfirmation({ target, countdown, onBack, onSelect })
ActiveBountyPanel({ state, target, onChange, onChest })
```

Use `BountyMeter` in Active Bounty. Show the selected target compactly, render the 300-point value, and keep all three chest offers visible inside the tall dialog's scrolling body.

- [ ] **Step 4: Make `CardBountyPrototype` the only dialog coordinator**

Remove `.gameDimmer` and the dialog-shaped duplicate underlay. Map each ordinary overlay to one stable `RibbonDialog`:

- intro -> title Card Bounty, compact
- target-picker -> Choose a Card, tall
- target-confirmation -> Confirm Target, compact
- bounty -> Card Bounty, tall
- chest-quantity -> selected chest name, purchase

For `chest-quantity`, render one non-semantic `RibbonFrame` beneath the top scrim:

```tsx
<div
  className={styles.purchaseUnderlay}
  data-testid="active-bounty-underlay"
  aria-hidden="true"
  inert={inertAttribute}
>
  <RibbonFrame title="Card Bounty" size="tall">
    <ActiveBountyPanel
      state={state}
      target={target}
      onChange={() => dispatch({ type: 'OPEN_TARGET_PICKER' })}
      onChest={(chestId) => dispatch({ type: 'OPEN_CHEST_DIALOG', chestId })}
    />
  </RibbonFrame>
</div>
```

Then render the purchase `RibbonDialog` above it. Only the top shell has dialog semantics. Change guidance copy to `Buy 10 Magical Chests per batch`. Remove the stale quantity-three path.

- [ ] **Step 5: Move screen-specific CSS**

Keep `CardBountyPrototype.module.css` responsible only for demo shell, viewport, base/inert layers, purchase underlay positioning, shared small primitives, and full-screen reward states. Move all Cards Center, panel, purchase, and village rules into their focused modules; delete migrated selectors rather than retaining conflicting duplicates.

- [ ] **Step 6: Run integration and primitive tests**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/RibbonDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/BountyMeter.test.tsx app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
npx.cmd tsc --noEmit --incremental false
```

Expected: PASS.

- [ ] **Step 7: Commit Task 5 only**

```powershell
git add app/MA-HomeAssignment/demo/CardBountyPanel.tsx app/MA-HomeAssignment/demo/TargetPicker.tsx app/MA-HomeAssignment/demo/CardBountyPrototype.tsx app/MA-HomeAssignment/demo/CardBountyPrototype.module.css app/MA-HomeAssignment/demo/BountyPanels.module.css app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
git commit -m "feat(card-bounty): use compact ribbon dialogs"
```

### Task 6: Rebuild Magical Chest purchase around the live quote

**Files:**
- Create: `app/MA-HomeAssignment/demo/ChestPurchaseDialog.module.css`
- Modify: `app/MA-HomeAssignment/demo/ChestPurchaseDialog.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

**Interfaces:**
- Consumes: `PurchasePreview` and `BountyMeter`.
- New props:

```ts
{
  preview: PurchasePreview
  purchaseError: string | null
  onQuantity: (quantity: number) => void
  onConfirm: () => void
}
```

- [ ] **Step 1: Write failing projection tests**

```tsx
expect(screen.getByLabelText('Chest quantity')).toHaveTextContent('10')
expect(screen.getByText('80 total Cards')).toBeInTheDocument()
expect(screen.getByText('290,000,000')).toBeInTheDocument()
expect(screen.getByText('+30')).toBeInTheDocument()
expect(screen.getByRole('progressbar', { name: 'Current Bounty progress' })).toHaveAttribute('aria-valuenow', '0')
expect(screen.getByRole('progressbar', { name: 'Projected Bounty progress' })).toHaveAttribute('aria-valuenow', '30')

fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
expect(screen.getByLabelText('Chest quantity')).toHaveTextContent('11')
expect(screen.getByText('88 total Cards')).toBeInTheDocument()
expect(screen.getByText('319,000,000')).toBeInTheDocument()
expect(screen.getByText('+33')).toBeInTheDocument()
```

Also test minimum/maximum buttons are disabled instead of wrapping and that the error uses `role="alert"`.

- [ ] **Step 2: Run purchase tests and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx
```

Expected: FAIL because the current dialog calculates locally, starts at one, and wraps boundary controls.

- [ ] **Step 3: Implement quote-driven content**

Render:

- Open generated chest as the `RibbonDialog` hero with empty alt text.
- Cream `High chance for` row and rarity icons.
- `Cards x8` source value plus `80 total Cards` batch value.
- Vertical green triangular quantity controls.
- Current and projected compact `BountyMeter` instances.
- Exact `+progressGain` and total cost.
- Glossy green confirm button with `aria-label="Confirm Chest purchase"`.

The component performs no cost/progress arithmetic. Increment calls `onQuantity(preview.quantity + 1)` and disables at `maxAffordable`. Decrement calls `onQuantity(preview.quantity - 1)` and disables at one.

- [ ] **Step 4: Wire the selector once**

In `CardBountyPrototype`:

```ts
const purchasePreview = getPurchasePreview(state)
```

Pass that same object to `ChestPurchaseDialog`. Do not derive a second UI quote. The reducer confirmation must continue consuming the same selector.

- [ ] **Step 5: Run purchase, reducer, and integration tests**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit Task 6 only**

```powershell
git add app/MA-HomeAssignment/demo/ChestPurchaseDialog.tsx app/MA-HomeAssignment/demo/ChestPurchaseDialog.module.css app/MA-HomeAssignment/demo/CardBountyPrototype.tsx app/MA-HomeAssignment/demo/__tests__/ChestPurchaseDialog.test.tsx app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
git commit -m "feat(card-bounty): show live batch purchase projection"
```

### Task 7: Replace the village with the live slot-machine core loop

**Files:**
- Create: `app/MA-HomeAssignment/demo/SlotMachineBoard.tsx`
- Create: `app/MA-HomeAssignment/demo/SlotMachineBoard.module.css`
- Create: `app/MA-HomeAssignment/demo/SpinReturnScreen.module.css`
- Modify: `app/MA-HomeAssignment/demo/SpinReturnScreen.tsx`
- Test: `app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx`

**Interfaces:**
- Consumes: `REEL_GRID` and generated Spin assets.
- Preserves `SpinReturnScreen({ coins, spins, reward, targetName })`.
- Produces `SlotMachineBoard({ symbols, spinCycle })`.

- [ ] **Step 1: Write the failing deterministic-reel test**

```tsx
render(<SpinReturnScreen coins={300_000_000} spins={4_350} reward={2_500} targetName="Whale Boat" />)
const reels = screen.getByRole('region', { name: 'Slot machine reels' })
const before = within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))
expect(before).toHaveLength(9)

const spin = screen.getByRole('button', { name: 'Spin' })
expect(spin).toHaveAttribute('aria-pressed', 'false')
fireEvent.click(spin)
expect(spin).toHaveAttribute('aria-pressed', 'true')
expect(screen.getByText('Core loop ready')).toBeInTheDocument()
expect(within(reels).getAllByRole('img').map((node) => node.getAttribute('alt'))).toEqual(before)
```

- [ ] **Step 2: Run and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx
```

Expected: FAIL because no Slot machine reels region exists.

- [ ] **Step 3: Implement `SlotMachineBoard`**

```ts
export function SlotMachineBoard({
  symbols,
  spinCycle,
}: {
  symbols: readonly ReelSymbol[]
  spinCycle: number
})
```

Render the cabinet as decorative art and overlay a rigid three-column grid containing exactly nine live `img` elements with useful symbol alt labels. Key only the grid by `spinCycle` so a deterministic CSS reel motion retriggers without changing the symbol order.

- [ ] **Step 4: Recompose `SpinReturnScreen`**

Use local `spinReady` and integer `spinCycle`. Clicking Spin sets readiness and increments the cycle. Render:

- Coin, gem, and Spin/energy top capsules plus menu.
- Compact player plaque and side event icons.
- Dominant `SlotMachineBoard`.
- Booster strip, 80/80 energy bar, and Spin balance.
- Large red trapezoidal Spin button in the lower third.
- Small reward status that does not displace the cabinet.

Remove village art, village plaque, yellow Spin button, and bottom navigation.

- [ ] **Step 5: Add motion and responsive rules**

The cabinet occupies roughly 56-61% of portrait height. Reel animation lasts under 600ms. `prefers-reduced-motion: reduce` disables reel transforms and Spin pulsing. Desktop retains the same portrait composition.

- [ ] **Step 6: Run tests and commit**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx
npx.cmd tsc --noEmit --incremental false
git add app/MA-HomeAssignment/demo/SlotMachineBoard.tsx app/MA-HomeAssignment/demo/SlotMachineBoard.module.css app/MA-HomeAssignment/demo/SpinReturnScreen.tsx app/MA-HomeAssignment/demo/SpinReturnScreen.module.css app/MA-HomeAssignment/demo/__tests__/SpinReturnScreen.test.tsx
git commit -m "feat(card-bounty): rebuild the Spin core loop"
```

### Task 8: Prove the ten-batch flow and polish reward transitions

**Files:**
- Modify: `app/MA-HomeAssignment/demo/RewardSequence.tsx`
- Modify: `app/MA-HomeAssignment/demo/CardBountyPrototype.tsx`
- Modify: `app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx`

**Interfaces:**
- Preserves deterministic three-featured-card reveal for an 80-card batch.
- Preserves guarantee, collection reward, and Spin-return actions.

- [ ] **Step 1: Replace the short happy-path test with the approved ten-batch path**

```tsx
for (let batch = 1; batch <= 10; batch += 1) {
  fireEvent.click(screen.getByRole('button', { name: /Buy Magical Chest/ }))
  expect(screen.getByText('80 total Cards')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
  expect(screen.getByText(/10 Chests.*80 Cards.*3 shown/)).toBeInTheDocument()
  expect(screen.getAllByText('Duplicate')).toHaveLength(3)
  expect(screen.getByText('+30 Bounty progress')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

  if (batch < 10) {
    expect(screen.getByText(String(batch * 30) + '/300')).toBeInTheDocument()
  }
}
```

Then assert guarantee, Whale Boat collection completion, 300,000,000 remaining Coins, 4,350 Spins, the slot board, Spin readiness, and restart. Keep the alternative-target test but update its threshold to 300 and complete it through ten batches without awarding its collection reward.

- [ ] **Step 2: Run and verify RED**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
```

Expected: FAIL until all preceding UI copy and reward summaries are integrated.

- [ ] **Step 3: Polish reward summaries without expanding the reward simulation**

For Magical purchases, use `magical-chest-open.webp` in `ChestOpening`. Preserve:

```ts
const totalCards = chest.cardsPerChest * quantity
const revealedCards = DUPLICATE_REVEALS.slice(0, totalCards)
```

Display the exact summary `10 Chests · 80 Cards · 3 shown` and `+30 Bounty progress`. Do not render 80 card nodes or add random outcomes.

- [ ] **Step 4: Run all scoped suites**

```powershell
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__
npx.cmd tsc --noEmit --incremental false
```

Expected: all Card Bounty suites PASS and TypeScript exits 0.

- [ ] **Step 5: Commit Task 8 only**

```powershell
git add app/MA-HomeAssignment/demo/RewardSequence.tsx app/MA-HomeAssignment/demo/CardBountyPrototype.tsx app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx
git commit -m "test(card-bounty): cover the full 300-point loop"
```

### Task 9: Responsive browser QA, poster refresh, and final verification

**Files:**
- Modify: `app/MA-HomeAssignment/demo/page.tsx`
- Modify: `app/MA-HomeAssignment/sections/PrototypePreview.tsx`
- Modify: `app/MA-HomeAssignment/sections/useCaseData.ts`
- Modify: `__tests__/ma-homeassignment.test.tsx`
- Create: `public/coinmaster/card-bounty-preview.webp`
- Create: `public/coinmaster/card-bounty-preview.jpg`

**Interfaces:**
- Produces a 430x932 live prototype and 860x1864 DPR-2 poster.
- Leaves `public/coinmaster/feature2.png` untouched even after references move, preserving existing user work.

- [ ] **Step 1: Add viewport-safe metadata and failing poster assertions**

In `page.tsx`:

```ts
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}
```

Update `ma-homeassignment.test.tsx` to expect `/coinmaster/card-bounty-preview.webp`. Run the test before creating the asset and expect the old feature2 assertion to fail.

- [ ] **Step 2: Start the local app and inspect all required states**

Run:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Use the in-app browser skill at 390x844, 430x932, 1366x768, and 1440x900. At every size inspect:

1. Cards Center.
2. Active Bounty at 0/300.
3. Magical Chest quantity 10 showing 80 Cards, 290,000,000 Coins, and +30.
4. Chest reward summary.
5. Spin return.

Verify no horizontal overflow; stage-local fixed header/tabs; visible context around dialogs; clean chest/ribbon protrusions; one exposed dialog; keyboard focus trapping/restoration; reduced-motion behavior; and slot cabinet dominance.

- [ ] **Step 3: Iterate visual defects**

Compare with all six user references. Correct scale, spacing, overlap, color, shadow depth, title size, and scroll boundaries in the owning CSS module. Repeat the four-viewport inspection after every material CSS adjustment.

- [ ] **Step 4: Capture and integrate the assignment poster**

At 430x932 and DPR 2, capture Active Bounty immediately after confirming Whale Boat, visibly showing 0/300, selected target, and all chest offers. Optimize the same 860x1864 capture to:

- `public/coinmaster/card-bounty-preview.webp` at WebP quality 84.
- `public/coinmaster/card-bounty-preview.jpg` at JPEG quality 88.

Update `PrototypePreview.tsx` and `USE_CASE_2.mockup` to the WebP. Update `OG_IMAGE` in `demo/page.tsx` to the JPEG with width 860 and height 1864. Do not delete or overwrite `feature2.png`.

- [ ] **Step 5: Run final verification**

```powershell
node.exe scripts/verify-card-bounty-assets.js
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/demoReducer.test.ts
npm.cmd test -- --runInBand app/MA-HomeAssignment/demo/__tests__/CardBountyPrototype.test.tsx __tests__/ma-homeassignment.test.tsx
npx.cmd tsc --noEmit --incremental false
npm.cmd test -- --runInBand
npx.cmd next build
git status --short
```

Expected:

- Asset verifier exits 0.
- Scoped tests pass.
- TypeScript exits 0.
- Production build succeeds.
- Any full-suite failures are either fixed when caused by this work or explicitly reported as pre-existing and unrelated.
- Git status contains no accidental edits to `scripts/.optimize-manifest.json` from this task.

- [ ] **Step 6: Commit the integration and poster only**

```powershell
git add app/MA-HomeAssignment/demo/page.tsx app/MA-HomeAssignment/sections/PrototypePreview.tsx app/MA-HomeAssignment/sections/useCaseData.ts __tests__/ma-homeassignment.test.tsx public/coinmaster/card-bounty-preview.webp public/coinmaster/card-bounty-preview.jpg
git commit -m "feat(card-bounty): integrate the redesigned prototype preview"
```

## Execution Choice

The user requested end-to-end execution without stopping for non-product decisions. Use the recommended `superpowers:subagent-driven-development` path automatically:

1. Dispatch a fresh implementer per task.
2. Run specification-compliance review.
3. Run code-quality review.
4. Apply review corrections before moving to the next task.
5. Keep asset generation and visual QA under the root agent's direct inspection.
