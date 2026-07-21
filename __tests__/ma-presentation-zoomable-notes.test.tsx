import { act, fireEvent, render } from '@testing-library/react'
import { ZoomableNotes } from '@/app/MA-HomeAssignment/presentation/components/ZoomableNotes'

// jsdom has no layout, so the frame reports a zero-sized box and every pan
// would clamp to nothing. The viewer reads its own size to decide how far the
// board may travel, so the size is supplied here.
const FRAME = { width: 1120, height: 600 }

function renderViewer(active = true) {
  const view = render(<ZoomableNotes src="/coinmaster/approach-notes.webp" alt="Research notes" active={active} />)
  const frame = view.container.querySelector('[data-notes-viewer="true"]') as HTMLElement
  frame.getBoundingClientRect = () => ({
    x: 0, y: 0, left: 0, top: 0, right: FRAME.width, bottom: FRAME.height,
    width: FRAME.width, height: FRAME.height, toJSON: () => ({}),
  })
  const canvas = view.container.querySelector('[data-notes-canvas]') as HTMLElement
  return { ...view, frame, canvas }
}

// jsdom ships no PointerEvent constructor, so fireEvent.pointerDown loses the
// init it is given and the handler reads an undefined button. Building the
// event by hand puts the fields React reads back on it.
const pointer = (frame: HTMLElement, type: 'down' | 'move' | 'up', props: Record<string, number>) =>
  act(() => {
    const event = new Event(`pointer${type}`, { bubbles: true, cancelable: true })
    Object.assign(event, props)
    frame.dispatchEvent(event)
  })

const scaleOf = (frame: HTMLElement) => Number(frame.getAttribute('data-notes-scale'))
const translateOf = (canvas: HTMLElement) => {
  const match = canvas.style.transform.match(/translate\((-?[\d.]+)px, (-?[\d.]+)px\)/)
  return { x: Number(match?.[1]), y: Number(match?.[2]) }
}
// The frame binds wheel natively so it can preventDefault, which puts the
// update outside React's event system — act() is what flushes it before the
// assertion reads the DOM.
const wheel = (frame: HTMLElement, deltaY: number, clientX = FRAME.width / 2, clientY = FRAME.height / 2) =>
  act(() => {
    frame.dispatchEvent(new WheelEvent('wheel', { deltaY, clientX, clientY, bubbles: true, cancelable: true }))
  })

describe('Approach notes viewer', () => {
  it('serves the whole file eagerly rather than a display-sized thumbnail', () => {
    const { frame } = renderViewer()
    const img = frame.querySelector('img')!
    // next/image would size its candidate from the unzoomed box and zoom would
    // magnify that thumbnail; the src must stay the untouched file
    expect(img).toHaveAttribute('src', '/coinmaster/approach-notes.webp')
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img.getAttribute('src')).not.toContain('/_next/image')
  })

  it('zooms in on scroll up and back out on scroll down', () => {
    const { frame } = renderViewer()
    expect(scaleOf(frame)).toBe(1)
    expect(frame).toHaveAttribute('data-notes-zoomed', 'false')

    wheel(frame, -240)
    const zoomed = scaleOf(frame)
    expect(zoomed).toBeGreaterThan(1)
    expect(frame).toHaveAttribute('data-notes-zoomed', 'true')

    wheel(frame, 240)
    expect(scaleOf(frame)).toBeCloseTo(1, 5)
  })

  it('holds the scale between 1x and 4x', () => {
    const { frame } = renderViewer()
    for (let i = 0; i < 40; i++) wheel(frame, -240)
    expect(scaleOf(frame)).toBe(4)
    for (let i = 0; i < 60; i++) wheel(frame, 240)
    expect(scaleOf(frame)).toBe(1)
    // fully zoomed out the board is pinned, so there is nothing to drag
    expect(translateOf(frame.querySelector('[data-notes-canvas]') as HTMLElement)).toEqual({ x: 0, y: 0 })
  })

  it('keeps the point under the cursor in place while zooming', () => {
    const { frame, canvas } = renderViewer()
    // zoom about a point left of centre: the board has to move right to hold it
    wheel(frame, -240, FRAME.width * 0.25, FRAME.height / 2)
    expect(scaleOf(frame)).toBeGreaterThan(1)
    expect(translateOf(canvas).x).toBeGreaterThan(0)
  })

  it('pans on drag once zoomed, and never past the board edge', () => {
    const { frame, canvas } = renderViewer()
    for (let i = 0; i < 10; i++) wheel(frame, -240)
    const scale = scaleOf(frame)
    expect(scale).toBeGreaterThan(1)

    pointer(frame, 'down', { pointerId: 1, button: 0, clientX: 500, clientY: 300 })
    pointer(frame, 'move', { pointerId: 1, clientX: 560, clientY: 340 })
    const moved = translateOf(canvas)
    expect(moved).toEqual({ x: 60, y: 40 })
    pointer(frame, 'up', { pointerId: 1 })

    // a drag beyond the overflow is held at exactly the overflow
    pointer(frame, 'down', { pointerId: 2, button: 0, clientX: 500, clientY: 300 })
    pointer(frame, 'move', { pointerId: 2, clientX: 99999, clientY: 99999 })
    const limit = translateOf(canvas)
    pointer(frame, 'up', { pointerId: 2 })

    expect(limit.x).toBeCloseTo((FRAME.width * scale - FRAME.width) / 2, 5)
    expect(limit.y).toBeCloseTo((FRAME.height * scale - FRAME.height) / 2, 5)
    expect(moved.x).toBeLessThan(limit.x)
  })

  it('resets on double click and when the step is left', () => {
    const { frame, canvas, rerender } = renderViewer()
    for (let i = 0; i < 6; i++) wheel(frame, -240)
    expect(scaleOf(frame)).toBeGreaterThan(1)

    fireEvent.doubleClick(frame)
    expect(scaleOf(frame)).toBe(1)
    expect(translateOf(canvas)).toEqual({ x: 0, y: 0 })

    for (let i = 0; i < 6; i++) wheel(frame, -240)
    expect(scaleOf(frame)).toBeGreaterThan(1)
    rerender(<ZoomableNotes src="/coinmaster/approach-notes.webp" alt="Research notes" active={false} />)
    expect(scaleOf(frame)).toBe(1)
  })

  it('swallows the wheel event so the deck does not scroll behind it', () => {
    const { frame } = renderViewer()
    const event = new WheelEvent('wheel', { deltaY: -240, clientX: 10, clientY: 10, bubbles: true, cancelable: true })
    act(() => { frame.dispatchEvent(event) })
    expect(event.defaultPrevented).toBe(true)
  })
})
