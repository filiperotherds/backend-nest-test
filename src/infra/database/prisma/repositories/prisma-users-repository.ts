import { UsersRepository } from '@/domain/auth/application/repositories/users-repository'
import { User } from '@/domain/auth/enterprise/entities/user.entity'
import { PrismaService } from '../prisma.service'
import { PrismaUserMapper } from '../mappers/prisma-user-mapper'

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUserMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
