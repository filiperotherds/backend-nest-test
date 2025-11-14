import { QuotationsRepository } from '@/domain/quotation/application/repositories/quotations-repository'
import { Quotation } from '@/domain/quotation/enterprise/entities/quotation.entity'
import { PrismaService } from '../prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuotationStatus } from '@prisma/client'
import { QuotationItemList } from '@/domain/quotation/enterprise/entities/quotation-item-list'
import { PrismaQuotationItemMapper } from '../mappers/prisma-quotation-item-mapper'

type PrismaQuotationWithItems = {
  items: {
    id: string
    quotationId: string
    serviceId: string
    description: string
    quantity: number
    unitPrice: number
    createdAt: Date
    updatedAt: Date
  }[]
} & {
  id: string
  clientId: string
  organizationId: string
  status: QuotationStatus
  description: string
  totalPrice: number
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

export class PrismaQuotationsRepository implements QuotationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Quotation | null> {
    const quotation = await this.prisma.quotation.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        items: true,
      },
    })

    if (!quotation) {
      return null
    }

    const items = quotation.items.map(PrismaQuotationItemMapper.toDomain)

    return Quotation.create(
      {
        clientId: new UniqueEntityID(quotation.clientId),
        organizationId: new UniqueEntityID(quotation.organizationId),
        status: quotation.status.toLowerCase() as 'pending' | 'sent' | 'accepted' | 'rejected' | 'canceled',
        description: quotation.description,
        totalPrice: quotation.totalPrice,
        expiresAt: quotation.expiresAt,
        quotationItems: new QuotationItemList(items),
        createdAt: quotation.createdAt,
        updatedAt: quotation.updatedAt,
      },
      new UniqueEntityID(quotation.id),
    )
  }

  async findManyByClientId(clientId: UniqueEntityID): Promise<Quotation[]> {
    const quotations = await this.prisma.quotation.findMany({
      where: {
        clientId: clientId.toString(),
      },
      include: {
        items: true,
      },
    })

    return quotations.map((quotation) => {
      const items = quotation.items.map(PrismaQuotationItemMapper.toDomain)
      return Quotation.create(
        {
          clientId: new UniqueEntityID(quotation.clientId),
          organizationId: new UniqueEntityID(quotation.organizationId),
          status: quotation.status.toLowerCase() as 'pending' | 'sent' | 'accepted' | 'rejected' | 'canceled',
          description: quotation.description,
          totalPrice: quotation.totalPrice,
          expiresAt: quotation.expiresAt,
          quotationItems: new QuotationItemList(items),
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
        },
        new UniqueEntityID(quotation.id),
      )
    })
  }

  async findManyByOrganizationId(organizationId: UniqueEntityID): Promise<Quotation[]> {
    const quotations = await this.prisma.quotation.findMany({
      where: {
        organizationId: organizationId.toString(),
      },
      include: {
        items: true,
      },
    })

    return quotations.map((quotation) => {
      const items = quotation.items.map(PrismaQuotationItemMapper.toDomain)
      return Quotation.create(
        {
          clientId: new UniqueEntityID(quotation.clientId),
          organizationId: new UniqueEntityID(quotation.organizationId),
          status: quotation.status.toLowerCase() as 'pending' | 'sent' | 'accepted' | 'rejected' | 'canceled',
          description: quotation.description,
          totalPrice: quotation.totalPrice,
          expiresAt: quotation.expiresAt,
          quotationItems: new QuotationItemList(items),
          createdAt: quotation.createdAt,
          updatedAt: quotation.updatedAt,
        },
        new UniqueEntityID(quotation.id),
      )
    })
  }

  async create(quotation: Quotation): Promise<void> {
    await this.prisma.quotation.create({
      data: {
        id: quotation.id.toString(),
        clientId: quotation.clientId.toString(),
        organizationId: quotation.organizationId.toString(),
        status: quotation.status.toUpperCase() as QuotationStatus,
        description: quotation.description,
        totalPrice: quotation.totalPrice,
        expiresAt: quotation.expiresAt,
        createdAt: quotation.createdAt,
        updatedAt: quotation.updatedAt ?? quotation.createdAt,
      },
    })
  }

  async save(quotation: Quotation): Promise<void> {
    await this.prisma.quotation.update({
      where: {
        id: quotation.id.toString(),
      },
      data: {
        status: quotation.status.toUpperCase() as QuotationStatus,
        totalPrice: quotation.totalPrice,
        expiresAt: quotation.expiresAt,
        updatedAt: new Date(),
      },
    })

    // Handle Quotation Items (delete all and recreate)
    await this.prisma.quotationItem.deleteMany({
      where: {
        quotationId: quotation.id.toString(),
      },
    })

    await this.prisma.quotationItem.createMany({
      data: quotation.quotationItems.currentItems.map((item) =>
        PrismaQuotationItemMapper.toPrisma(item, quotation.id),
      ),
    })
  }
}
