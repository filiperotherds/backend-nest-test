import { z } from 'zod'

export const addAddressBodySchema = z.object({
  street: z.string(),
  number: z.string(),
  complement: z.string().optional().nullable(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string().length(2),
  zipCode: z.string().length(8),
})

export type AddAddressBodySchema = z.infer<typeof addAddressBodySchema>
