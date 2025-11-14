import { Invite } from '@/domain/organization/enterprise/entities/invite.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class InviteRepository {
  abstract findById(id: UniqueEntityID): Promise<Invite | null>
  abstract findByEmailAndOrganizationId(
    email: string,
    organizationId: UniqueEntityID,
  ): Promise<Invite | null>
  abstract create(invite: Invite): Promise<void>
  abstract save(invite: Invite): Promise<void>
}
