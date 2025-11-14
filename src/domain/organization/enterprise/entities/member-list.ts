import { WatchedList } from '@/core/entities/watched-list'
import { Member } from './member.entity'

export class MemberList extends WatchedList<Member> {
  compareItems(a: Member, b: Member): boolean {
    return a.userId.equals(b.userId)
  }
}
