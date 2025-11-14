import { OrganizationsRepository } from '@/domain/organization/application/repositories/organizations-repository'
import { Organization } from '@/domain/organization/enterprise/entities/organization.entity'
import { PrismaService } from '../prisma.service'
import { PrismaOrganizationMapper } from '../mappers/prisma-organization-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'

export class PrismaOrganizationsRepository implements OrganizationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id: id.toString(),
      },
      include: {
        addresses: true,
        members: true,
      },
    })

    if (!organization) {
      return null
    }

    return PrismaOrganizationMapper.toDomain(organization)
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        slug,
      },
      include: {
        addresses: true,
        members: true,
      },
    })

    if (!organization) {
      return null
    }

    return PrismaOrganizationMapper.toDomain(organization)
  }

  async findByOwnerId(ownerId: UniqueEntityID): Promise<Organization | null> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        ownerId: ownerId.toString(),
      },
      include: {
        addresses: true,
        members: true,
      },
    })

    if (!organization) {
      return null
    }

    return PrismaOrganizationMapper.toDomain(organization)
  }

  async create(organization: Organization): Promise<void> {
    const data = PrismaOrganizationMapper.toPrisma(organization)

    await this.prisma.organization.create({
      data,
    })
  }

  async save(organization: Organization): Promise<void> {
    const data = PrismaOrganizationMapper.toPrisma(organization)

    await this.prisma.organization.update({
      where: {
        id: data.id,
      },
      data,
    })

    // Handle addresses (similar to UserProfile, delete all and recreate)
    await this.prisma.address.deleteMany({
      where: {
        organizationId: organization.id.toString(),
      },
    })

    await this.prisma.address.createMany({
      data: organization.addresses.currentItems.map((address) => ({
        ...PrismaAddressMapper.toPrisma(address, organization.id),
        organizationId: organization.id.toString(),
        userProfileId: null,
      })),
    })

    // Handle members (WatchedList) - Assuming members are managed by a separate repository for simplicity
    // The members list is included in the find, but the save logic for members will be in PrismaMembersRepository
  }
}
