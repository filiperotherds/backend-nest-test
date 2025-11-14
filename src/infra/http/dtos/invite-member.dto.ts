import { z } from 'zod'

export const inviteMemberBodySchema = z.object({
  recipientEmail: z.string().email(),
  role: z.enum(['admin', 'member']),
})

export type InviteMemberBodySchema = z.infer<typeof inviteMemberBodySchema>
