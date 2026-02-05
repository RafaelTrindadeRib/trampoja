'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMarketOnboarding } from '@/components/onboarding/market-onboarding-context'

const BR_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

const step2Schema = z.object({
  address: z.string().min(5, 'Endereco obrigatorio'),
  city: z.string().min(2, 'Cidade obrigatoria'),
  state: z.string().length(2, 'Selecione um estado'),
  zipCode: z
    .string()
    .min(1, 'CEP obrigatorio')
    .refine((val) => val.replace(/\D/g, '').length === 8, 'CEP deve ter 8 digitos'),
  lat: z.number(),
  lng: z.number(),
})

type Step2FormData = z.infer<typeof step2Schema>

function MapPinIcon({ className }: { className?: string }) {
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
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  )
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export default function MarketOnboardingStep2() {
  const router = useRouter()
  const { formData, updateFormData } = useMarketOnboarding()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode ? formatCEP(formData.zipCode) : '',
      lat: formData.lat || -23.5505,
      lng: formData.lng || -46.6333,
    },
  })

  const lat = watch('lat')
  const lng = watch('lng')
  const zipCodeValue = watch('zipCode')

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCEP(e.target.value)
    setValue('zipCode', formatted, {
      shouldValidate: formatted.replace(/\D/g, '').length === 8,
    })
  }

  function onSubmit(data: Step2FormData) {
    updateFormData({
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode.replace(/\D/g, ''),
      lat: data.lat,
      lng: data.lng,
    })
    router.push('/onboarding/market/step-3')
  }

  function handleBack() {
    router.push('/onboarding/market/step-1')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-lg">
            <MapPinIcon className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h2 className="text-muted-900 text-lg font-semibold">Endereco</h2>
            <p className="text-muted-500 text-sm">
              Confirme ou edite o endereco do estabelecimento
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Endereco"
            placeholder="Rua, numero, complemento"
            {...register('address')}
            error={errors.address?.message}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Cidade"
              placeholder="Nome da cidade"
              {...register('city')}
              error={errors.city?.message}
            />

            <Select
              label="Estado"
              {...register('state')}
              error={errors.state?.message}
            >
              <option value="">Selecione</option>
              {BR_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="CEP"
            placeholder="00000-000"
            value={zipCodeValue}
            onChange={handleCepChange}
            error={errors.zipCode?.message}
            inputMode="numeric"
            autoComplete="postal-code"
          />

          <input type="hidden" {...register('lat', { valueAsNumber: true })} />
          <input type="hidden" {...register('lng', { valueAsNumber: true })} />

          <div className="border-muted-200 rounded-lg border bg-muted-50 p-4">
            <p className="text-muted-600 mb-2 text-sm font-medium">
              Pre-visualizacao do mapa
            </p>
            <div className="flex h-32 items-center justify-center rounded-md bg-muted-200">
              <div className="text-center">
                <MapPinIcon className="text-muted-400 mx-auto h-8 w-8" />
                <p className="text-muted-500 mt-1 text-xs">
                  Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
            <Button type="submit">Proximo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
