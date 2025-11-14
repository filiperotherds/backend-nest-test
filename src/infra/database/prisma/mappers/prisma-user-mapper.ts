import { User as PrismaUser, UserRole } from '@prisma/client'
import { User } from '@/domain/auth/enterprise/entities/user.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.passwordHash,
        role: raw.role.toLowerCase() as 'client' | 'professional',
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role.toUpperCase() as UserRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
