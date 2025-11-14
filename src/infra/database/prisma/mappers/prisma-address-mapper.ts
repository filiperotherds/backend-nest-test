import { Address as PrismaAddress } from '@prisma/client'
import { Address } from '@/domain/client/enterprise/entities/address.vo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    return Address.create({
      street: raw.street,
      number: raw.number,
      complement: raw.complement,
      neighborhood: raw.neighborhood,
      city: raw.city,
      state: raw.state,
      zipCode: raw.zipCode,
    })
  }

  static toPrisma(address: Address, entityId: UniqueEntityID): PrismaAddress {
    return {
      id: new UniqueEntityID().toString(), // Novo ID para o modelo Prisma
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
      userProfileId: entityId.toString(), // Associa ao UserProfile ou Organization
      organizationId: null,
    }
  }
}
