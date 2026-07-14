'use client'

import { useEffect, useReducer, useRef } from 'react'
import { ActiveBountyPanel, IntroPanel, TargetConfirmation } from './CardBountyPanel'
import CardsCenterScreen from './CardsCenterScreen'
import DemoShell from './DemoShell'
import { formatCompactCoins, formatNumber, getChest, getTarget, type ChestId } from './demoData'
import { demoReducer, initialDemoState, type DemoState } from './demoReducer'
import { ChevronGlyph, CoinIcon, PrimaryButton } from './GamePrimitives'
import { ChestOpening, CollectionComplete, GuaranteeReveal } from './RewardSequence'
import { RibbonDialog, RibbonFrame } from './RibbonDialog'
import SpinReturnScreen from './SpinReturnScreen'
import TargetPicker from './TargetPicker'
import panelStyles from './BountyPanels.module.css'
import styles from './CardBountyPrototype.module.css'

// React 18 types inert as boolean but only forwards the standards-compliant empty attribute.
const inertAttribute = '' as unknown as boolean

function guidanceFor(
  overlay: typeof initialDemoState.overlay,
  baseScreen: typeof initialDemoState.baseScreen,
  completesCollection: boolean,
  targetId?: string,
  threshold?: number,
) {
  if (baseScreen === 'spin-return') return 'The loop closes back at Spin'
  switch (overlay) {
    case null: return 'Tap the highlighted Card Bounty event'
    case 'intro': return 'Choose a Card to begin'
    case 'target-picker': return 'Whale Boat is the guided target'
    case 'target-confirmation': return 'Confirm the selected target'
    case 'bounty': return targetId === 'whale-boat' ? 'Buy 10 Magical Chests per batch' : `Choose Chests to reach ${threshold ?? 'the target'}`
    case 'chest-quantity': return 'Adjust quantity and confirm'
    case 'chest-opening': return 'Review deterministic duplicates'
    case 'guarantee': return 'Add the guaranteed Card'
    case 'collection-complete': return completesCollection ? 'Collect the Spin reward' : 'Return to the core loop'
  }
}

function ChestPurchaseContent({
  state,
  onQuantity,
  onConfirm,
}: {
  state: DemoState
  onQuantity: (quantity: number) => void
  onConfirm: () => void
}) {
  const pending = state.pendingPurchase
  const chest = getChest(pending?.chestId ?? null)
  if (!pending || !chest) return null

  const quantity = pending.quantity
  const maxAffordable = Math.floor(state.coins / chest.price)
  const totalCost = chest.price * quantity
  const availableProgress = Math.max(0, state.meterThreshold - state.meterProgress)
  const totalProgress = Math.min(availableProgress, chest.bountyProgress * quantity)
  const isAffordable = maxAffordable >= quantity

  function increment() {
    if (maxAffordable < 1) return
    onQuantity(quantity >= maxAffordable ? 1 : quantity + 1)
  }

  function decrement() {
    if (maxAffordable < 1) return
    onQuantity(quantity <= 1 ? maxAffordable : quantity - 1)
  }

  return (
    <div className={panelStyles.purchaseContent}>
      <p className={panelStyles.purchaseKicker}>Multiple-Chest purchase</p>
      <p className={panelStyles.purchaseCards}>{chest.cardsPerChest} Cards per Chest</p>

      <div className={panelStyles.quantityControl}>
        <button type="button" onClick={increment} aria-label="Increase quantity" disabled={maxAffordable < 1}>
          <ChevronGlyph direction="up" />
        </button>
        <div><small>Quantity</small><strong>{quantity}</strong></div>
        <button type="button" onClick={decrement} aria-label="Decrease quantity" disabled={maxAffordable < 1}>
          <ChevronGlyph direction="down" />
        </button>
      </div>

      <dl className={panelStyles.purchaseSummary}>
        <div><dt>Total Coin cost</dt><dd><CoinIcon small />{formatNumber(totalCost)}</dd></div>
        <div><dt>Total Bounty progress</dt><dd>+{totalProgress}</dd></div>
      </dl>
      <p className={panelStyles.affordability}>{maxAffordable > 0 ? `Up to ${maxAffordable} affordable \u00B7 ${formatCompactCoins(chest.price)} each` : 'Not enough Coins for this Chest'}</p>
      {state.purchaseError && <p className={panelStyles.purchaseError} role="alert">{state.purchaseError}</p>}
      <PrimaryButton type="button" onClick={onConfirm} disabled={!isAffordable || maxAffordable < 1} aria-label="Confirm Chest purchase">
        <CoinIcon small /> Confirm purchase
      </PrimaryButton>
    </div>
  )
}

