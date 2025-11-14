import { Quotation } from '@/domain/quotation/enterprise/entities/quotation.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class QuotationsRepository {
  abstract findById(id: UniqueEntityID): Promise<Quotation | null>
  abstract findManyByClientId(clientId: UniqueEntityID): Promise<Quotation[]>
  abstract findManyByOrganizationId(organizationId: UniqueEntityID): Promise<Quotation[]>
  abstract create(quotation: Quotation): Promise<void>
  abstract save(quotation: Quotation): Promise<void>
}
