'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Stepper } from '@/components/onboarding/stepper'

interface WorkerOnboardingShellProps {
  steps: string[]
}

function getStepFromPathname(pathname: string): number {
  const match = pathname.match(/step-(\d+)/)
  if (match?.[1]) {
    const step = parseInt(match[1], 10)
    if (step >= 1 && step <= 5) {
      return step
    }
  }
  return 1
}

export function WorkerOnboardingShell({ steps }: WorkerOnboardingShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const currentStep = getStepFromPathname(pathname)

  function handleStepClick(step: number) {
    router.push(`/onboarding/worker/step-${step}`)
  }

  return (
    <Stepper
      steps={steps}
      currentStep={currentStep}
      onStepClick={handleStepClick}
    />
  )
}
