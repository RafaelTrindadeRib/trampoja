'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useWorkerOnboarding } from '@/components/onboarding/worker-onboarding-context'

const BR_STATES = [
  { value: '', label: 'Selecione o estado' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapa' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceara' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espirito Santo' },
  { value: 'GO', label: 'Goias' },
  { value: 'MA', label: 'Maranhao' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Para' },
  { value: 'PB', label: 'Paraiba' },
  { value: 'PR', label: 'Parana' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piaui' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondonia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'Sao Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

const step2Schema = z.object({
  address: z.string().min(5, 'Endereco deve ter pelo menos 5 caracteres'),
  city: z.string().min(2, 'Cidade obrigatoria'),
  state: z.string().length(2, 'Selecione um estado'),
  zipCode: z
    .string()
    .min(9, 'CEP obrigatorio')
    .regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato XXXXX-XXX'),
  searchRadius: z.number().int().min(1).max(50),
})

type Step2FormData = z.infer<typeof step2Schema>

function applyCepMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export default function WorkerOnboardingStep2() {
  const router = useRouter()
  const { data, updateData } = useWorkerOnboarding()
  const [radius, setRadius] = useState(data.searchRadius ?? 10)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      zipCode: data.zipCode ? applyCepMask(data.zipCode) : '',
      searchRadius: data.searchRadius ?? 10,
    },
  })

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyCepMask(e.target.value)
    setValue('zipCode', masked, { shouldValidate: true })
  }

  function handleRadiusChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value)
    setRadius(val)
    setValue('searchRadius', val)
  }

  function onSubmit(formData: Step2FormData) {
    const cepDigits = formData.zipCode.replace(/\D/g, '')

    updateData({
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: cepDigits,
      searchRadius: formData.searchRadius,
      lat: -23.5505,
      lng: -46.6333,
    })

    router.push('/onboarding/worker/step-3')
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-muted-900 text-lg font-semibold">Endereco</h2>
        <p className="text-muted-500 text-sm">
          Informe seu endereco para encontrar trabalhos perto de voce.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <Input
            label="Endereco"
            placeholder="Rua, numero, bairro"
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Cidade"
              placeholder="Sua cidade"
              error={errors.city?.message}
              {...register('city')}
            />
            <Select
              label="Estado"
              error={errors.state?.message}
              {...register('state')}
            >
              {BR_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="CEP"
            placeholder="00000-000"
            error={errors.zipCode?.message}
            {...register('zipCode', { onChange: handleCepChange })}
            inputMode="numeric"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="searchRadius"
              className="text-muted-700 text-sm font-medium"
            >
              Raio de busca: {radius} km
            </label>
            <input
              id="searchRadius"
              type="range"
              min={1}
              max={50}
              step={1}
              value={radius}
              onChange={handleRadiusChange}
              className="accent-primary-600 h-2 w-full cursor-pointer rounded-lg"
            />
            <div className="text-muted-400 flex justify-between text-xs">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div className="mt-2 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/worker/step-1')}
            >
              Voltar
            </Button>
            <Button type="submit">Proximo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
