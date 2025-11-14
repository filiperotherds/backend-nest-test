import { z } from 'zod'

export const createClientProfileBodySchema = z.object({
  cpf: z.string().length(11),
  phone: z.string().min(10),
})

export type CreateClientProfileBodySchema = z.infer<
  typeof createClientProfileBodySchema
>
