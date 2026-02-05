import { type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        success: 'bg-success-50 text-success-600',
        warning: 'bg-warning-50 text-warning-600',
        error: 'bg-destructive-50 text-destructive-600',
        info: 'bg-secondary-50 text-secondary-600',
        neutral: 'bg-muted-100 text-muted-600',
      },
      size: {
        sm: 'rounded-md px-2 py-0.5 text-xs',
        default: 'rounded-md px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
