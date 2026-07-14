import { fireEvent, render, screen, within } from '@testing-library/react'
import CardBountyPrototype from '../CardBountyPrototype'

describe('Card Bounty prototype happy path', () => {
  it('completes the deterministic economy loop and can restart', () => {
    render(<CardBountyPrototype />)

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open Card Bounty' }))

    const chooseCard = screen.getByRole('button', { name: 'Choose a Card' })
    chooseCard.focus()
    fireEvent.click(chooseCard)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const pickerDialog = screen.getByRole('dialog', { name: 'Choose a Card' })
    expect(pickerDialog).toHaveAttribute('data-size', 'tall')
    expect(pickerDialog).toContainElement(document.activeElement as HTMLElement)

    const whaleBoat = screen.getByRole('button', { name: 'Select Whale Boat, Sinbad 8 of 9 Cards, 4 Stars, regular tradable' })
    whaleBoat.focus()
    fireEvent.click(whaleBoat)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const confirmationDialog = screen.getByRole('dialog', { name: 'Confirm Target' })
    expect(confirmationDialog).toHaveAttribute('data-size', 'compact')
    expect(confirmationDialog).toContainElement(document.activeElement as HTMLElement)

    const selectTarget = screen.getByRole('button', { name: 'Select target' })
    selectTarget.focus()
    fireEvent.click(selectTarget)

    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const bountyDialog = screen.getByRole('dialog', { name: 'Card Bounty' })
    expect(bountyDialog).toHaveAttribute('data-size', 'tall')
    expect(bountyDialog).toContainElement(document.activeElement as HTMLElement)
    expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute('aria-valuemax', '300')
    expect(screen.getByText('0/300')).toBeInTheDocument()
    expect(screen.getByText('Buy 10 Magical Chests per batch')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Wooden Chest, 5.2M Coins, 2 Cards per Chest, +1 Bounty progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Golden Chest, 16M Coins, 4 Cards per Chest, +2 Bounty progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' })).toBeInTheDocument()

    for (let batch = 1; batch <= 10; batch += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))

      expect(screen.getAllByRole('dialog')).toHaveLength(1)
      const purchaseDialog = screen.getByRole('dialog', { name: 'Magical Chest' })
      expect(purchaseDialog).toHaveAttribute('data-size', 'purchase')
      expect(purchaseDialog.querySelector('img[alt=""]')).toHaveAttribute(
        'src',
        '/coinmaster/card-bounty/generated/magical-chest-open.webp',
      )
      expect(screen.getByLabelText('Chest quantity')).toHaveTextContent('10')
      expect(screen.getByText('80 total Cards')).toBeInTheDocument()
      expect(screen.getByText('290,000,000')).toBeInTheDocument()
      expect(screen.getByText('+30')).toBeInTheDocument()
      expect(screen.getByRole('progressbar', { name: 'Current Bounty progress' })).toHaveAttribute(
        'aria-valuenow',
        String((batch - 1) * 30),
      )
      expect(screen.getByRole('progressbar', { name: 'Projected Bounty progress' })).toHaveAttribute(
        'aria-valuenow',
        String(batch * 30),
      )
      const underlay = screen.getByTestId('active-bounty-underlay')
      expect(underlay).toHaveAttribute('aria-hidden', 'true')
      expect(underlay).toHaveAttribute('inert')

      fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
      const chestOpening = screen.getByRole('dialog', { name: 'Duplicate Cards' })
      expect(chestOpening.querySelector('img[src="/coinmaster/card-bounty/generated/magical-chest-open.webp"]')).toBeInTheDocument()
      expect(screen.getByText('10 Chests · 80 Cards · 3 shown')).toBeInTheDocument()
      expect(screen.getAllByText('Duplicate')).toHaveLength(3)
      expect(screen.getByText('+30 Bounty progress')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

      if (batch < 10) {
        expect(screen.getByText(`${batch * 30}/300`)).toBeInTheDocument()
        expect(screen.getByText('Target locked')).toBeInTheDocument()
      }
    }

    expect(screen.getByRole('heading', { name: 'Bounty Complete' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add to Collection' }))
    expect(screen.getByRole('heading', { name: 'Sinbad — Collection Completed' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Collect 2,500 Spins' }))

    const reels = screen.getByRole('region', { name: 'Slot machine reels' })
    expect(within(reels).getAllByRole('img')).toHaveLength(9)
    expect(screen.getByRole('group', { name: 'Coin balance: 300,000,000' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Spin balance: 4,350' })).toBeInTheDocument()
    const spin = screen.getByRole('button', { name: 'Spin' })
    expect(spin).toHaveFocus()
    expect(spin).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Collection reward: +2,500 Spins')).toBeInTheDocument()
    expect(screen.getByText('300,000,000')).toBeInTheDocument()
    fireEvent.click(spin)
    expect(spin).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Core loop ready')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Restart demo' }))

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    expect(screen.queryByText('Collection reward: +2,500 Spins')).not.toBeInTheDocument()
  })

  it('hides the base Cards Center from assistive tech while an overlay is open', () => {
    render(<CardBountyPrototype />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Card Bounty' }))

    const baseLayer = screen.getByRole('heading', { name: 'Cards Center', hidden: true }).closest('[aria-hidden="true"]')
    expect(baseLayer).toHaveAttribute('aria-hidden', 'true')
    expect(baseLayer).toHaveAttribute('inert')
    const externalControls = screen.getByText('Interactive concept').closest('aside')
    expect(externalControls).toHaveAttribute('aria-hidden', 'true')
    expect(externalControls).toHaveAttribute('inert')
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toHaveAttribute('data-size', 'compact')
  })

  it('keeps one dialog shell through purchase and restores the opener when closed', () => {
    render(<CardBountyPrototype />)

    const opener = screen.getByRole('button', { name: 'Open Card Bounty' })
    opener.focus()
    fireEvent.click(opener)
    const dialogShell = screen.getByRole('dialog', { name: 'Card Bounty' })

    fireEvent.click(screen.getByRole('button', { name: 'Choose a Card' }))
    expect(screen.getByRole('dialog', { name: 'Choose a Card' })).toBe(dialogShell)

    fireEvent.click(screen.getByRole('button', { name: 'Select Whale Boat, Sinbad 8 of 9 Cards, 4 Stars, regular tradable' }))
    expect(screen.getByRole('dialog', { name: 'Confirm Target' })).toBe(dialogShell)

    fireEvent.click(screen.getByRole('button', { name: 'Select target' }))
    expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toBe(dialogShell)

    fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))
    expect(screen.getByRole('dialog', { name: 'Magical Chest' })).toBe(dialogShell)

    fireEvent.click(screen.getByRole('button', { name: 'Close Magical Chest' }))
    expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toBe(dialogShell)

    fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
    const chestOpening = screen.getByRole('dialog', { name: 'Duplicate Cards' })
    expect(chestOpening).toContainElement(document.activeElement as HTMLElement)
    const continueButton = screen.getByRole('button', { name: 'Continue' })
    continueButton.focus()
    expect(fireEvent.keyDown(chestOpening, { key: 'Tab' })).toBe(false)
    expect(continueButton).toHaveFocus()
    expect(fireEvent.keyDown(chestOpening, { key: 'Tab', shiftKey: true })).toBe(false)
    expect(continueButton).toHaveFocus()

    fireEvent.click(continueButton)
    const returnedBounty = screen.getByRole('dialog', { name: 'Card Bounty' })
    expect(returnedBounty).toContainElement(document.activeElement as HTMLElement)

    fireEvent.click(screen.getByRole('button', { name: 'Close Card Bounty' }))
    expect(opener).toHaveFocus()
  })

  it('adds a selectable alternative Card without awarding an unearned Collection reward', () => {
    render(<CardBountyPrototype />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Card Bounty' }))
    fireEvent.click(screen.getByRole('button', { name: 'Choose a Card' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select Bionica, Space Travel 7 of 9 Cards, 5 Stars, regular tradable' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select target' }))

    expect(screen.getByText('0/300')).toBeInTheDocument()
    for (let batch = 0; batch < 10; batch += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    }
    expect(screen.getByText('300/300 · Guaranteed Card unlocked')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add to Collection' }))

    expect(screen.getByRole('heading', { name: 'Space Travel — Card Added' })).toBeInTheDocument()
    expect(screen.queryByText('+10,000 Spins')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Return to Spin screen' }))
    expect(screen.getByRole('button', { name: 'Spin' })).toHaveFocus()
    expect(screen.getByRole('group', { name: 'Spin balance: 1,850' })).toBeInTheDocument()
    expect(screen.queryByText(/Collection reward:/)).not.toBeInTheDocument()
    expect(screen.getByText('Bounty Card added')).toBeInTheDocument()
    expect(screen.getByText('300,000,000')).toBeInTheDocument()
  })
})
