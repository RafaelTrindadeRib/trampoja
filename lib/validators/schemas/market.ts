import { z } from 'zod'

export const createMarketSchema = z.object({
  cnpj: z.string().length(14, 'CNPJ deve ter 14 digitos'),
  tradeName: z.string().min(2, 'Nome fantasia obrigatorio'),
  legalName: z.string().min(2, 'Razao social obrigatoria'),
  description: z.string().optional(),
  address: z.string().min(5, 'Endereco obrigatorio'),
  city: z.string().min(2, 'Cidade obrigatoria'),
  state: z.string().length(2, 'Estado deve ter 2 letras'),
  zipCode: z.string().length(8, 'CEP deve ter 8 digitos'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  phone: z.string().min(10, 'Telefone invalido').optional(),
})

export const updateMarketSchema = createMarketSchema
  .partial()
  .omit({ cnpj: true })

export type CreateMarketInput = z.infer<typeof createMarketSchema>
export type UpdateMarketInput = z.infer<typeof updateMarketSchema>
