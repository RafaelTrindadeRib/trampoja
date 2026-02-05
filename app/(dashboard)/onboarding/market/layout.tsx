import type { ReactNode } from 'react'
import { MarketOnboardingProvider } from '@/components/onboarding/market-onboarding-context'
import { MarketOnboardingShell } from '@/components/onboarding/market-onboarding-shell'

export const metadata = {
  title: 'Cadastro do Estabelecimento - TrampoJa',
}

const STEPS = ['Dados da Empresa', 'Endereco', 'Fotos', 'Contato']

export default function MarketOnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <MarketOnboardingProvider>
      <div className="flex min-h-screen flex-col bg-muted-50">
        <header className="border-muted-200 border-b bg-white px-4 py-4">
          <h1 className="text-muted-900 text-center text-lg font-bold">
            Cadastro do Estabelecimento
          </h1>
        </header>
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-8">
          <MarketOnboardingShell steps={STEPS} />
          <main className="mt-6">{children}</main>
        </div>
      </div>
    </MarketOnboardingProvider>
  )
}
