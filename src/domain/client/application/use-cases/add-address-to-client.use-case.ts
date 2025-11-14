import { UserProfilesRepository } from '../repositories/user-profiles-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Address } from '../../enterprise/entities/address.vo'

interface AddAddressToClientUseCaseRequest {
  userId: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

type AddAddressToClientUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class AddAddressToClientUseCase {
  constructor(private userProfilesRepository: UserProfilesRepository) {}

  async execute({
    userId,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
  }: AddAddressToClientUseCaseRequest): Promise<AddAddressToClientUseCaseResponse> {
    const uniqueUserId = new UniqueEntityID(userId)

    const userProfile = await this.userProfilesRepository.findByUserId(
      uniqueUserId,
    )

    if (!userProfile) {
      return left(new ResourceNotFoundError('Client profile not found.'))
    }

    const newAddress = Address.create({
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    })

    userProfile.addresses.add(newAddress)

    await this.userProfilesRepository.save(userProfile)

    return right(null)
  }
}
