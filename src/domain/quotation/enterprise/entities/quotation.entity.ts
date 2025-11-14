import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { QuotationItemList } from './quotation-item-list'

export interface QuotationProps {
  clientId: UniqueEntityID
  organizationId: UniqueEntityID
  status: 'pending' | 'sent' | 'accepted' | 'rejected' | 'canceled'
  description: string
  totalPrice: number
  expiresAt: Date
  quotationItems: QuotationItemList
  createdAt: Date
  updatedAt?: Date
}

export class Quotation extends AggregateRoot<QuotationProps> {
  get clientId() {
    return this.props.clientId
  }

  get organizationId() {
    return this.props.organizationId
  }

  get status() {
    return this.props.status
  }

  get description() {
    return this.props.description
  }

  get totalPrice() {
    return this.props.totalPrice
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get quotationItems() {
    return this.props.quotationItems
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

  public cancel() {
    this.props.status = 'canceled'
    this.touch()
  }

  public send(totalPrice: number, expiresAt: Date) {
    this.props.status = 'sent'
    this.props.totalPrice = totalPrice
    this.props.expiresAt = expiresAt
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuotationProps, 'createdAt' | 'status' | 'totalPrice' | 'expiresAt' | 'quotationItems'>,
    id?: UniqueEntityID,
  ) {
    const quotation = new Quotation(
      {
        ...props,
        status: props.status ?? 'pending',
        totalPrice: props.totalPrice ?? 0,
        expiresAt: props.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
        quotationItems: props.quotationItems ?? new QuotationItemList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return quotation
  }
}
