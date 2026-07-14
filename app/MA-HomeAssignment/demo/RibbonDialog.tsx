'use client'

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
} from 'react'
import styles from './RibbonDialog.module.css'

export type RibbonDialogSize = 'compact' | 'tall' | 'purchase'

export type RibbonFrameProps = {
  title: string
  size?: RibbonDialogSize
  hero?: ReactNode
  closeControl?: ReactNode
  children: ReactNode
  className?: string
}

export type RibbonDialogProps = Omit<RibbonFrameProps, 'closeControl'> & {
  onClose: () => void
  closeLabel?: string
}

type RibbonFrameContentProps = RibbonFrameProps & {
  titleId: string
}

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

function RibbonFrameContent({
  title,
  titleId,
  size = 'compact',
  hero,
  closeControl,
  children,
  className,
}: RibbonFrameContentProps) {
  const frameClassName = [styles.frame, styles[size], className].filter(Boolean).join(' ')

  return (
    <div className={frameClassName}>
      {hero ? <div className={styles.hero}>{hero}</div> : null}
      {closeControl ? <div className={styles.closeControl}>{closeControl}</div> : null}
      <div className={styles.ribbon}>
        <h2 className={styles.title} id={titleId}>
          {title}
        </h2>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export function RibbonFrame(props: RibbonFrameProps) {
  const titleId = useId()

  return <RibbonFrameContent {...props} titleId={titleId} />
}

export function RibbonDialog({
  title,
  size = 'compact',
  hero,
  children,
  className,
  onClose,
  closeLabel = `Close ${title}`,
}: RibbonDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = dialogRef.current
    const initialFocusTarget = dialog ? getFocusableElements(dialog)[0] : null

    if (initialFocusTarget) {
      initialFocusTarget.focus()
    } else {
      dialog?.focus()
    }

    return () => {
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus()
      }
    }
  }, [])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

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

  return (
    <div className={styles.scrim}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.dialog}
        data-size={size}
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <RibbonFrameContent
          className={className}
          closeControl={
            <button
              aria-label={closeLabel}
              className={styles.closeButton}
              onClick={onClose}
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          }
          hero={hero}
          size={size}
          title={title}
          titleId={titleId}
        >
          {children}
        </RibbonFrameContent>
      </div>
    </div>
  )
}
