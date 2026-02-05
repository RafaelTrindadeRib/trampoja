'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import {
  useWorkerOnboarding,
  type SkillType,
} from '@/components/onboarding/worker-onboarding-context'
import {
  RepositorIcon,
  CaixaIcon,
  EstoquistaIcon,
  LimpezaIcon,
  PromotorIcon,
  AtendenteIcon,
  EmpacotadorIcon,
  AuxiliarCozinhaIcon,
  BalconistaIcon,
  OutroIcon,
} from '@/components/onboarding/skill-icons'
import type { ComponentType } from 'react'

interface SkillOption {
  value: SkillType
  label: string
  icon: ComponentType<{ className?: string }>
}

const SKILL_OPTIONS: SkillOption[] = [
  { value: 'REPOSITOR', label: 'Repositor', icon: RepositorIcon },
  { value: 'CAIXA', label: 'Caixa', icon: CaixaIcon },
  { value: 'ESTOQUISTA', label: 'Estoquista', icon: EstoquistaIcon },
  { value: 'LIMPEZA', label: 'Limpeza', icon: LimpezaIcon },
  { value: 'PROMOTOR', label: 'Promotor', icon: PromotorIcon },
  { value: 'ATENDENTE', label: 'Atendente', icon: AtendenteIcon },
  { value: 'EMPACOTADOR', label: 'Empacotador', icon: EmpacotadorIcon },
  {
    value: 'AUXILIAR_COZINHA',
    label: 'Aux. Cozinha',
    icon: AuxiliarCozinhaIcon,
  },
  { value: 'BALCONISTA', label: 'Balconista', icon: BalconistaIcon },
  { value: 'OUTRO', label: 'Outro', icon: OutroIcon },
]

export default function WorkerOnboardingStep4() {
  const router = useRouter()
  const { data, updateData } = useWorkerOnboarding()
  const [selected, setSelected] = useState<SkillType[]>(data.skills ?? [])
  const [error, setError] = useState<string | null>(null)

  function toggleSkill(skill: SkillType) {
    setError(null)
    setSelected((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  function handleNext() {
    if (selected.length === 0) {
      setError('Selecione pelo menos 1 habilidade.')
      return
    }
    updateData({ skills: selected })
    router.push('/onboarding/worker/step-5')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-muted-900 text-lg font-semibold">Habilidades</h2>
        <p className="text-muted-500 text-sm">
          Selecione as funcoes que voce pode exercer.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {SKILL_OPTIONS.map(({ value, label, icon: Icon }) => {
              const isSelected = selected.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleSkill(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                    isSelected
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-muted-200 bg-white text-muted-600 hover:border-primary-300 hover:bg-primary-50/50',
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-center text-sm font-medium">
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          <p className="text-muted-500 text-sm">
            {selected.length} selecionada{selected.length !== 1 ? 's' : ''}
          </p>

          {error && (
            <p className="text-destructive-600 text-sm" role="alert">
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/worker/step-3')}
            >
              Voltar
            </Button>
            <Button type="button" onClick={handleNext}>
              Proximo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
