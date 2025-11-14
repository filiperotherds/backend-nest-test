import { UserProfilesRepository } from '@/domain/client/application/repositories/user-profiles-repository'
import { UserProfile } from '@/domain/client/enterprise/entities/user-profile.entity'
import { PrismaService } from '../prisma.service'
import { PrismaUserProfileMapper } from '../mappers/prisma-user-profile-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'

export class PrismaUserProfilesRepository implements UserProfilesRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: UniqueEntityID): Promise<UserProfile | null> {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: {
        userId: userId.toString(),
      },
      include: {
        addresses: true,
      },
    })

    if (!userProfile) {
      return null
    }

    return PrismaUserProfileMapper.toDomain(userProfile)
  }

  async create(userProfile: UserProfile): Promise<void> {
    const data = PrismaUserProfileMapper.toPrisma(userProfile)

    await this.prisma.userProfile.create({
      data,
    })
  }

  async save(userProfile: UserProfile): Promise<void> {
    const data = PrismaUserProfileMapper.toPrisma(userProfile)

    await this.prisma.userProfile.update({
      where: {
        id: data.id,
      },
      data,
    })

    // Handle addresses (WatchedList)
    const addresses = userProfile.addresses

    await Promise.all(
      addresses.getRemovedItems().map((address) => {
        // Como Address é um Value Object, a remoção é feita pela comparação de valores.
        // No Prisma, precisamos deletar o registro que corresponde ao Value Object.
        // Isso é complexo. Para simplificar, vamos deletar todos e recriar, ou
        // usar um campo de ID no Value Object (o que o transformaria em Entity).
        // Optando por deletar e recriar para manter Address como VO.
        // No entanto, o Prisma não suporta operações de lista de Value Objects diretamente.
        // A melhor abordagem é gerenciar a lista de endereços diretamente no save.

        // Para manter a arquitetura limpa, vamos assumir que o save do UserProfile
        // deve gerenciar a lista de endereços.

        // 1. Deletar todos os endereços existentes para este perfil
        this.prisma.address.deleteMany({
          where: {
            userProfileId: userProfile.id.toString(),
          },
        })
      }),
    )

    // 2. Criar todos os endereços atuais
    await this.prisma.address.createMany({
      data: addresses.currentItems.map((address) =>
        PrismaAddressMapper.toPrisma(address, userProfile.id),
      ),
    })
  }
}
