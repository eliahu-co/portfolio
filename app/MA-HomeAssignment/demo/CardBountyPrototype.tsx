'use client'

import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useReducer, useRef } from 'react'
import { ActiveBountyPanel, IntroPanel, TargetChangeWarning, TargetConfirmation } from './CardBountyPanel'
import CardsCenterScreen from './CardsCenterScreen'
import ChestPurchaseDialog from './ChestPurchaseDialog'
import DemoShell from './DemoShell'
import { getTarget, type ChestId } from './demoData'
import { demoReducer, getPurchasePreview, initialDemoState } from './demoReducer'
import { ChestOpening, CollectionComplete, GuaranteeReveal } from './RewardSequence'
import { RibbonDialog, RibbonFrame } from './RibbonDialog'
import SpinReturnScreen from './SpinReturnScreen'
import TargetPicker from './TargetPicker'
import styles from './CardBountyPrototype.module.css'

// React 18 types inert as boolean but only forwards the standards-compliant empty attribute.
const inertAttribute = '' as unknown as boolean

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getAttribute('aria-hidden') !== 'true',
  )
}

function guidanceFor(
  overlay: typeof initialDemoState.overlay,
  baseScreen: typeof initialDemoState.baseScreen,
  eventCompleted: boolean,
  completesCollection: boolean,
  targetId?: string,
  threshold?: number,
) {
  if (baseScreen === 'spin-return') return 'The loop closes back at Spin'
  if (eventCompleted) return 'Collection updated — restart to replay'
  switch (overlay) {
    case null: return 'Tap the shaking Card Bounty event'
    case 'intro': return 'Choose a Card to begin'
    case 'target-picker': return 'Whale Boat is the guided target'
    case 'target-confirmation': return 'Confirm the selected target'
    case 'target-change-warning': return 'Confirm whether to reset Bounty progress'
    case 'bounty': return 'Buy Chests to progress the meter'
    case 'chest-quantity': return 'Adjust quantity and confirm'
    case 'chest-opening': return 'Continue'
    case 'guarantee': return 'Collect your target Card'
    case 'collection-complete': return completesCollection ? 'Collect the Spin reward' : 'Return to the core loop'
  }
}

export default function CardBountyPrototype({
  mode = 'standalone',
}: {
  mode?: 'standalone' | 'presentation'
} = {}) {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState)
  const baseLayerRef = useRef<HTMLDivElement>(null)
  const overlayHostRef = useRef<HTMLDivElement>(null)
  const flowOpenerRef = useRef<HTMLElement | null>(null)
  const target = getTarget(state.selectedTargetId)
  const purchasePreview = getPurchasePreview(state)
  const countdownActive = !state.eventCompleted && state.eventSecondsRemaining > 0

  useEffect(() => {
    if (!countdownActive) return
    const timer = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(timer)
  }, [countdownActive])

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
    if (opener?.isConnected) {
      opener.focus()
    } else if (state.eventCompleted) {
      baseLayerRef.current
        ?.querySelector<HTMLElement>('[data-cards-center-heading]')
        ?.focus()
    }
  }, [state.baseScreen, state.eventCompleted, state.overlay])

  useEffect(() => {
    if (state.overlay !== null || state.baseScreen !== 'spin-return') return
    baseLayerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Spin"]')?.focus()
  }, [state.baseScreen, state.overlay])

  function handleOverlayKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.key !== 'Tab') return

    const dialog = overlayHostRef.current?.querySelector<HTMLElement>('[role="dialog"]')
    if (!dialog) return

    const focusableElements = getFocusableElements(dialog)
    if (focusableElements.length === 0) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && (activeElement === lastElement || !dialog.contains(activeElement))) {
      event.preventDefault()
      firstElement.focus()
    }
  }

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
              threshold={state.meterThreshold}
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
              onChange={() => dispatch({ type: 'REQUEST_TARGET_CHANGE' })}
              onChest={openChest}
            />
          </RibbonDialog>
        ) : null
      case 'target-change-warning':
        return target ? (
          <RibbonDialog
            key="card-bounty-overlay"
            title="Change Target?"
            size="compact"
            onClose={() => dispatch({ type: 'CANCEL_TARGET_CHANGE' })}
          >
            <TargetChangeWarning
              progress={state.meterProgress}
              onCancel={() => dispatch({ type: 'CANCEL_TARGET_CHANGE' })}
              onConfirm={() => dispatch({ type: 'CONFIRM_TARGET_CHANGE' })}
            />
          </RibbonDialog>
        ) : null
      case 'chest-quantity':
        return target && purchasePreview ? (
          <RibbonDialog
            key="card-bounty-overlay"
            title={purchasePreview.chest.name}
            size="purchase"
            onClose={() => dispatch({ type: 'CANCEL_PURCHASE' })}
            hero={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={purchasePreview.chest.id === 'magical'
                  ? '/coinmaster/card-bounty/generated/magical-chest-open.webp'
                  : purchasePreview.chest.image}
                alt=""
              />
            }
          >
            <ChestPurchaseDialog
              preview={purchasePreview}
              purchaseError={state.purchaseError}
              onQuantity={(quantity) => dispatch({ type: 'SET_QUANTITY', quantity })}
              onConfirm={() => dispatch({ type: 'CONFIRM_PURCHASE' })}
            />
          </RibbonDialog>
        ) : null
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
      mode={mode}
      onRestart={() => dispatch({ type: 'RESTART' })}
      guidance={guidanceFor(state.overlay, state.baseScreen, state.eventCompleted, target?.collectionProgress === 8, target?.id, state.meterThreshold)}
      finalState={state.eventCompleted && state.overlay === null}
      modalActive={Boolean(state.overlay)}
    >
      <div
        className={styles.baseLayer}
        aria-hidden={Boolean(state.overlay)}
        inert={state.overlay ? inertAttribute : undefined}
        ref={baseLayerRef}
      >
        {state.baseScreen === 'cards-center' ? (
          <CardsCenterScreen
            countdown={state.eventSecondsRemaining}
            eventCompleted={state.eventCompleted}
            completedCollection={target?.collection}
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
      <div className={styles.overlayHost} onKeyDown={handleOverlayKeyDown} ref={overlayHostRef}>
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
                onChange={() => dispatch({ type: 'REQUEST_TARGET_CHANGE' })}
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
