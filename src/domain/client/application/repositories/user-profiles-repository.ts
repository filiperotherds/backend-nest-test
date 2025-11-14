import { UserProfile } from '@/domain/client/enterprise/entities/user-profile.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class UserProfilesRepository {
  abstract findByUserId(userId: UniqueEntityID): Promise<UserProfile | null>
  abstract create(userProfile: UserProfile): Promise<void>
  abstract save(userProfile: UserProfile): Promise<void>
}
