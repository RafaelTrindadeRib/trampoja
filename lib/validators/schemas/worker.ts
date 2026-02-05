import { z } from 'zod'

const SKILL_VALUES = [
  'REPOSITOR',
  'CAIXA',
  'ESTOQUISTA',
  'LIMPEZA',
  'PROMOTOR',
  'ATENDENTE',
  'EMPACOTADOR',
  'AUXILIAR_COZINHA',
  'BALCONISTA',
  'OUTRO',
] as const

export const createWorkerSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  cpf: z.string().length(11, 'CPF deve ter 11 digitos'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida'),
  phone: z.string().min(10, 'Telefone invalido'),
  address: z.string().min(5, 'Endereco obrigatorio'),
  city: z.string().min(2, 'Cidade obrigatoria'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zipCode: z.string().length(8, 'CEP deve ter 8 digitos'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  searchRadius: z.number().int().min(1).max(50).default(10),
  minHourlyRate: z.number().min(8, 'Valor minimo e R$8,00'),
  skills: z
    .array(z.enum(SKILL_VALUES))
    .min(1, 'Selecione pelo menos 1 habilidade'),
})

export const updateWorkerSchema = createWorkerSchema
  .partial()
  .omit({ cpf: true })

export type CreateWorkerInput = z.infer<typeof createWorkerSchema>
export type UpdateWorkerInput = z.infer<typeof updateWorkerSchema>
