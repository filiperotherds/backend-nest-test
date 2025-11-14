import { Organization } from '@/domain/organization/enterprise/entities/organization.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class OrganizationsRepository {
  abstract findById(id: UniqueEntityID): Promise<Organization | null>
  abstract findBySlug(slug: string): Promise<Organization | null>
  abstract findByOwnerId(ownerId: UniqueEntityID): Promise<Organization | null>
  abstract create(organization: Organization): Promise<void>
  abstract save(organization: Organization): Promise<void>
}
