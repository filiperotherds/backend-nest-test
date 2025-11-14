import { OrganizationsRepository } from '../repositories/organizations-repository'
import { InviteRepository } from '../repositories/invite-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Invite } from '../../enterprise/entities/invite.entity'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

interface InviteMemberUseCaseRequest {
  organizationId: string
  recipientEmail: string
  role: 'admin' | 'member'
}

type InviteMemberUseCaseResponse = Either<
  ResourceNotFoundError | ResourceAlreadyExistsError,
  {
    invite: Invite
  }
>

export class InviteMemberUseCase {
  constructor(
    private organizationsRepository: OrganizationsRepository,
    private inviteRepository: InviteRepository,
  ) {}

  async execute({
    organizationId,
    recipientEmail,
    role,
  }: InviteMemberUseCaseRequest): Promise<InviteMemberUseCaseResponse> {
    const uniqueOrganizationId = new UniqueEntityID(organizationId)

    const organization = await this.organizationsRepository.findById(
      uniqueOrganizationId,
    )

    if (!organization) {
      return left(new ResourceNotFoundError('Organization not found.'))
    }

    const existingInvite = await this.inviteRepository.findByEmailAndOrganizationId(
      recipientEmail,
      uniqueOrganizationId,
    )

    if (existingInvite && existingInvite.status === 'pending') {
      return left(
        new ResourceAlreadyExistsError('Pending invite already exists for this user.'),
      )
    }

    const invite = Invite.create({
      organizationId: uniqueOrganizationId,
      recipientEmail,
      role,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration
    })

    await this.inviteRepository.create(invite)

    return right({
      invite,
    })
  }
}
