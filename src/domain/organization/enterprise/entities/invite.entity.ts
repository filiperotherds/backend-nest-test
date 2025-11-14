import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface InviteProps {
  organizationId: UniqueEntityID
  recipientEmail: string
  role: 'admin' | 'member'
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  expiresAt: Date
  createdAt: Date
  updatedAt?: Date
}

export class Invite extends Entity<InviteProps> {
  get organizationId() {
    return this.props.organizationId
  }

  get recipientEmail() {
    return this.props.recipientEmail
  }

  get role() {
    return this.props.role
  }

  get status() {
    return this.props.status
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  public accept() {
    this.props.status = 'accepted'
    this.touch()
  }

  public reject() {
    this.props.status = 'rejected'
    this.touch()
  }

  public expire() {
    this.props.status = 'expired'
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<InviteProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    const invite = new Invite(
      {
        ...props,
        status: props.status ?? 'pending',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return invite
  }
}
