import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { useState } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import ChestPurchaseDialog from '../ChestPurchaseDialog'
import {
  getPurchasePreview,
  initialDemoState,
  type DemoState,
} from '../demoReducer'

function purchaseState({
  quantity,
  coins = initialDemoState.coins,
  meterProgress = 0,
  purchaseError = null,
}: {
  quantity: number
  coins?: number
  meterProgress?: number
  purchaseError?: string | null
}): DemoState {
  return {
    ...initialDemoState,
    overlay: 'chest-quantity',
    selectedTargetId: 'whale-boat',
    targetConfirmed: true,
    pendingPurchase: { chestId: 'magical', quantity },
    coins,
    meterProgress,
    purchaseError,
  }
}

function dialogProps(
  state: DemoState,
  onQuantity: (quantity: number) => void = jest.fn(),
  onConfirm: () => void = jest.fn(),
) {
  const preview = getPurchasePreview(state)
  if (!preview) throw new Error('Expected a Magical Chest purchase preview')

  return {
    preview,
    purchaseError: state.purchaseError,
    onQuantity,
    onConfirm,
  }
}

function LivePurchaseHarness({ onQuantity }: { onQuantity: jest.Mock }) {
  const [quantity, setQuantity] = useState(10)
  const state = purchaseState({ quantity })

  return (
    <ChestPurchaseDialog
      {...dialogProps(state, (nextQuantity) => {
        onQuantity(nextQuantity)
        setQuantity(nextQuantity)
      })}
    />
  )
}

describe('ChestPurchaseDialog', () => {
  it('renders the live batch quote and refreshes every projection when quantity changes', () => {
    const onQuantity = jest.fn()
    render(<LivePurchaseHarness onQuantity={onQuantity} />)

    expect(screen.getByText('High chance for')).toBeInTheDocument()
    expect(screen.getByText('Cards x8')).toBeInTheDocument()
    expect(screen.getByLabelText('Chest quantity')).toHaveTextContent('10')
    expect(screen.getByText('80 total Cards')).toBeInTheDocument()
    expect(screen.getByText('290,000,000')).toBeInTheDocument()
    expect(screen.getByText('+30')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar', { name: 'Current Bounty progress' })).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Projected Bounty progress' })).toHaveAttribute('aria-valuenow', '30')

    fireEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))

    expect(onQuantity).toHaveBeenLastCalledWith(11)
    expect(screen.getByLabelText('Chest quantity')).toHaveTextContent('11')
    expect(screen.getByText('88 total Cards')).toBeInTheDocument()
    expect(screen.getByText('319,000,000')).toBeInTheDocument()
    expect(screen.getByText('+33')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Projected Bounty progress' })).toHaveAttribute('aria-valuenow', '33')
    expect(screen.getByRole('button', { name: 'Confirm Chest purchase' })).toHaveAccessibleDescription(
      'Total Coin cost: 319,000,000 Coins',
    )
  })

  it('disables the decrement at one instead of wrapping to the maximum', () => {
    const onQuantity = jest.fn()
    render(<ChestPurchaseDialog {...dialogProps(purchaseState({ quantity: 1 }), onQuantity)} />)

    const decrease = screen.getByRole('button', { name: 'Decrease quantity' })
    expect(decrease).toBeDisabled()
    fireEvent.click(decrease)
    expect(onQuantity).not.toHaveBeenCalled()
  })

  it('disables the increment at the affordable maximum instead of wrapping to one', () => {
    const onQuantity = jest.fn()
    render(<ChestPurchaseDialog {...dialogProps(purchaseState({ quantity: 110 }), onQuantity)} />)

    const increase = screen.getByRole('button', { name: 'Increase quantity' })
    expect(increase).toBeDisabled()
    fireEvent.click(increase)
    expect(onQuantity).not.toHaveBeenCalled()
  })

  it('keeps triangular visuals inside full quantity-button hit targets', () => {
    render(<ChestPurchaseDialog {...dialogProps(purchaseState({ quantity: 10 }))} />)

    expect(
      within(screen.getByRole('button', { name: 'Increase quantity' })).getByTestId('quantity-triangle'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('button', { name: 'Decrease quantity' })).getByTestId('quantity-triangle'),
    ).toBeInTheDocument()
  })

  it('uses the embedded purchase width for its compact layout breakpoint', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/ChestPurchaseDialog.module.css'),
      'utf8',
    )

    expect(css).toMatch(/container-name:\s*purchase-dialog/)
    expect(css).toMatch(/@container purchase-dialog \(max-width: 360px\)/)
    expect(css).toMatch(/@container purchase-dialog \(max-width: 300px\)/)
    expect(css).toMatch(/\.chanceCopy > span\s*{[^}]*white-space:\s*normal/)
    expect(css).not.toMatch(/font-size:\s*\.(?:4\d|5[0-4])rem/)
  })

  it('announces an unaffordable purchase error and disables confirmation', () => {
    const onConfirm = jest.fn()
    render(
      <ChestPurchaseDialog
        {...dialogProps(purchaseState({ quantity: 1, coins: 0, purchaseError: 'Not enough Coins' }), jest.fn(), onConfirm)}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Not enough Coins')
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
    const confirm = screen.getByRole('button', { name: 'Confirm Chest purchase' })
    expect(confirm).toBeDisabled()
    fireEvent.click(confirm)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('confirms an affordable quote through the provided callback', () => {
    const onConfirm = jest.fn()
    render(
      <ChestPurchaseDialog
        {...dialogProps(purchaseState({ quantity: 10 }), jest.fn(), onConfirm)}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
