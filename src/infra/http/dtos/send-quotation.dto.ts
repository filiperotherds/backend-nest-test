import { z } from 'zod'

export const sendQuotationBodySchema = z.object({
  totalPrice: z.number().positive(),
  expiresAt: z.string().datetime(),
  items: z.array(
    z.object({
      serviceId: z.string().uuid(),
      description: z.string().min(5),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    }),
  ),
})

export type SendQuotationBodySchema = z.infer<typeof sendQuotationBodySchema>