export default function CardBountyPrototype() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState)
  const overlayHostRef = useRef<HTMLDivElement>(null)
  const flowOpenerRef = useRef<HTMLElement | null>(null)
  const target = getTarget(state.selectedTargetId)

  useEffect(() => {
    const timer = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (state.overlay === null) return

    const dialog = overlayHostRef.current?.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return
    const focusTarget = dialog.querySelector<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const nextFocus = focusTarget ?? dialog
    nextFocus.focus()
  }, [state.overlay])

  useEffect(() => {
    if (state.overlay !== null) return
    if (state.baseScreen !== 'cards-center') {
      flowOpenerRef.current = null
      return
    }

    const opener = flowOpenerRef.current
    flowOpenerRef.current = null
    if (opener?.isConnected) opener.focus()
  }, [state.baseScreen, state.overlay])

  const openChest = (chestId: ChestId) => dispatch({ type: 'OPEN_CHEST_DIALOG', chestId })

  function renderOverlay() {
    switch (state.overlay) {
      case 'intro':
        return (
          <RibbonDialog key="card-bounty-overlay" title="Card Bounty" size="compact" onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })}>
            <IntroPanel countdown={state.eventSecondsRemaining} onChoose={() => dispatch({ type: 'OPEN_TARGET_PICKER' })} />
          </RibbonDialog>
        )
      case 'target-picker':
        return (
          <RibbonDialog key="card-bounty-overlay" title="Choose a Card" size="tall" onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })}>
            <TargetPicker countdown={state.eventSecondsRemaining} onSelect={(targetId) => dispatch({ type: 'SELECT_TARGET', targetId })} />
          </RibbonDialog>
        )
      case 'target-confirmation':
        return target ? (
          <RibbonDialog key="card-bounty-overlay" title="Confirm Target" size="compact" onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })}>
            <TargetConfirmation
              target={target}
              countdown={state.eventSecondsRemaining}
              onBack={() => dispatch({ type: 'OPEN_TARGET_PICKER' })}
              onSelect={() => dispatch({ type: 'CONFIRM_TARGET' })}
            />
          </RibbonDialog>
        ) : null
      case 'bounty':
        return target ? (
          <RibbonDialog key="card-bounty-overlay" title="Card Bounty" size="tall" onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })}>
            <ActiveBountyPanel
              state={state}
              target={target}
              onChange={() => dispatch({ type: 'OPEN_TARGET_PICKER' })}
              onChest={openChest}
            />
          </RibbonDialog>
        ) : null
      case 'chest-quantity': {
        const chest = getChest(state.pendingPurchase?.chestId ?? null)
        return target && chest ? (
          <RibbonDialog
            key="card-bounty-overlay"
            title={chest.name}
            size="purchase"
            onClose={() => dispatch({ type: 'CANCEL_PURCHASE' })}
            hero={
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/coinmaster/card-bounty/${chest.id}-chest.png`} alt="" />
            }
          >
            <ChestPurchaseContent
              state={state}
              onQuantity={(quantity) => dispatch({ type: 'SET_QUANTITY', quantity })}
              onConfirm={() => dispatch({ type: 'CONFIRM_PURCHASE' })}
            />
          </RibbonDialog>
        ) : null
      }
      case 'chest-opening':
        return <ChestOpening state={state} onContinue={() => dispatch({ type: 'COMPLETE_CHEST_OPENING' })} />
      case 'guarantee':
        return target ? <GuaranteeReveal target={target} threshold={state.meterThreshold} onClaim={() => dispatch({ type: 'CLAIM_GUARANTEE' })} /> : null
      case 'collection-complete':
        return target ? (
          <CollectionComplete
            target={target}
            onCollect={() => dispatch({ type: target.collectionProgress === 8 ? 'COLLECT_REWARD' : 'RETURN_TO_SPIN' })}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <DemoShell
      onRestart={() => dispatch({ type: 'RESTART' })}
      guidance={guidanceFor(state.overlay, state.baseScreen, target?.collectionProgress === 8, target?.id, state.meterThreshold)}
      finalState={state.baseScreen === 'spin-return'}
      modalActive={Boolean(state.overlay)}
    >
      <div
        className={styles.baseLayer}
        aria-hidden={Boolean(state.overlay)}
        inert={state.overlay ? inertAttribute : undefined}
      >
        {state.baseScreen === 'cards-center' ? (
          <CardsCenterScreen
            countdown={state.eventSecondsRemaining}
            onOpenBounty={() => {
              flowOpenerRef.current = document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null
              dispatch({ type: 'OPEN_BOUNTY' })
            }}
          />
        ) : (
          <SpinReturnScreen
            coins={state.coins}
            spins={state.spins}
            reward={state.collectionReward}
            targetName={target?.name ?? 'Bounty Card'}
          />
        )}
      </div>
      <div className={styles.overlayHost} ref={overlayHostRef}>
        {state.overlay === 'chest-quantity' && target ? (
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
        ) : null}
        {renderOverlay()}
      </div>
    </DemoShell>
  )
}
