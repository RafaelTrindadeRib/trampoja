'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export interface MarketFormData {
  cnpj: string
  legalName: string
  tradeName: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  lat: number
  lng: number
  photoUrl: string
  bannerUrl: string
  responsibleName: string
  phone: string
  email: string
}

const DEFAULT_FORM_DATA: MarketFormData = {
  cnpj: '',
  legalName: '',
  tradeName: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  lat: 0,
  lng: 0,
  photoUrl: '',
  bannerUrl: '',
  responsibleName: '',
  phone: '',
  email: '',
}

interface MarketOnboardingContextValue {
  formData: MarketFormData
  updateFormData: (data: Partial<MarketFormData>) => void
  resetFormData: () => void
}

const MarketOnboardingContext =
  createContext<MarketOnboardingContextValue | null>(null)

export function MarketOnboardingProvider({
  children,
}: {
  children: ReactNode
}) {
  const [formData, setFormData] = useState<MarketFormData>(DEFAULT_FORM_DATA)

  const updateFormData = useCallback((data: Partial<MarketFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }, [])

  const resetFormData = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA)
  }, [])

  return (
    <MarketOnboardingContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </MarketOnboardingContext.Provider>
  )
}

export function useMarketOnboarding(): MarketOnboardingContextValue {
  const context = useContext(MarketOnboardingContext)
  if (!context) {
    throw new Error(
      'useMarketOnboarding deve ser usado dentro de MarketOnboardingProvider',
    )
  }
  return context
}
