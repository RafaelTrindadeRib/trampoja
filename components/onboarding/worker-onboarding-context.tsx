'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type PeriodPreference = 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL'

export type SkillType =
  | 'REPOSITOR'
  | 'CAIXA'
  | 'ESTOQUISTA'
  | 'LIMPEZA'
  | 'PROMOTOR'
  | 'ATENDENTE'
  | 'EMPACOTADOR'
  | 'AUXILIAR_COZINHA'
  | 'BALCONISTA'
  | 'OUTRO'

export interface WorkerOnboardingData {
  firstName: string
  lastName: string
  cpf: string
  dateOfBirth: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  lat: number
  lng: number
  searchRadius: number
  minHourlyRate: number
  skills: SkillType[]
  periodPreference: PeriodPreference
  photoUrl: string
  documentUrl: string
}

interface WorkerOnboardingContextValue {
  data: Partial<WorkerOnboardingData>
  updateData: (partial: Partial<WorkerOnboardingData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  isSubmitting: boolean
  setIsSubmitting: (v: boolean) => void
}

const WorkerOnboardingContext =
  createContext<WorkerOnboardingContextValue | null>(null)

export function WorkerOnboardingProvider({
  children,
}: {
  children: ReactNode
}) {
  const [data, setData] = useState<Partial<WorkerOnboardingData>>({
    searchRadius: 10,
    minHourlyRate: 15,
    skills: [],
    periodPreference: 'INTEGRAL',
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = useCallback(
    (partial: Partial<WorkerOnboardingData>) => {
      setData((prev) => ({ ...prev, ...partial }))
    },
    [],
  )

  const value = useMemo(
    () => ({
      data,
      updateData,
      currentStep,
      setCurrentStep,
      isSubmitting,
      setIsSubmitting,
    }),
    [data, updateData, currentStep, isSubmitting],
  )

  return (
    <WorkerOnboardingContext.Provider value={value}>
      {children}
    </WorkerOnboardingContext.Provider>
  )
}

export function useWorkerOnboarding(): WorkerOnboardingContextValue {
  const context = useContext(WorkerOnboardingContext)
  if (!context) {
    throw new Error(
      'useWorkerOnboarding deve ser usado dentro de WorkerOnboardingProvider',
    )
  }
  return context
}
