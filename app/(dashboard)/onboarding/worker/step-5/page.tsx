'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import {
  useWorkerOnboarding,
  type PeriodPreference,
} from '@/components/onboarding/worker-onboarding-context'

const PERIOD_OPTIONS: { value: PeriodPreference; label: string }[] = [
  { value: 'MANHA', label: 'Manha' },
  { value: 'TARDE', label: 'Tarde' },
  { value: 'NOITE', label: 'Noite' },
  { value: 'INTEGRAL', label: 'Integral' },
]

const SKILL_LABELS: Record<string, string> = {
  REPOSITOR: 'Repositor',
  CAIXA: 'Caixa',
  ESTOQUISTA: 'Estoquista',
  LIMPEZA: 'Limpeza',
  PROMOTOR: 'Promotor',
  ATENDENTE: 'Atendente',
  EMPACOTADOR: 'Empacotador',
  AUXILIAR_COZINHA: 'Aux. Cozinha',
  BALCONISTA: 'Balconista',
  OUTRO: 'Outro',
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  )
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      />
    </svg>
  )
}

export default function WorkerOnboardingStep5() {
  const router = useRouter()
  const { data, updateData, isSubmitting, setIsSubmitting } =
    useWorkerOnboarding()
  const [rate, setRate] = useState(data.minHourlyRate ?? 15)
  const [period, setPeriod] = useState<PeriodPreference>(
    data.periodPreference ?? 'INTEGRAL',
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRate(Number(e.target.value))
  }

  async function handleSubmit() {
    setSubmitError(null)
    setIsSubmitting(true)

    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      cpf: data.cpf,
      dateOfBirth: data.dateOfBirth,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      lat: data.lat ?? -23.5505,
      lng: data.lng ?? -46.6333,
      searchRadius: data.searchRadius ?? 10,
      minHourlyRate: rate,
      skills: data.skills ?? [],
    }

    try {
      const response = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(
          (body as { error?: string } | null)?.error ??
            'Erro ao finalizar cadastro',
        )
      }

      updateData({ minHourlyRate: rate, periodPreference: period })
      router.push('/worker/dashboard')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao finalizar cadastro'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <h2 className="text-muted-900 text-lg font-semibold">
            Disponibilidade e Valor
          </h2>
          <p className="text-muted-500 text-sm">
            Defina seu valor por hora e preferencia de horario.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="minHourlyRate"
                className="text-muted-700 text-sm font-medium"
              >
                Valor minimo por hora: R$ {rate},00
              </label>
              <input
                id="minHourlyRate"
                type="range"
                min={8}
                max={50}
                step={1}
                value={rate}
                onChange={handleRateChange}
                className="accent-primary-600 h-2 w-full cursor-pointer rounded-lg"
              />
              <div className="text-muted-400 flex justify-between text-xs">
                <span>R$ 8</span>
                <span>R$ 50</span>
              </div>
            </div>

            <fieldset>
              <legend className="text-muted-700 mb-2 text-sm font-medium">
                Preferencia de periodo
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {PERIOD_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      'flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors',
                      period === opt.value
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-muted-200 text-muted-600 hover:border-primary-300',
                    )}
                  >
                    <input
                      type="radio"
                      name="periodPreference"
                      value={opt.value}
                      checked={period === opt.value}
                      onChange={() => setPeriod(opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-muted-900 text-lg font-semibold">
            Resumo do Perfil
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {data.photoUrl ? (
                <Image
                  src={data.photoUrl}
                  alt="Foto de perfil"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="bg-muted-100 flex h-16 w-16 items-center justify-center rounded-full">
                  <UserIcon className="text-muted-400 h-8 w-8" />
                </div>
              )}
              <div>
                <p className="text-muted-900 font-semibold">
                  {data.firstName} {data.lastName}
                </p>
                <p className="text-muted-500 text-sm">
                  {data.city}
                  {data.state ? `, ${data.state}` : ''}
                </p>
              </div>
            </div>

            <div className="border-muted-200 grid grid-cols-2 gap-3 border-t pt-4">
              <div>
                <p className="text-muted-500 text-xs">Valor/hora</p>
                <p className="text-muted-900 font-semibold">R$ {rate},00</p>
              </div>
              <div>
                <p className="text-muted-500 text-xs">Raio de busca</p>
                <p className="text-muted-900 font-semibold">
                  {data.searchRadius ?? 10} km
                </p>
              </div>
              <div>
                <p className="text-muted-500 text-xs">Periodo</p>
                <p className="text-muted-900 font-semibold">
                  {PERIOD_OPTIONS.find((o) => o.value === period)?.label}
                </p>
              </div>
            </div>

            {data.skills && data.skills.length > 0 && (
              <div className="border-muted-200 border-t pt-4">
                <p className="text-muted-500 mb-2 text-xs">Habilidades</p>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill) => (
                    <Badge key={skill} variant="success" size="sm">
                      {SKILL_LABELS[skill] ?? skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <div className="bg-destructive-50 flex items-start gap-3 rounded-lg p-4">
          <AlertIcon className="text-destructive-600 mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-destructive-700 text-sm">{submitError}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/onboarding/worker/step-4')}
        >
          Voltar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Finalizar Cadastro
        </Button>
      </div>
    </div>
  )
}
