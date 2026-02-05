'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMarketOnboarding } from '@/components/onboarding/market-onboarding-context'
import { cn } from '@/lib/utils/cn'

const step4Schema = z.object({
  responsibleName: z.string().min(2, 'Nome do responsavel obrigatorio'),
  phone: z.string().min(10, 'Telefone invalido').optional().or(z.literal('')),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
})

type Step4FormData = z.infer<typeof step4Schema>

function UserIcon({ className }: { className?: string }) {
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
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
      width="24"
      height="24"
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

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function ProfilePreview({
  formData,
}: {
  formData: {
    tradeName: string
    legalName: string
    cnpj: string
    address: string
    city: string
    state: string
    photoUrl: string
  }
}) {
  return (
    <div className="border-muted-200 rounded-lg border bg-muted-50 p-4">
      <p className="text-muted-700 mb-3 text-sm font-semibold">
        Resumo do Cadastro
      </p>
      <div className="flex items-start gap-3">
        {formData.photoUrl ? (
          <Image
            src={formData.photoUrl}
            alt="Logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted-200">
            <span className="text-muted-400 text-lg font-bold">
              {formData.tradeName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1">
          <p className="text-muted-900 font-semibold">{formData.tradeName}</p>
          <p className="text-muted-500 text-sm">{formData.legalName}</p>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <PreviewRow label="CNPJ" value={formatCnpjDisplay(formData.cnpj)} />
        <PreviewRow
          label="Endereco"
          value={`${formData.address}, ${formData.city} - ${formData.state}`}
        />
      </div>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-500 shrink-0">{label}:</span>
      <span className="text-muted-700">{value}</span>
    </div>
  )
}

function formatCnpjDisplay(cnpj: string): string {
  if (cnpj.length !== 14) return cnpj
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`
}

export default function MarketOnboardingStep4() {
  const router = useRouter()
  const { formData, updateFormData } = useMarketOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      responsibleName: formData.responsibleName,
      phone: formData.phone ? formatPhone(formData.phone) : '',
      email: formData.email,
    },
  })

  const phoneValue = watch('phone')

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setValue('phone', formatted)
  }

  async function onSubmit(data: Step4FormData) {
    setIsSubmitting(true)
    setSubmitError('')

    updateFormData({
      responsibleName: data.responsibleName,
      phone: data.phone ? data.phone.replace(/\D/g, '') : '',
      email: data.email || '',
    })

    try {
      const payload = {
        cnpj: formData.cnpj,
        tradeName: formData.tradeName,
        legalName: formData.legalName,
        description: formData.description || undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        lat: formData.lat,
        lng: formData.lng,
        phone: data.phone ? data.phone.replace(/\D/g, '') : undefined,
      }

      const response = await fetch('/api/markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar estabelecimento')
      }

      router.push('/market/dashboard')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao criar estabelecimento'
      setSubmitError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
            <UserIcon className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h2 className="text-muted-900 text-lg font-semibold">
              Contato e Finalizacao
            </h2>
            <p className="text-muted-500 text-sm">
              Informe os dados de contato e revise o cadastro
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Nome do Responsavel"
            placeholder="Nome completo"
            {...register('responsibleName')}
            error={errors.responsibleName?.message}
          />

          <Input
            label="Telefone (opcional)"
            placeholder="(00) 00000-0000"
            value={phoneValue}
            onChange={handlePhoneChange}
            error={errors.phone?.message}
            inputMode="tel"
            autoComplete="tel"
          />

          <Input
            label="Email (opcional)"
            placeholder="contato@empresa.com"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
          />

          <ProfilePreview formData={formData} />

          {submitError && (
            <div
              className={cn(
                'flex items-start gap-3 rounded-lg p-4',
                'border border-destructive-500 bg-destructive-50',
              )}
              role="alert"
            >
              <AlertIcon className="text-destructive-600 mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-destructive-700 text-sm font-medium">
                  {submitError}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitError('')}
                  className="text-destructive-600 mt-1 text-sm underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/market/step-3')}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <CheckCircleIcon className="h-5 w-5" />
              Finalizar Cadastro
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
