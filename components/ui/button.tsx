'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
        secondary:
          'bg-secondary-600 text-white hover:bg-secondary-700 focus-visible:ring-secondary-500',
        outline:
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500',
        ghost: 'text-muted-700 hover:bg-muted-100 focus-visible:ring-muted-400',
        destructive:
          'bg-destructive-600 text-white hover:bg-destructive-700 focus-visible:ring-destructive-500',
        link: 'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500 p-0 h-auto',
      },
      size: {
        sm: 'h-9 rounded-md px-3 text-sm',
        default: 'h-11 rounded-lg px-5 text-base',
        lg: 'h-13 rounded-lg px-8 text-lg',
        icon: 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    if (asChild) {
      // Simple Slot pattern: clone the child element with merged className
      // Expects a single React element as children
      const child = children as React.ReactElement<{
        className?: string
        [key: string]: unknown
      }>
      if (
        child &&
        typeof child === 'object' &&
        'props' in child &&
        typeof child.type !== 'string'
      ) {
        const { className: childClassName, ...childProps } = child.props
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <child.type
            {...childProps}
            className={cn(
              buttonVariants({ variant, size }),
              className,
              childClassName,
            )}
            ref={ref}
          />
        )
      }
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && <SpinnerIcon className="h-4 w-4" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
