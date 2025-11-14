import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ProProfileProps {
  organizationId: UniqueEntityID
  specialties: string[]
  rating: number
  createdAt: Date
  updatedAt?: Date
}

export class ProProfile extends Entity<ProProfileProps> {
  get organizationId() {
    return this.props.organizationId
  }

  get specialties() {
    return this.props.specialties
  }

  get rating() {
    return this.props.rating
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set specialties(specialties: string[]) {
    this.props.specialties = specialties
    this.touch()
  }

  set rating(rating: number) {
    this.props.rating = rating
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProProfileProps, 'createdAt' | 'rating' | 'specialties'>,
    id?: UniqueEntityID,
  ) {
    const proProfile = new ProProfile(
      {
        ...props,
        rating: props.rating ?? 0,
        specialties: props.specialties ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return proProfile
  }
}
