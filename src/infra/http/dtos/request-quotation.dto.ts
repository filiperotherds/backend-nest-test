import { z } from 'zod'

export const requestQuotationBodySchema = z.object({
  organizationId: z.string().uuid(),
  description: z.string().min(10),
})

export type RequestQuotationBodySchema = z.infer<
  typeof requestQuotationBodySchema
>
