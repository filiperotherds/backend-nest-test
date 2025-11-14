import { UserProfile as PrismaUserProfile, Address as PrismaAddress } from '@prisma/client'
import { UserProfile } from '@/domain/client/enterprise/entities/user-profile.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AddressList } from '@/domain/client/enterprise/entities/address-list'
import { PrismaAddressMapper } from './prisma-address-mapper'

type PrismaUserProfileWithAddresses = PrismaUserProfile & {
  addresses: PrismaAddress[]
}

export class PrismaUserProfileMapper {
  static toDomain(raw: PrismaUserProfileWithAddresses): UserProfile {
    const addresses = raw.addresses.map(PrismaAddressMapper.toDomain)

    return UserProfile.create(
      {
        userId: new UniqueEntityID(raw.userId),
        cpf: raw.cpf,
        phone: raw.phone,
        addresses: new AddressList(addresses),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(userProfile: UserProfile): PrismaUserProfile {
    return {
      id: userProfile.id.toString(),
      userId: userProfile.userId.toString(),
      cpf: userProfile.cpf,
      phone: userProfile.phone,
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt ?? userProfile.createdAt,
    }
  }
}
