import { Injectable } from '@nestjs/common'
import { Address, User, UserProfile } from 'generated/prisma'
import { PrismaService } from 'src/prisma/prisma.service'
import type { CreateClientAccountBodySchema } from './schema/create-client-account.schema'
import type { CreateClientAddressBodySchema } from './schema/create-client-address.schema'

@Injectable()
export class ClientRepository {
  constructor(private prisma: PrismaService) {}

  async create(createAccount: CreateClientAccountBodySchema): Promise<User> {
    const { name, email, password } = createAccount

    return this.prisma.user.create({ data: { name, email, password } })
  }

  async createProfile(userId: string): Promise<UserProfile> {
    return this.prisma.userProfile.create({ data: { userId } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async createAddress(
    createAddress: CreateClientAddressBodySchema,
    userProfileId: string,
  ): Promise<Address> {
    const { city, country, state, street, zipCode } = createAddress

    return this.prisma.address.create({
      data: { city, country, state, street, zipCode, userProfileId },
    })
  }

  async getUserProfileIdByUserId(userId: string): Promise<string | null> {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (userProfile) {
      return userProfile.id
    }

    return null
  }

  async getAddressByUserProfileId(userProfileId: string): Promise<Address[]> {
    return this.prisma.address.findMany({ where: { userProfileId } })
  }
}
