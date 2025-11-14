import { MembersRepository } from '@/domain/organization/application/repositories/members-repository'
import { Member } from '@/domain/organization/enterprise/entities/member.entity'
import { PrismaService } from '../prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { MemberRole } from '@prisma/client'

export class PrismaMembersRepository implements MembersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!member) {
      return null
    }

    return Member.create(
      {
        organizationId: new UniqueEntityID(member.organizationId),
        userId: new UniqueEntityID(member.userId),
        role: member.role.toLowerCase() as 'admin' | 'member',
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
      new UniqueEntityID(member.id),
    )
  }

  async findByOrganizationIdAndUserId(
    organizationId: UniqueEntityID,
    userId: UniqueEntityID,
  ): Promise<Member | null> {
    const member = await this.prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organizationId.toString(),
          userId: userId.toString(),
        },
      },
    })

    if (!member) {
      return null
    }

    return Member.create(
      {
        organizationId: new UniqueEntityID(member.organizationId),
        userId: new UniqueEntityID(member.userId),
        role: member.role.toLowerCase() as 'admin' | 'member',
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
      new UniqueEntityID(member.id),
    )
  }

  async create(member: Member): Promise<void> {
    await this.prisma.member.create({
      data: {
        id: member.id.toString(),
        organizationId: member.organizationId.toString(),
        userId: member.userId.toString(),
        role: member.role.toUpperCase() as MemberRole,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt ?? member.createdAt,
      },
    })
  }

  async save(member: Member): Promise<void> {
    await this.prisma.member.update({
      where: {
        id: member.id.toString(),
      },
      data: {
        role: member.role.toUpperCase() as MemberRole,
        updatedAt: new Date(),
      },
    })
  }
}
