import { QuotationsRepository } from '../repositories/quotations-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuotationItem } from '../../enterprise/entities/quotation-item.vo'
import { QuotationItemList } from '../../enterprise/entities/quotation-item-list'

interface QuotationItemRequest {
  serviceId: string
  description: string
  quantity: number
  unitPrice: number
}

interface SendQuotationUseCaseRequest {
  quotationId: string
  totalPrice: number
  expiresAt: Date
  items: QuotationItemRequest[]
}

type SendQuotationUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class SendQuotationUseCase {
  constructor(private quotationsRepository: QuotationsRepository) {}

  async execute({
    quotationId,
    totalPrice,
    expiresAt,
    items,
  }: SendQuotationUseCaseRequest): Promise<SendQuotationUseCaseResponse> {
    const uniqueQuotationId = new UniqueEntityID(quotationId)

    const quotation = await this.quotationsRepository.findById(
      uniqueQuotationId,
    )

    if (!quotation) {
      return left(new ResourceNotFoundError('Quotation not found.'))
    }

    const quotationItems = items.map((item) =>
      QuotationItem.create({
        serviceId: new UniqueEntityID(item.serviceId),
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }),
    )

    quotation.quotationItems.update(quotationItems)
    quotation.send(totalPrice, expiresAt)

    await this.quotationsRepository.save(quotation)

    return right(null)
  }
}
