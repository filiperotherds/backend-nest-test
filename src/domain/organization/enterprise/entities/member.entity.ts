import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface MemberProps {
  organizationId: UniqueEntityID
  userId: UniqueEntityID
  role: 'admin' | 'member'
  createdAt: Date
  updatedAt?: Date
}

export class Member extends Entity<MemberProps> {
  get organizationId() {
    return this.props.organizationId
  }

  get userId() {
    return this.props.userId
  }

  get role() {
    return this.props.role
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set role(role: 'admin' | 'member') {
    this.props.role = role
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<MemberProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const member = new Member(
      {
        ...props,
        role: props.role ?? 'member',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return member
  }
}
