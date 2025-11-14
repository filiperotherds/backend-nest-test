import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TokenProps {
  userId: UniqueEntityID
  token: string
  type: 'access' | 'refresh'
  expiresAt: Date
  createdAt: Date
}

export class Token extends Entity<TokenProps> {
  get userId() {
    return this.props.userId
  }

  get token() {
    return this.props.token
  }

  get type() {
    return this.props.type
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<TokenProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const token = new Token(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return token
  }
}
