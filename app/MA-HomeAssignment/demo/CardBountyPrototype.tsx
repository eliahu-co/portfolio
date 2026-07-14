'use client'

import { useEffect, useReducer } from 'react'
import { ActiveBountyPanel, IntroPanel, TargetConfirmation } from './CardBountyPanel'
import CardsCenterScreen from './CardsCenterScreen'
import ChestPurchaseDialog from './ChestPurchaseDialog'
import DemoShell from './DemoShell'
import { getTarget, type ChestId } from './demoData'
import { demoReducer, initialDemoState } from './demoReducer'
import { ChestOpening, CollectionComplete, GuaranteeReveal } from './RewardSequence'
import SpinReturnScreen from './SpinReturnScreen'
import TargetPicker from './TargetPicker'
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
    case 'bounty': return targetId === 'whale-boat' ? 'Use 3 Magical Chests, then 1 Wooden' : `Choose Chests to reach ${threshold ?? 'the target'}`
    case 'chest-quantity': return 'Adjust quantity and confirm'
    case 'chest-opening': return 'Review deterministic duplicates'
    case 'guarantee': return 'Add the guaranteed Card'
    case 'collection-complete': return completesCollection ? 'Collect the Spin reward' : 'Return to the core loop'
  }
}

export default function CardBountyPrototype() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState)
  const target = getTarget(state.selectedTargetId)

  useEffect(() => {
    const timer = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const openChest = (chestId: ChestId) => dispatch({ type: 'OPEN_CHEST_DIALOG', chestId })

  function renderOverlay() {
    switch (state.overlay) {
      case 'intro':
        return <IntroPanel countdown={state.eventSecondsRemaining} onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })} onChoose={() => dispatch({ type: 'OPEN_TARGET_PICKER' })} />
      case 'target-picker':
        return <TargetPicker countdown={state.eventSecondsRemaining} onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })} onSelect={(targetId) => dispatch({ type: 'SELECT_TARGET', targetId })} />
      case 'target-confirmation':
        return target ? <TargetConfirmation target={target} countdown={state.eventSecondsRemaining} onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })} onBack={() => dispatch({ type: 'OPEN_TARGET_PICKER' })} onSelect={() => dispatch({ type: 'CONFIRM_TARGET' })} /> : null
      case 'bounty':
        return target ? <ActiveBountyPanel state={state} target={target} onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })} onChange={() => dispatch({ type: 'OPEN_TARGET_PICKER' })} onChest={openChest} /> : null
      case 'chest-quantity':
        return target ? (
          <>
            <div className={styles.inertLayer} aria-hidden="true" inert={inertAttribute}>
              <ActiveBountyPanel state={state} target={target} onClose={() => dispatch({ type: 'CLOSE_BOUNTY' })} onChange={() => dispatch({ type: 'OPEN_TARGET_PICKER' })} onChest={openChest} />
            </div>
            <ChestPurchaseDialog state={state} onQuantity={(quantity) => dispatch({ type: 'SET_QUANTITY', quantity })} onCancel={() => dispatch({ type: 'CANCEL_PURCHASE' })} onConfirm={() => dispatch({ type: 'CONFIRM_PURCHASE' })} />
          </>
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
            onOpenBounty={() => dispatch({ type: 'OPEN_BOUNTY' })}
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
      {state.overlay && <div className={styles.gameDimmer} aria-hidden="true" />}
      {renderOverlay()}
    </DemoShell>
  )
}
