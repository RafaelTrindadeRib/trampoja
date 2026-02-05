'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useWorkerOnboarding } from '@/components/onboarding/worker-onboarding-context'

const step1Schema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  cpf: z
    .string()
    .min(14, 'CPF obrigatorio')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato XXX.XXX.XXX-XX'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida (AAAA-MM-DD)'),
  phone: z
    .string()
    .min(15, 'Telefone obrigatorio')
    .regex(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      'Telefone deve estar no formato (XX) XXXXX-XXXX',
    ),
})

type Step1FormData = z.infer<typeof step1Schema>

function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function WorkerOnboardingStep1() {
  const router = useRouter()
  const { data, updateData } = useWorkerOnboarding()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      cpf: data.cpf ? applyCpfMask(data.cpf) : '',
      dateOfBirth: data.dateOfBirth ?? '',
      phone: data.phone ? applyPhoneMask(data.phone) : '',
    },
  })

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyCpfMask(e.target.value)
    setValue('cpf', masked, { shouldValidate: true })
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyPhoneMask(e.target.value)
    setValue('phone', masked, { shouldValidate: true })
  }

  function onSubmit(formData: Step1FormData) {
    const cpfDigits = formData.cpf.replace(/\D/g, '')
    const phoneDigits = formData.phone.replace(/\D/g, '')

    updateData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      cpf: cpfDigits,
      dateOfBirth: formData.dateOfBirth,
      phone: phoneDigits,
    })

    router.push('/onboarding/worker/step-2')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-muted-900 text-lg font-semibold">
          Dados Pessoais
        </h2>
        <p className="text-muted-500 text-sm">
          Informe seus dados pessoais para criar seu perfil.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nome"
              placeholder="Seu nome"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Sobrenome"
              placeholder="Seu sobrenome"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            error={errors.cpf?.message}
            {...register('cpf', { onChange: handleCpfChange })}
            inputMode="numeric"
          />

          <Input
            label="Data de Nascimento"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            error={errors.phone?.message}
            {...register('phone', { onChange: handlePhoneChange })}
            inputMode="tel"
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit">Proximo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
