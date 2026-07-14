import {
  BOUNTY_THRESHOLD,
  EVENT_SECONDS,
  STARTING_COINS,
  STARTING_SPINS,
  type ChestId,
  type DemoChest,
  type TargetId,
  getChest,
  getTarget,
} from './demoData'

export type BaseScreen = 'cards-center' | 'spin-return'
export type DemoOverlay =
  | 'intro'
  | 'target-picker'
  | 'target-confirmation'
  | 'bounty'
  | 'chest-quantity'
  | 'chest-opening'
  | 'guarantee'
  | 'collection-complete'
  | null

export type PendingPurchase = {
  chestId: ChestId
  quantity: number
}

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

export type DemoState = {
  baseScreen: BaseScreen
  overlay: DemoOverlay
  selectedTargetId: TargetId | null
  coins: number
  spins: number
  meterProgress: number
  meterThreshold: number
  targetConfirmed: boolean
  targetLocked: boolean
  pendingPurchase: PendingPurchase | null
  purchaseError: string | null
  lastProgressEarned: number
  lastCoinCost: number
  eventSecondsRemaining: number
  eventCompleted: boolean
  collectionReward: number
}

export type DemoAction =
  | { type: 'OPEN_BOUNTY' }
  | { type: 'CLOSE_BOUNTY' }
  | { type: 'OPEN_TARGET_PICKER' }
  | { type: 'SELECT_TARGET'; targetId: TargetId }
  | { type: 'CONFIRM_TARGET' }
  | { type: 'OPEN_CHEST_DIALOG'; chestId: ChestId }
  | { type: 'SET_QUANTITY'; quantity: number }
  | { type: 'CONFIRM_PURCHASE' }
  | { type: 'CANCEL_PURCHASE' }
  | { type: 'COMPLETE_CHEST_OPENING' }
  | { type: 'CLAIM_GUARANTEE' }
  | { type: 'COLLECT_REWARD' }
  | { type: 'RETURN_TO_SPIN' }
  | { type: 'TARGET_OBTAINED_EARLY' }
  | { type: 'TICK'; seconds?: number }
  | { type: 'RESTART' }

