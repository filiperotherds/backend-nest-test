import { InviteRepository } from '@/domain/organization/application/repositories/invite-repository'
import { Invite } from '@/domain/organization/enterprise/entities/invite.entity'
import { PrismaService } from '../prisma.service'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InviteStatus, MemberRole } from '@prisma/client'

export class PrismaInviteRepository implements InviteRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: UniqueEntityID): Promise<Invite | null> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        id: id.toString(),
      },
    })

    if (!invite) {
      return null
    }

    return Invite.create(
      {
        organizationId: new UniqueEntityID(invite.organizationId),
        recipientEmail: invite.recipientEmail,
        role: invite.role.toLowerCase() as 'admin' | 'member',
        status: invite.status.toLowerCase() as 'pending' | 'accepted' | 'rejected' | 'expired',
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        updatedAt: invite.updatedAt,
      },
      new UniqueEntityID(invite.id),
    )
  }

  async findByEmailAndOrganizationId(
    email: string,
    organizationId: UniqueEntityID,
  ): Promise<Invite | null> {
    const invite = await this.prisma.invite.findUnique({
      where: {
        organizationId_recipientEmail: {
          organizationId: organizationId.toString(),
          recipientEmail: email,
        },
      },
    })

    if (!invite) {
      return null
    }

    return Invite.create(
      {
        organizationId: new UniqueEntityID(invite.organizationId),
        recipientEmail: invite.recipientEmail,
        role: invite.role.toLowerCase() as 'admin' | 'member',
        status: invite.status.toLowerCase() as 'pending' | 'accepted' | 'rejected' | 'expired',
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        updatedAt: invite.updatedAt,
      },
      new UniqueEntityID(invite.id),
    )
  }

  async create(invite: Invite): Promise<void> {
    await this.prisma.invite.create({
      data: {
        id: invite.id.toString(),
        organizationId: invite.organizationId.toString(),
        recipientEmail: invite.recipientEmail,
        role: invite.role.toUpperCase() as MemberRole,
        status: invite.status.toUpperCase() as InviteStatus,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        updatedAt: invite.updatedAt ?? invite.createdAt,
      },
    })
  }

  async save(invite: Invite): Promise<void> {
    await this.prisma.invite.update({
      where: {
        id: invite.id.toString(),
      },
      data: {
        status: invite.status.toUpperCase() as InviteStatus,
        updatedAt: new Date(),
      },
    })
  }
}
