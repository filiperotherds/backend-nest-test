import { Organization as PrismaOrganization, Address as PrismaAddress } from '@prisma/client'
import { Organization } from '@/domain/organization/enterprise/entities/organization.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/organization/enterprise/value-objects/slug.vo'
import { AddressList } from '@/domain/client/enterprise/entities/address-list'
import { MemberList } from '@/domain/organization/enterprise/entities/member-list'
import { PrismaAddressMapper } from './prisma-address-mapper'

type PrismaOrganizationWithAddressesAndMembers = PrismaOrganization & {
  addresses: PrismaAddress[]
  members: {
    id: string
    userId: string
    role: 'ADMIN' | 'MEMBER'
    createdAt: Date
    updatedAt: Date
  }[]
}

export class PrismaOrganizationMapper {
  static toDomain(raw: PrismaOrganizationWithAddressesAndMembers): Organization {
    const addresses = raw.addresses.map(PrismaAddressMapper.toDomain)
    const members = raw.members.map((member) => ({
      id: new UniqueEntityID(member.id),
      organizationId: new UniqueEntityID(raw.id),
      userId: new UniqueEntityID(member.userId),
      role: member.role.toLowerCase() as 'admin' | 'member',
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    }))

    return Organization.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        name: raw.name,
        slug: Slug.create(raw.slug),
        cnpj: raw.cnpj,
        description: raw.description,
        addresses: new AddressList(addresses),
        members: new MemberList(members),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(organization: Organization): PrismaOrganization {
    return {
      id: organization.id.toString(),
      ownerId: organization.ownerId.toString(),
      name: organization.name,
      slug: organization.slug.value,
      cnpj: organization.cnpj,
      description: organization.description,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt ?? organization.createdAt,
    }
  }
}
