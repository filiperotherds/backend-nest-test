import { QuotationItem as PrismaQuotationItem } from '@prisma/client'
import { QuotationItem } from '@/domain/quotation/enterprise/entities/quotation-item.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaQuotationItemMapper {
  static toDomain(raw: PrismaQuotationItem): QuotationItem {
    return QuotationItem.create({
      serviceId: new UniqueEntityID(raw.serviceId),
      description: raw.description,
      quantity: raw.quantity,
      unitPrice: raw.unitPrice,
    })
  }

  static toPrisma(quotationItem: QuotationItem, quotationId: UniqueEntityID): PrismaQuotationItem {
    return {
      id: new UniqueEntityID().toString(),
      quotationId: quotationId.toString(),
      serviceId: quotationItem.serviceId.toString(),
      description: quotationItem.description,
      quantity: quotationItem.quantity,
      unitPrice: quotationItem.unitPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
