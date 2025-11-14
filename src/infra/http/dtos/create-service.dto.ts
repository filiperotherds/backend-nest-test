import { z } from 'zod'

export const createServiceBodySchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().min(10),
  priceType: z.enum(['fixed', 'per_hour', 'quotation']),
  basePrice: z.number().optional().nullable(),
})

export type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>
