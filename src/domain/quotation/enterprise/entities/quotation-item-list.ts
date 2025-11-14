import { WatchedList } from '@/core/entities/watched-list'
import { QuotationItem } from './quotation-item.vo'

export class QuotationItemList extends WatchedList<QuotationItem> {
  compareItems(a: QuotationItem, b: QuotationItem): boolean {
    return a.serviceId.equals(b.serviceId) && a.description === b.description
  }
}
