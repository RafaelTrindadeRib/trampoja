'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

function SearchIcon({ className }: { className?: string }) {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
      />
    </svg>
  )
}

export type InputVariant = 'default' | 'search'

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'prefix'
> {
  label?: string
  error?: string
  variant?: InputVariant
  prefix?: ReactNode
  suffix?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      variant = 'default',
      prefix,
      suffix,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || props.name || undefined
    const errorId = error && inputId ? `${inputId}-error` : undefined

    const isSearch = variant === 'search'
    const hasPrefix = isSearch || !!prefix

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-muted-700 text-sm font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {hasPrefix && (
            <span className="text-muted-400 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
              {isSearch ? <SearchIcon className="h-5 w-5" /> : prefix}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'border-muted-300 text-muted-900 placeholder:text-muted-400 flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-base transition-colors',
              'focus:border-primary-500 focus:ring-primary-500/20 focus:ring-2 focus:outline-none',
              'disabled:bg-muted-50 disabled:cursor-not-allowed disabled:opacity-50',
              error &&
                'border-destructive-500 focus:border-destructive-500 focus:ring-destructive-500/20',
              hasPrefix && 'pl-10',
              suffix && 'pr-10',
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
          />
          {suffix && (
            <span className="text-muted-400 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              {suffix}
            </span>
          )}
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
Input.displayName = 'Input'

export { Input }
