'use client'

import {
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/utils/cn'

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  )
}

type ModalSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: ModalSize
  className?: string
}

function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Basic focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Focus the dialog on open
      requestAnimationFrame(() => {
        dialogRef.current?.focus()
      })

      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Restore focus when closing
      previousFocusRef.current?.focus()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in fixed inset-0 bg-black/50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'animate-in fade-in slide-in-from-bottom-4 relative z-10 w-full rounded-xl bg-white shadow-xl transition-all duration-200',
          sizeClasses[size],
          className,
        )}
      >
        {/* Header */}
        {title && (
          <div className="border-muted-200 flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-muted-900 text-lg font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-400 hover:bg-muted-100 hover:text-muted-600 focus-visible:ring-primary-500 rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Fechar"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Close button when there is no title */}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-400 hover:bg-muted-100 hover:text-muted-600 focus-visible:ring-primary-500 absolute top-3 right-3 rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Fechar"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
Modal.displayName = 'Modal'

export { Modal }
