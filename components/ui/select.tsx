'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  )
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id || props.name || undefined
    const errorId = error && selectId ? `${selectId}-error` : undefined

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-muted-700 text-sm font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'border-muted-300 text-muted-900 flex h-11 w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-base transition-colors',
              'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none',
              'disabled:bg-muted-50 disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-destructive-500 focus:border-destructive-500 focus:ring-destructive-500/20',
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
          >
            {children}
          </select>
          <span className="text-muted-400 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <ChevronDownIcon className="h-5 w-5" />
          </span>
        </div>
        {error && (
          <p id={errorId} className="text-destructive-600 text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select }
