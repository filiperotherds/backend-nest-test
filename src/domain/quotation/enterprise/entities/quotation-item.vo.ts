import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface QuotationItemProps {
  serviceId: UniqueEntityID
  description: string
  quantity: number
  unitPrice: number
}

export class QuotationItem extends ValueObject<QuotationItemProps> {
  get serviceId() {
    return this.props.serviceId
  }

  get description() {
    return this.props.description
  }

  get quantity() {
    return this.props.quantity
  }

  get unitPrice() {
    return this.props.unitPrice
  }

  get totalPrice() {
    return this.props.quantity * this.props.unitPrice
  }

  static create(props: QuotationItemProps) {
    return new QuotationItem(props)
  }
}
