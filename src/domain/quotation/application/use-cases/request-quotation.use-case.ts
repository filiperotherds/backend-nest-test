import { Quotation } from '../../enterprise/entities/quotation.entity'
import { QuotationsRepository } from '../repositories/quotations-repository'
import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface RequestQuotationUseCaseRequest {
  clientId: string
  organizationId: string
  description: string
}

type RequestQuotationUseCaseResponse = Either<
  null,
  {
    quotation: Quotation
  }
>

export class RequestQuotationUseCase {
  constructor(private quotationsRepository: QuotationsRepository) {}

  async execute({
    clientId,
    organizationId,
    description,
  }: RequestQuotationUseCaseRequest): Promise<RequestQuotationUseCaseResponse> {
    const quotation = Quotation.create({
      clientId: new UniqueEntityID(clientId),
      organizationId: new UniqueEntityID(organizationId),
      description,
    })

    await this.quotationsRepository.create(quotation)

    return right({
      quotation,
    })
  }
}
