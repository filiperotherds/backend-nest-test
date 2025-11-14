import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AddressList } from './address-list'

export interface UserProfileProps {
  userId: UniqueEntityID
  cpf: string
  phone: string
  addresses: AddressList
  createdAt: Date
  updatedAt?: Date
}

export class UserProfile extends AggregateRoot<UserProfileProps> {
  get userId() {
    return this.props.userId
  }

  get cpf() {
    return this.props.cpf
  }

  get phone() {
    return this.props.phone
  }

  get addresses() {
    return this.props.addresses
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<UserProfileProps, 'createdAt' | 'addresses'>,
    id?: UniqueEntityID,
  ) {
    const userProfile = new UserProfile(
      {
        ...props,
        addresses: props.addresses ?? new AddressList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return userProfile
  }
}
