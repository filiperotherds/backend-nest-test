import { z } from 'zod'

export const getClientAddressBodySchema = z.object({
  userId: z.string().uuid(),
})

export type GetClientAddressBodySchema = z.infer<
  typeof getClientAddressBodySchema
>
