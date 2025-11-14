import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  name: string
  email: string
  passwordHash: string
  role: 'client' | 'professional'
  createdAt: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get passwordHash() {
    return this.props.passwordHash
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

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  set passwordHash(passwordHash: string) {
    this.props.passwordHash = passwordHash
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        role: props.role ?? 'client',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return user
  }
}
