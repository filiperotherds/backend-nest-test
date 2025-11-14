import { Service } from '@/domain/services/enterprise/entities/service.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class ServicesRepository {
  abstract findById(id: UniqueEntityID): Promise<Service | null>
  abstract findManyByOrganizationId(organizationId: UniqueEntityID): Promise<Service[]>
  abstract create(service: Service): Promise<void>
  abstract save(service: Service): Promise<void>
  abstract delete(service: Service): Promise<void>
}
