import { Member } from '@/domain/organization/enterprise/entities/member.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class MembersRepository {
  abstract findById(id: UniqueEntityID): Promise<Member | null>
  abstract findByOrganizationIdAndUserId(
    organizationId: UniqueEntityID,
    userId: UniqueEntityID,
  ): Promise<Member | null>
  abstract create(member: Member): Promise<void>
  abstract save(member: Member): Promise<void>
}
