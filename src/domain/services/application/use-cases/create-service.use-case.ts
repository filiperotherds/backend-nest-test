import { Service } from '../../enterprise/entities/service.entity'
import { ServicesRepository } from '../repositories/services-repository'
import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateServiceUseCaseRequest {
  organizationId: string
  categoryId: string
  title: string
  description: string
  priceType: 'fixed' | 'per_hour' | 'quotation'
  basePrice?: number | null
}

type CreateServiceUseCaseResponse = Either<
  null,
  {
    service: Service
  }
>

export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    organizationId,
    categoryId,
    title,
    description,
    priceType,
    basePrice,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      organizationId: new UniqueEntityID(organizationId),
      categoryId: new UniqueEntityID(categoryId),
      title,
      description,
      priceType,
      basePrice,
    })

    await this.servicesRepository.create(service)

    return right({
      service,
    })
  }
}
