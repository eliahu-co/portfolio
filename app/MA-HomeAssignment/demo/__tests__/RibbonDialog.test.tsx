import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { RibbonDialog, RibbonFrame } from '../RibbonDialog'

describe('RibbonDialog', () => {
  it('renders one labelled dialog and closes on Escape', () => {
    const onClose = jest.fn()

    render(
      <RibbonDialog title="Card Bounty" onClose={onClose}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </RibbonDialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Card Bounty' })
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('wraps Tab and Shift+Tab within the dialog controls', () => {
    render(
      <RibbonDialog title="Card Bounty" onClose={jest.fn()}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </RibbonDialog>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Card Bounty' })
    const closeButton = screen.getByRole('button', { name: 'Close Card Bounty' })
    const lastButton = screen.getByRole('button', { name: 'Last' })

    lastButton.focus()
    fireEvent.keyDown(dialog, { key: 'Tab' })
    expect(closeButton).toHaveFocus()

    closeButton.focus()
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
    expect(lastButton).toHaveFocus()
  })

  it('restores the previously focused element only when it unmounts', () => {
    const opener = document.createElement('button')
    opener.type = 'button'
    opener.textContent = 'Open dialog'
    document.body.append(opener)
    opener.focus()

    const { rerender, unmount } = render(
      <RibbonDialog title="Card Bounty" onClose={() => undefined}>
        <button type="button">First</button>
      </RibbonDialog>,
    )

    const firstButton = screen.getByRole('button', { name: 'First' })
    firstButton.focus()

    rerender(
      <RibbonDialog title="Card Bounty" onClose={() => undefined}>
        <button type="button">First</button>
      </RibbonDialog>,
    )

    expect(firstButton).toHaveFocus()

    unmount()
    expect(opener).toHaveFocus()
    opener.remove()
  })

  it('exposes the selected size for dialog coordinators', () => {
    render(
      <RibbonDialog title="Card Bounty" size="tall" onClose={jest.fn()}>
        <p>Active Bounty</p>
      </RibbonDialog>,
    )

    expect(screen.getByRole('dialog', { name: 'Card Bounty' })).toHaveAttribute(
      'data-size',
      'tall',
    )
  })

  it('layers the purchase hero behind the readable title ribbon', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'app/MA-HomeAssignment/demo/RibbonDialog.module.css'),
      'utf8',
    )

    expect(css).toMatch(/\.ribbon\s*{[^}]*z-index:\s*2/)
    expect(css).toMatch(/\.purchase \.hero\s*{[^}]*z-index:\s*1/)
  })
})

describe('RibbonFrame', () => {
  it('renders a visible frame without dialog semantics', () => {
    render(
      <RibbonFrame title="Inactive Bounty">
        <p>Visible underlay</p>
      </RibbonFrame>,
    )

    expect(screen.getByRole('heading', { name: 'Inactive Bounty' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
