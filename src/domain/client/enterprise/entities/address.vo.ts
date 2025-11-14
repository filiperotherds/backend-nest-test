import { ValueObject } from '@/core/entities/value-object'

export interface AddressProps {
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export class Address extends ValueObject<AddressProps> {
  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get zipCode() {
    return this.props.zipCode
  }

  static create(props: AddressProps) {
    return new Address(props)
  }
}
