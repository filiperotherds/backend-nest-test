import { z } from 'zod'

export const createOrganizationBodySchema = z.object({
  name: z.string().min(3),
  cnpj: z.string().length(14),
  description: z.string().min(10),
})

export type CreateOrganizationBodySchema = z.infer<
  typeof createOrganizationBodySchema
>
