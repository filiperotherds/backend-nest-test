import { UserProfile } from '@/domain/client/enterprise/entities/user-profile.entity'
import { UserProfilesRepository } from '../repositories/user-profiles-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

interface CreateClientProfileUseCaseRequest {
  userId: string
  cpf: string
  phone: string
}

type CreateClientProfileUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    userProfile: UserProfile
  }
>

export class CreateClientProfileUseCase {
  constructor(private userProfilesRepository: UserProfilesRepository) {}

  async execute({
    userId,
    cpf,
    phone,
  }: CreateClientProfileUseCaseRequest): Promise<CreateClientProfileUseCaseResponse> {
    const uniqueUserId = new UniqueEntityID(userId)

    const profileWithSameUserId = await this.userProfilesRepository.findByUserId(
      uniqueUserId,
    )

    if (profileWithSameUserId) {
      return left(
        new ResourceAlreadyExistsError('Client profile already exists for this user.'),
      )
    }

    const userProfile = UserProfile.create({
      userId: uniqueUserId,
      cpf,
      phone,
    })

    await this.userProfilesRepository.create(userProfile)

    return right({
      userProfile,
    })
  }
}
