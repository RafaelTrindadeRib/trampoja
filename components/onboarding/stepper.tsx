'use client'

import { cn } from '@/lib/utils/cn'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  )
}

export interface StepperProps {
  steps: string[]
  currentStep: number
  onStepClick?: (step: number) => void
}

function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progresso do cadastro" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isClickable = onStepClick && isCompleted

          return (
            <li
              key={label}
              className={cn(
                'relative flex flex-1 flex-col items-center',
                index < steps.length - 1 &&
                  'after:absolute after:left-[calc(50%+20px)] after:top-5 after:h-0.5 after:w-[calc(100%-40px)] after:content-[""]',
                index < steps.length - 1 &&
                  isCompleted &&
                  'after:bg-primary-600',
                index < steps.length - 1 &&
                  !isCompleted &&
                  'after:bg-muted-200',
              )}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(stepNumber)}
                className={cn(
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  isCompleted &&
                    'border-primary-600 bg-primary-600 text-white',
                  isCurrent &&
                    'border-primary-600 bg-white text-primary-600',
                  !isCompleted &&
                    !isCurrent &&
                    'border-muted-300 bg-white text-muted-400',
                  isClickable &&
                    'cursor-pointer hover:border-primary-700 hover:bg-primary-700',
                  !isClickable && 'cursor-default',
                )}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Passo ${stepNumber}: ${label}`}
              >
                {isCompleted ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  stepNumber
                )}
              </button>
              <span
                className={cn(
                  'mt-2 text-center text-xs font-medium',
                  isCurrent && 'text-primary-700',
                  isCompleted && 'text-primary-600',
                  !isCurrent && !isCompleted && 'text-muted-400',
                )}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
Stepper.displayName = 'Stepper'

export { Stepper }