export const initialDemoState: DemoState = {
  baseScreen: 'cards-center',
  overlay: null,
  selectedTargetId: null,
  coins: STARTING_COINS,
  spins: STARTING_SPINS,
  meterProgress: 0,
  meterThreshold: BOUNTY_THRESHOLD,
  targetConfirmed: false,
  targetLocked: false,
  pendingPurchase: null,
  purchaseError: null,
  lastProgressEarned: 0,
  lastCoinCost: 0,
  eventSecondsRemaining: EVENT_SECONDS,
  eventCompleted: false,
  collectionReward: 0,
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

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'OPEN_BOUNTY':
      if (state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      return {
        ...state,
        overlay: state.selectedTargetId
          ? state.targetConfirmed ? 'bounty' : 'target-confirmation'
          : 'intro',
        purchaseError: null,
      }

    case 'CLOSE_BOUNTY':
      return { ...state, overlay: null, pendingPurchase: null, purchaseError: null }

    case 'OPEN_TARGET_PICKER':
      if (state.targetLocked || state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      return { ...state, overlay: 'target-picker', purchaseError: null }

    case 'SELECT_TARGET': {
      if (state.targetLocked || state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      const target = getTarget(action.targetId)
      if (!target) return state
      return {
        ...state,
        selectedTargetId: action.targetId,
        meterProgress: 0,
        meterThreshold: target.bountyThreshold,
        targetConfirmed: false,
        overlay: 'target-confirmation',
        pendingPurchase: null,
        purchaseError: null,
        lastProgressEarned: 0,
      }
    }

    case 'CONFIRM_TARGET':
      if (!state.selectedTargetId || state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      return { ...state, targetConfirmed: true, overlay: 'bounty', purchaseError: null }

    case 'OPEN_CHEST_DIALOG': {
      if (!state.selectedTargetId || !state.targetConfirmed || state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      const chest = getChest(action.chestId)
      if (!chest) return state
      return {
        ...state,
        overlay: 'chest-quantity',
        pendingPurchase: {
          chestId: action.chestId,
          quantity: clampPurchaseQuantity(chest, state.coins, chest.defaultQuantity),
        },
        purchaseError: null,
      }
    }

    case 'SET_QUANTITY':
      if (
        state.overlay !== 'chest-quantity'
        || !state.pendingPurchase
        || !Number.isFinite(action.quantity)
      ) return state
      return {
        ...state,
        pendingPurchase: {
          ...state.pendingPurchase,
          quantity: Math.max(1, Math.floor(action.quantity)),
        },
        purchaseError: null,
      }

    case 'CONFIRM_PURCHASE': {
      if (
        state.overlay !== 'chest-quantity'
        || !state.pendingPurchase
        || !state.selectedTargetId
        || !state.targetConfirmed
        || state.eventCompleted
        || state.eventSecondsRemaining <= 0
      ) return state
      const preview = getPurchasePreview(state)
      if (!preview) return state
      if (!preview.isAffordable) {
        return { ...state, purchaseError: 'Not enough Coins' }
      }

      return {
        ...state,
        coins: state.coins - preview.totalCost,
        meterProgress: preview.progressAfter,
        targetLocked: true,
        overlay: 'chest-opening',
        purchaseError: null,
        lastProgressEarned: preview.progressGain,
        lastCoinCost: preview.totalCost,
      }
    }

    case 'CANCEL_PURCHASE':
      if (state.overlay !== 'chest-quantity') return state
      return { ...state, overlay: 'bounty', pendingPurchase: null, purchaseError: null }

    case 'COMPLETE_CHEST_OPENING':
      return {
        ...state,
        overlay: state.meterProgress >= state.meterThreshold ? 'guarantee' : 'bounty',
        pendingPurchase: null,
      }

    case 'CLAIM_GUARANTEE':
      if (state.eventCompleted || !state.selectedTargetId || !state.targetConfirmed || state.meterProgress < state.meterThreshold) return state
      return { ...state, overlay: 'collection-complete', eventCompleted: true }

    case 'COLLECT_REWARD': {
      const target = getTarget(state.selectedTargetId)
      if (!target || target.collectionProgress !== 8 || !state.eventCompleted || state.collectionReward > 0) return state
      return {
        ...state,
        baseScreen: 'spin-return',
        overlay: null,
        spins: state.spins + target.collectionRewardSpins,
        collectionReward: target.collectionRewardSpins,
      }
    }

    case 'RETURN_TO_SPIN': {
      const target = getTarget(state.selectedTargetId)
      if (!target || target.collectionProgress >= 8 || !state.eventCompleted) return state
      return {
        ...state,
        baseScreen: 'spin-return',
        overlay: null,
        collectionReward: 0,
      }
    }

    case 'TARGET_OBTAINED_EARLY':
      if (
        state.eventCompleted
        || !state.selectedTargetId
        || state.meterProgress >= state.meterThreshold
      ) return state
      return {
        ...state,
        selectedTargetId: null,
        meterProgress: 0,
        meterThreshold: BOUNTY_THRESHOLD,
        targetConfirmed: false,
        targetLocked: false,
        pendingPurchase: null,
        overlay: 'target-picker',
        lastProgressEarned: 0,
      }

    case 'TICK': {
      if (state.eventCompleted || state.eventSecondsRemaining <= 0) return state
      const eventSecondsRemaining = Math.max(0, state.eventSecondsRemaining - (action.seconds ?? 1))
      if (eventSecondsRemaining === 0 && !state.eventCompleted) {
        const guaranteeEarned = (
          state.meterProgress >= state.meterThreshold
          && (state.overlay === 'chest-opening' || state.overlay === 'guarantee')
        )
        if (guaranteeEarned) return { ...state, eventSecondsRemaining }

        return {
          ...state,
          eventSecondsRemaining,
          selectedTargetId: null,
          meterProgress: 0,
          meterThreshold: BOUNTY_THRESHOLD,
          targetConfirmed: false,
          targetLocked: false,
          pendingPurchase: null,
          purchaseError: null,
          lastProgressEarned: 0,
          lastCoinCost: 0,
          overlay: null,
        }
      }
      return { ...state, eventSecondsRemaining }
    }

    case 'RESTART':
      return initialDemoState

    default:
      return state
  }
}
