import { fireEvent, render, screen, within } from '@testing-library/react'
import { TargetConfirmation } from '../CardBountyPanel'
import CardBountyPrototype from '../CardBountyPrototype'
import { TARGETS } from '../demoData'

describe('Card Bounty prototype happy path', () => {
  it('completes the deterministic economy loop and can restart', () => {
    render(<CardBountyPrototype />)
    const prototypeControls = screen.getByText('Interactive concept').closest('aside') as HTMLElement

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    expect(screen.getByText('Tap the shaking Card Bounty event')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open Card Bounty' }))

    expect(screen.queryByText('Coin Chests only')).not.toBeInTheDocument()
    expect(screen.getByText('Guaranteed when meter is complete!')).toBeInTheDocument()

    const chooseCard = screen.getByRole('button', { name: 'Choose a Card' })
    expect(chooseCard).toHaveClass('attention')
    chooseCard.focus()
    fireEvent.click(chooseCard)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const pickerDialog = screen.getByRole('dialog', { name: 'Choose a Card' })
    expect(pickerDialog).toHaveAttribute('data-size', 'tall')
    expect(pickerDialog).toContainElement(document.activeElement as HTMLElement)

    const whaleBoat = screen.getByRole('button', { name: 'Select Whale Boat, Sinbad 8 of 9 Cards, 4 Stars, regular tradable' })
    expect(whaleBoat).toHaveClass('attention')
    whaleBoat.focus()
    fireEvent.click(whaleBoat)
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const confirmationDialog = screen.getByRole('dialog', { name: 'Confirm Target' })
    expect(confirmationDialog).toHaveAttribute('data-size', 'compact')
    expect(confirmationDialog).toContainElement(document.activeElement as HTMLElement)

    const selectTarget = screen.getByRole('button', { name: 'Select target' })
    expect(selectTarget).toHaveClass('attention')
    selectTarget.focus()
    fireEvent.click(selectTarget)

    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    const bountyDialog = screen.getByRole('dialog', { name: 'Card Bounty' })
    expect(bountyDialog).toHaveAttribute('data-size', 'tall')
    expect(bountyDialog).toContainElement(document.activeElement as HTMLElement)
    expect(screen.getByRole('progressbar', { name: 'Bounty progress' })).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('0/100')).toBeInTheDocument()
    expect(within(prototypeControls).getByText('Buy Chests to progress the meter')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Wooden Chest, 5.2M Coins, 2 Cards per Chest, +1 Bounty progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Golden Chest, 16M Coins, 4 Cards per Chest, +2 Bounty progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' })).toHaveClass('attention')
    expect(bountyDialog.querySelector('img[src="/coinmaster/card-bounty/wooden-chest.webp"]')).toBeInTheDocument()
    expect(bountyDialog.querySelector('img[src="/coinmaster/card-bounty/golden-chest.webp"]')).toBeInTheDocument()
    expect(bountyDialog.querySelector('img[src="/coinmaster/card-bounty/magical-chest.webp"]')).toBeInTheDocument()

    for (let batch = 1; batch <= 4; batch += 1) {
      const expectedProgress = Math.min(batch * 30, 100)
      const expectedGain = batch === 4 ? 10 : 30
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
      expect(screen.getByText(`+${expectedGain}`)).toBeInTheDocument()
      expect(screen.queryByRole('progressbar', { name: 'Current Bounty progress' })).not.toBeInTheDocument()
      expect(screen.getByRole('progressbar', { name: 'Projected Bounty progress' })).toHaveAttribute(
        'aria-valuenow',
        String(expectedProgress),
      )
      const underlay = screen.getByTestId('active-bounty-underlay')
      expect(underlay).toHaveAttribute('aria-hidden', 'true')
      expect(underlay).toHaveAttribute('inert')

      const confirmPurchase = screen.getByRole('button', { name: 'Confirm Chest purchase' })
      expect(confirmPurchase).toHaveClass('attention')
      fireEvent.click(confirmPurchase)
      const chestOpening = screen.getByRole('dialog', { name: 'Duplicate Cards' })
      expect(chestOpening.querySelector('img[src="/coinmaster/card-bounty/generated/magical-chest-open.webp"]')).toBeInTheDocument()
      expect(screen.getByText('10 Chests · 80 Cards · 3 shown')).toBeInTheDocument()
      expect(screen.getAllByText('Duplicate')).toHaveLength(3)
      expect(screen.getByText(`+${expectedGain} Bounty progress`)).toBeInTheDocument()
      expect(within(prototypeControls).getByText('Continue')).toBeInTheDocument()
      const continueButton = screen.getByRole('button', { name: 'Continue' })
      expect(continueButton).toHaveClass('attention')
      fireEvent.click(continueButton)

      if (batch < 4) {
        expect(screen.getByText(`${expectedProgress}/100`)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Change target' })).toBeEnabled()
        expect(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' })).toHaveClass('attention')
      }
    }

    expect(screen.getByRole('heading', { name: 'Bounty Complete' })).toBeInTheDocument()
    expect(within(prototypeControls).getByText('Collect your target Card')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to Collection' })).toHaveClass('attention')
    fireEvent.click(screen.getByRole('button', { name: 'Add to Collection' }))
    expect(screen.getByRole('heading', { name: 'Sinbad — Collection Completed' })).toBeInTheDocument()
    const collectionComplete = screen.getByRole('dialog', { name: 'Sinbad — Collection Completed' })
    expect(
      collectionComplete.querySelector('path[d="m13.6 2-8 11h5.2L9.7 22l8.7-12h-5.3L13.6 2Z"]'),
    ).toBeInTheDocument()
    expect(
      collectionComplete.querySelector('path[d="m18 3.5 4 8.1 9 .9-6.5 6.3 1.7 8.8-8.2-4.3-8.2 4.3 1.7-8.8L5 12.5l9-.9 4-8.1Z"]'),
    ).not.toBeInTheDocument()
    expect(prototypeControls).not.toHaveClass('prototypeControlsFinal')
    expect(screen.getByRole('button', { name: 'Collect 2,500 Spins' })).toHaveClass('attention')
    fireEvent.click(screen.getByRole('button', { name: 'Collect 2,500 Spins' }))

    const reels = screen.getByRole('region', { name: 'Slot machine reels' })
    expect(within(reels).getAllByRole('img')).toHaveLength(9)
    expect(screen.getByRole('group', { name: 'Coin balance: 2,040,000,000' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Spin balance: 4,350' })).toBeInTheDocument()
    const spin = screen.getByRole('button', { name: 'Spin' })
    expect(spin).toHaveFocus()
    expect(prototypeControls).toHaveClass('prototypeControlsFinal')
    const gameViewport = screen.getByRole('region', { name: 'Card Bounty game prototype' })
    expect(within(gameViewport).getAllByRole('button')).toEqual([spin])
    expect(within(gameViewport).queryByRole('link')).not.toBeInTheDocument()
    const homeAssignment = screen.getByRole('link', { name: 'Home assignment' })
    const restart = screen.getByRole('button', { name: 'Restart demo' })
    expect(homeAssignment).toHaveClass('homeLink')
    expect(restart).toHaveClass('restartButton')
    expect(spin).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('Collection reward: +2,500 Spins')).toBeInTheDocument()
    expect(screen.getByText('2,040,000,000')).toBeInTheDocument()
    fireEvent.click(spin)
    expect(spin).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('You finished the demo!')).toBeInTheDocument()
    expect(within(gameViewport).queryByRole('button', { name: 'Cards Center' })).not.toBeInTheDocument()
    fireEvent.click(restart)

    expect(screen.getByRole('heading', { name: 'Cards Center' })).toBeInTheDocument()
    expect(screen.getByText('Tap the shaking Card Bounty event')).toBeInTheDocument()
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

    expect(screen.getByText('0/100')).toBeInTheDocument()
    for (let batch = 0; batch < 4; batch += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))
      fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
      fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    }
    expect(screen.getByText('100/100 · Guaranteed Card unlocked')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Add to Collection' }))

    expect(screen.getByRole('heading', { name: 'Space Travel — Card Added' })).toBeInTheDocument()
    expect(screen.queryByText('+10,000 Spins')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Return to Spin screen' }))
    expect(screen.getByRole('button', { name: 'Spin' })).toHaveFocus()
    expect(screen.getByRole('group', { name: 'Spin balance: 1,850' })).toBeInTheDocument()
    expect(screen.queryByText(/Collection reward:/)).not.toBeInTheDocument()
    expect(screen.getByText('Bounty Card added')).toBeInTheDocument()
    expect(screen.getByText('2,040,000,000')).toBeInTheDocument()
  })

  it('warns before changing targets and resets progress only after confirmation', () => {
    render(<CardBountyPrototype />)
    fireEvent.click(screen.getByRole('button', { name: 'Open Card Bounty' }))
    fireEvent.click(screen.getByRole('button', { name: 'Choose a Card' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select Whale Boat, Sinbad 8 of 9 Cards, 4 Stars, regular tradable' }))
    fireEvent.click(screen.getByRole('button', { name: 'Select target' }))
    fireEvent.click(screen.getByRole('button', { name: 'Buy Magical Chest, 29M Coins, 8 Cards per Chest, +3 Bounty progress' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Chest purchase' }))
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('30/100')).toBeInTheDocument()
    const changeTarget = screen.getByRole('button', { name: 'Change target' })
    expect(changeTarget).toBeEnabled()
    fireEvent.click(changeTarget)

    expect(screen.getByRole('dialog', { name: 'Change Target?' })).toBeInTheDocument()
    expect(screen.getByText(/all Bounty progress will be lost/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Keep current target' }))
    expect(screen.getByText('30/100')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Change target' }))
    const confirmChange = screen.getByRole('button', { name: 'Lose progress and change target' })
    expect(confirmChange).not.toHaveClass('attention')
    fireEvent.click(confirmChange)
    expect(screen.getByRole('dialog', { name: 'Choose a Card' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Select Bionica, Space Travel 7 of 9 Cards, 5 Stars, regular tradable' }))
    expect(screen.getByText('Required Bounty progress')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})

describe('TargetConfirmation', () => {
  it('renders the reducer-owned threshold instead of the target default', () => {
    render(
      <TargetConfirmation
        target={TARGETS[0]}
        threshold={123}
        countdown={85_272}
        onBack={jest.fn()}
        onSelect={jest.fn()}
      />,
    )

    const requiredProgress = screen.getByText('Required Bounty progress').parentElement
    expect(requiredProgress).toHaveTextContent('123')
    expect(requiredProgress).not.toHaveTextContent('100')
  })
})
