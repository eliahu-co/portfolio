import type { ChestId } from '../demoData'
import { demoReducer, getPurchasePreview, initialDemoState } from '../demoReducer'

function chooseWhaleBoat() {
  return demoReducer(initialDemoState, { type: 'SELECT_TARGET', targetId: 'whale-boat' })
}

function openChest(chestId: ChestId, quantity?: number, start = chooseWhaleBoat()) {
  let state = demoReducer(start, { type: 'CONFIRM_TARGET' })
  state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId })
  if (quantity !== undefined) {
    state = demoReducer(state, { type: 'SET_QUANTITY', quantity })
  }
  return demoReducer(state, { type: 'CONFIRM_PURCHASE' })
}

describe('Card Bounty demo reducer', () => {
  it('starts at the Cards Center with the representative balance', () => {
    expect(initialDemoState).toMatchObject({
      baseScreen: 'cards-center',
      overlay: null,
      selectedTargetId: null,
      coins: 3_200_000_000,
      spins: 1_850,
      meterProgress: 0,
      meterThreshold: 300,
      targetConfirmed: false,
      targetLocked: false,
      eventCompleted: false,
    })
  })

  it('selecting a target resets progress and opens confirmation', () => {
    const state = demoReducer(
      { ...initialDemoState, selectedTargetId: 'bionica', meterProgress: 7 },
      { type: 'SELECT_TARGET', targetId: 'whale-boat' },
    )

    expect(state.selectedTargetId).toBe('whale-boat')
    expect(state.meterProgress).toBe(0)
    expect(state.meterThreshold).toBe(300)
    expect(state.targetConfirmed).toBe(false)
    expect(state.overlay).toBe('target-confirmation')
  })

  it('uses the configured rarity threshold for each target', () => {
    const fiveStar = demoReducer(initialDemoState, { type: 'SELECT_TARGET', targetId: 'bionica' })
    const fourStar = demoReducer(fiveStar, { type: 'SELECT_TARGET', targetId: 'whale-boat' })

    expect(fiveStar.meterThreshold).toBe(300)
    expect(fourStar.meterThreshold).toBe(300)
  })

  it('does not activate an unconfirmed target after closing and reopening', () => {
    const selected = demoReducer(initialDemoState, { type: 'SELECT_TARGET', targetId: 'whale-boat' })
    const closed = demoReducer(selected, { type: 'CLOSE_BOUNTY' })
    const reopened = demoReducer(closed, { type: 'OPEN_BOUNTY' })
    const purchaseAttempt = demoReducer(reopened, { type: 'OPEN_CHEST_DIALOG', chestId: 'wooden' })

    expect(reopened.overlay).toBe('target-confirmation')
    expect(reopened.targetConfirmed).toBe(false)
    expect(purchaseAttempt).toBe(reopened)
  })

  it('allows changing the target before the first contributing purchase', () => {
    const selected = demoReducer(initialDemoState, { type: 'SELECT_TARGET', targetId: 'bionica' })
    const picker = demoReducer(selected, { type: 'OPEN_TARGET_PICKER' })
    const changed = demoReducer(picker, { type: 'SELECT_TARGET', targetId: 'nautilus' })

    expect(changed.selectedTargetId).toBe('nautilus')
    expect(changed.targetLocked).toBe(false)
    expect(changed.meterProgress).toBe(0)
  })

  it('locks the target after the first confirmed purchase', () => {
    const purchased = openChest('wooden')
    const pickerAttempt = demoReducer(purchased, { type: 'OPEN_TARGET_PICKER' })
    const selectionAttempt = demoReducer(pickerAttempt, { type: 'SELECT_TARGET', targetId: 'bionica' })

    expect(purchased.targetLocked).toBe(true)
    expect(pickerAttempt).toBe(purchased)
    expect(selectionAttempt.selectedTargetId).toBe('whale-boat')
  })

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

  it.each([
    ['wooden', 1],
    ['golden', 2],
    ['magical', 3],
  ] as const)('adds the configured %s Chest progress', (chestId, expected) => {
    expect(openChest(chestId, 1).meterProgress).toBe(expected)
  })

  it('multiplies progress and Coin cost by quantity', () => {
    const state = openChest('magical', 3)

    expect(state.meterProgress).toBe(9)
    expect(state.coins).toBe(3_113_000_000)
    expect(state.lastProgressEarned).toBe(9)
  })

  it.each([
    ['wooden', 3_194_800_000],
    ['golden', 3_184_000_000],
    ['magical', 3_171_000_000],
  ] as const)('deducts the configured %s Chest price', (chestId, expectedCoins) => {
    expect(openChest(chestId, 1).coins).toBe(expectedCoins)
  })

  it('rejects unaffordable quantities without changing the balance', () => {
    const start = { ...chooseWhaleBoat(), coins: 28_999_999 }
    const state = openChest('magical', 1, start)

    expect(state.coins).toBe(28_999_999)
    expect(state.meterProgress).toBe(0)
    expect(state.overlay).toBe('chest-quantity')
    expect(state.purchaseError).toBe('Not enough Coins')
  })

  it('caps progress at the Bounty threshold', () => {
    let state = { ...chooseWhaleBoat(), meterProgress: 299 }
    state = demoReducer(state, { type: 'CONFIRM_TARGET' })
    state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId: 'magical' })
    state = demoReducer(state, { type: 'SET_QUANTITY', quantity: 2 })
    state = demoReducer(state, { type: 'CONFIRM_PURCHASE' })

    expect(state.meterProgress).toBe(300)
    expect(state.lastProgressEarned).toBe(1)
  })

  it('opens the guarantee after the threshold purchase reveal completes', () => {
    const purchased = openChest('magical', 100)
    const revealed = demoReducer(purchased, { type: 'COMPLETE_CHEST_OPENING' })

    expect(purchased.overlay).toBe('chest-opening')
    expect(revealed.overlay).toBe('guarantee')
  })

  it('claims the Card, adds the Collection reward, and returns to Spins', () => {
    const threshold = { ...chooseWhaleBoat(), meterProgress: 300, targetConfirmed: true, targetLocked: true, overlay: 'guarantee' as const }
    const claimed = demoReducer(threshold, { type: 'CLAIM_GUARANTEE' })
    const collected = demoReducer(claimed, { type: 'COLLECT_REWARD' })

    expect(claimed).toMatchObject({ overlay: 'collection-complete', eventCompleted: true })
    expect(collected).toMatchObject({
      baseScreen: 'spin-return',
      overlay: null,
      spins: 4_350,
      collectionReward: 2_500,
    })
  })

  it('adds an alternative target without falsely completing its Collection', () => {
    let threshold = demoReducer(initialDemoState, { type: 'SELECT_TARGET', targetId: 'bionica' })
    threshold = { ...threshold, meterProgress: 300, targetConfirmed: true, targetLocked: true, overlay: 'guarantee' }
    const claimed = demoReducer(threshold, { type: 'CLAIM_GUARANTEE' })
    const rewardAttempt = demoReducer(claimed, { type: 'COLLECT_REWARD' })
    const returned = demoReducer(claimed, { type: 'RETURN_TO_SPIN' })

    expect(claimed).toMatchObject({ overlay: 'collection-complete', eventCompleted: true })
    expect(rewardAttempt).toBe(claimed)
    expect(returned).toMatchObject({
      baseScreen: 'spin-return',
      overlay: null,
      spins: 1_850,
      collectionReward: 0,
    })
  })

  it('preserves active progress when Card Bounty is closed and reopened', () => {
    const active = openChest('golden', 2)
    const returned = demoReducer(active, { type: 'COMPLETE_CHEST_OPENING' })
    const closed = demoReducer(returned, { type: 'CLOSE_BOUNTY' })
    const reopened = demoReducer(closed, { type: 'OPEN_BOUNTY' })

    expect(reopened.meterProgress).toBe(4)
    expect(reopened.overlay).toBe('bounty')
  })

  it('never lets the countdown become negative', () => {
    const state = demoReducer(
      { ...initialDemoState, eventSecondsRemaining: 2 },
      { type: 'TICK', seconds: 5 },
    )

    expect(state.eventSecondsRemaining).toBe(0)
  })

  it('does not create new state after the countdown becomes terminal', () => {
    const expired = { ...initialDemoState, eventSecondsRemaining: 0 }
    const completed = { ...initialDemoState, eventCompleted: true }

    expect(demoReducer(expired, { type: 'TICK' })).toBe(expired)
    expect(demoReducer(completed, { type: 'TICK' })).toBe(completed)
  })

  it('expires incomplete progress and prevents reopening when the event ends', () => {
    const active = { ...openChest('golden', 2), overlay: 'bounty' as const, eventSecondsRemaining: 1 }
    const expired = demoReducer(active, { type: 'TICK' })
    const reopened = demoReducer(expired, { type: 'OPEN_BOUNTY' })

    expect(expired).toMatchObject({
      eventSecondsRemaining: 0,
      selectedTargetId: null,
      meterProgress: 0,
      targetLocked: false,
      overlay: null,
    })
    expect(reopened).toBe(expired)
  })

  it('preserves an earned guarantee when time expires during its reward sequence', () => {
    const purchased = {
      ...openChest('magical', 100),
      eventSecondsRemaining: 1,
    }
    const expiredDuringOpening = demoReducer(purchased, { type: 'TICK' })
    const guarantee = demoReducer(expiredDuringOpening, { type: 'COMPLETE_CHEST_OPENING' })
    const expiredDuringGuarantee = demoReducer(guarantee, { type: 'TICK' })

    expect(expiredDuringOpening).toMatchObject({
      eventSecondsRemaining: 0,
      selectedTargetId: 'whale-boat',
      meterProgress: 300,
      targetLocked: true,
      overlay: 'chest-opening',
    })
    expect(expiredDuringGuarantee).toMatchObject({
      eventSecondsRemaining: 0,
      selectedTargetId: 'whale-boat',
      meterProgress: 300,
      targetLocked: true,
      overlay: 'guarantee',
    })
    expect(demoReducer(expiredDuringGuarantee, { type: 'CLAIM_GUARANTEE' })).toMatchObject({
      overlay: 'collection-complete',
      eventCompleted: true,
    })
  })

  it('collects the Collection reward only once and keeps the event terminal', () => {
    const threshold = { ...chooseWhaleBoat(), meterProgress: 300, targetConfirmed: true, targetLocked: true, overlay: 'guarantee' as const }
    const claimed = demoReducer(threshold, { type: 'CLAIM_GUARANTEE' })
    const collected = demoReducer(claimed, { type: 'COLLECT_REWARD' })
    const collectedAgain = demoReducer(collected, { type: 'COLLECT_REWARD' })
    const reopened = demoReducer(collectedAgain, { type: 'OPEN_BOUNTY' })

    expect(collectedAgain.spins).toBe(4_350)
    expect(reopened).toBe(collectedAgain)
  })

  it('resets for an early target acquisition only before the threshold', () => {
    const active = { ...chooseWhaleBoat(), meterProgress: 6, targetConfirmed: true, targetLocked: true, overlay: 'bounty' as const }
    const obtainedEarly = demoReducer(active, { type: 'TARGET_OBTAINED_EARLY' })
    const threshold = { ...active, meterProgress: 300, overlay: 'guarantee' as const }

    expect(obtainedEarly).toMatchObject({
      selectedTargetId: null,
      meterProgress: 0,
      targetLocked: false,
      targetConfirmed: false,
      overlay: 'target-picker',
    })
    expect(demoReducer(threshold, { type: 'TARGET_OBTAINED_EARLY' })).toBe(threshold)
    expect(demoReducer(initialDemoState, { type: 'TARGET_OBTAINED_EARLY' })).toBe(initialDemoState)
  })

  it('ignores non-finite quantities', () => {
    let state = demoReducer(chooseWhaleBoat(), { type: 'CONFIRM_TARGET' })
    state = demoReducer(state, { type: 'OPEN_CHEST_DIALOG', chestId: 'wooden' })
    const unchanged = demoReducer(state, { type: 'SET_QUANTITY', quantity: Number.NaN })

    expect(unchanged).toBe(state)
  })

  it('restarts to the exact initial state', () => {
    const changed = openChest('golden', 2)
    expect(demoReducer(changed, { type: 'RESTART' })).toEqual(initialDemoState)
  })
})
