import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
  required?: boolean
  description?: string
  className?: string
  htmlFor?: string
}

function FormField({
  label,
  error,
  children,
  required,
  description,
  className,
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-muted-700 text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {description && <p className="text-muted-500 text-sm">{description}</p>}
      {children}
      {error && (
        <p className="text-destructive-600 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
FormField.displayName = 'FormField'

export { FormField }
