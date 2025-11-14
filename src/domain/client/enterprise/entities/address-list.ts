import { WatchedList } from '@/core/entities/watched-list'
import { Address } from './address.vo'

export class AddressList extends WatchedList<Address> {
  compareItems(a: Address, b: Address): boolean {
    return a.zipCode === b.zipCode && a.street === b.street && a.number === b.number
  }
}
