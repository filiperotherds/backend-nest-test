import { ServicesRepository } from '@/domain/services/application/repositories/services-repository'
import { Service } from '@/domain/services/enterprise/entities/service.entity'
import { PrismaService } from '../prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ServicePriceType } from '@prisma/client'

export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!service) {
      return null
    }

    return Service.create(
      {
        organizationId: new UniqueEntityID(service.organizationId),
        categoryId: new UniqueEntityID(service.categoryId),
        title: service.title,
        description: service.description,
        priceType: service.priceType.toLowerCase() as 'fixed' | 'per_hour' | 'quotation',
        basePrice: service.basePrice,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
      new UniqueEntityID(service.id),
    )
  }

  async findManyByOrganizationId(organizationId: UniqueEntityID): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: {
        organizationId: organizationId.toString(),
      },
    })

    return services.map((service) =>
      Service.create(
        {
          organizationId: new UniqueEntityID(service.organizationId),
          categoryId: new UniqueEntityID(service.categoryId),
          title: service.title,
          description: service.description,
          priceType: service.priceType.toLowerCase() as 'fixed' | 'per_hour' | 'quotation',
          basePrice: service.basePrice,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        },
        new UniqueEntityID(service.id),
      ),
    )
  }

  async create(service: Service): Promise<void> {
    await this.prisma.service.create({
      data: {
        id: service.id.toString(),
        organizationId: service.organizationId.toString(),
        categoryId: service.categoryId.toString(),
        title: service.title,
        description: service.description,
        priceType: service.priceType.toUpperCase() as ServicePriceType,
        basePrice: service.basePrice,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt ?? service.createdAt,
      },
    })
  }

  async save(service: Service): Promise<void> {
    await this.prisma.service.update({
      where: {
        id: service.id.toString(),
      },
      data: {
        categoryId: service.categoryId.toString(),
        title: service.title,
        description: service.description,
        priceType: service.priceType.toUpperCase() as ServicePriceType,
        basePrice: service.basePrice,
        updatedAt: new Date(),
      },
    })
  }

  async delete(service: Service): Promise<void> {
    await this.prisma.service.delete({
      where: {
        id: service.id.toString(),
      },
    })
  }
}
