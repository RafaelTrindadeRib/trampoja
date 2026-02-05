'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMarketOnboarding } from '@/components/onboarding/market-onboarding-context'
import { validateCNPJ, cleanCNPJ, formatCNPJ } from '@/lib/validators'

const step1Schema = z.object({
  cnpj: z
    .string()
    .min(1, 'CNPJ obrigatorio')
    .refine((val) => cleanCNPJ(val).length === 14, 'CNPJ deve ter 14 digitos')
    .refine((val) => validateCNPJ(val), 'CNPJ invalido'),
  legalName: z.string().min(2, 'Razao social obrigatoria'),
  tradeName: z.string().min(2, 'Nome fantasia obrigatorio'),
  description: z.string().optional(),
})

type Step1FormData = z.infer<typeof step1Schema>

interface CnpjApiResponse {
  razao_social: string
  nome_fantasia: string
  logradouro: string
  municipio: string
  uf: string
  cep: string
  numero: string
  complemento: string
  bairro: string
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      />
    </svg>
  )
}

export default function MarketOnboardingStep1() {
  const router = useRouter()
  const { formData, updateFormData } = useMarketOnboarding()
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      cnpj: formData.cnpj ? formatCNPJ(formData.cnpj) : '',
      legalName: formData.legalName,
      tradeName: formData.tradeName,
      description: formData.description,
    },
  })

  const cnpjValue = watch('cnpj')

  const fetchCnpjData = useCallback(
    async (rawCnpj: string) => {
      const digits = cleanCNPJ(rawCnpj)
      if (digits.length !== 14 || !validateCNPJ(digits)) return

      setIsLookingUp(true)
      setLookupError('')

      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${digits}`,
        )
        if (!response.ok) {
          throw new Error('CNPJ nao encontrado')
        }
        const data: CnpjApiResponse = await response.json()

        setValue('legalName', data.razao_social || '', {
          shouldValidate: true,
        })
        setValue('tradeName', data.nome_fantasia || data.razao_social || '', {
          shouldValidate: true,
        })

        const addressParts = [
          data.logradouro,
          data.numero,
          data.complemento,
          data.bairro,
        ].filter(Boolean)

        updateFormData({
          address: addressParts.join(', '),
          city: data.municipio || '',
          state: data.uf || '',
          zipCode: data.cep ? data.cep.replace(/\D/g, '') : '',
        })
      } catch {
        setLookupError(
          'Nao foi possivel consultar o CNPJ. Preencha manualmente.',
        )
      } finally {
        setIsLookingUp(false)
      }
    },
    [setValue, updateFormData],
  )

  function handleCnpjChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const digits = cleanCNPJ(raw)
    const formatted = formatCNPJ(digits.slice(0, 14))

    setValue('cnpj', formatted, { shouldValidate: digits.length === 14 })

    if (digits.length === 14) {
      fetchCnpjData(digits)
    }
  }

  function onSubmit(data: Step1FormData) {
    updateFormData({
      cnpj: cleanCNPJ(data.cnpj),
      legalName: data.legalName,
      tradeName: data.tradeName,
      description: data.description || '',
    })
    router.push('/onboarding/market/step-2')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
            <BuildingIcon className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h2 className="text-muted-900 text-lg font-semibold">
              Dados da Empresa
            </h2>
            <p className="text-muted-500 text-sm">
              Informe o CNPJ para preenchimento automatico
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="relative">
            <Input
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={cnpjValue}
              onChange={handleCnpjChange}
              error={errors.cnpj?.message}
              suffix={
                isLookingUp ? (
                  <SpinnerIcon className="text-primary-600 h-5 w-5 animate-spin" />
                ) : undefined
              }
              inputMode="numeric"
              autoComplete="off"
            />
            {lookupError && (
              <p className="text-warning-600 mt-1 text-sm">{lookupError}</p>
            )}
          </div>

          <Input
            label="Razao Social"
            placeholder="Nome da razao social"
            {...register('legalName')}
            error={errors.legalName?.message}
            disabled={isLookingUp}
          />

          <Input
            label="Nome Fantasia"
            placeholder="Nome fantasia da empresa"
            {...register('tradeName')}
            error={errors.tradeName?.message}
            disabled={isLookingUp}
          />

          <Input
            label="Descricao (opcional)"
            placeholder="Descreva brevemente seu estabelecimento"
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLookingUp}>
              Proximo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
