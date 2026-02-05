import type { ReactNode } from 'react'
import { WorkerOnboardingProvider } from '@/components/onboarding/worker-onboarding-context'
import { WorkerOnboardingShell } from '@/components/onboarding/worker-onboarding-shell'

export const metadata = {
  title: 'Cadastro do Trabalhador - TrampoJa',
}

const STEPS = [
  'Dados Pessoais',
  'Endereco',
  'Foto e Documento',
  'Habilidades',
  'Disponibilidade',
]

export default function WorkerOnboardingLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <WorkerOnboardingProvider>
      <div className="flex min-h-screen flex-col bg-muted-50">
        <header className="border-muted-200 border-b bg-white px-4 py-4">
          <h1 className="text-muted-900 text-center text-lg font-bold">
            Cadastro do Trabalhador
          </h1>
        </header>
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-8">
          <WorkerOnboardingShell steps={STEPS} />
          <main className="mt-6">{children}</main>
        </div>
      </div>
    </WorkerOnboardingProvider>
  )
}
