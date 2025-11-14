import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ServiceProps {
  organizationId: UniqueEntityID
  categoryId: UniqueEntityID
  title: string
  description: string
  priceType: 'fixed' | 'per_hour' | 'quotation'
  basePrice?: number | null
  createdAt: Date
  updatedAt?: Date
}

export class Service extends AggregateRoot<ServiceProps> {
  get organizationId() {
    return this.props.organizationId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get priceType() {
    return this.props.priceType
  }

  get basePrice() {
    return this.props.basePrice
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set priceType(priceType: 'fixed' | 'per_hour' | 'quotation') {
    this.props.priceType = priceType
    this.touch()
  }

  set basePrice(basePrice: number | null | undefined) {
    this.props.basePrice = basePrice
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ServiceProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const service = new Service(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return service
  }
}
