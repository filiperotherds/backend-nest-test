import { OrganizationsRepository } from '../repositories/organizations-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Address } from '@/domain/client/enterprise/entities/address.vo'

interface AddAddressToOrganizationUseCaseRequest {
  organizationId: string
  street: string
  number: string
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

type AddAddressToOrganizationUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export class AddAddressToOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    organizationId,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
  }: AddAddressToOrganizationUseCaseRequest): Promise<AddAddressToOrganizationUseCaseResponse> {
    const uniqueOrganizationId = new UniqueEntityID(organizationId)

    const organization = await this.organizationsRepository.findById(
      uniqueOrganizationId,
    )

    if (!organization) {
      return left(new ResourceNotFoundError('Organization not found.'))
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

    organization.addresses.add(newAddress)

    await this.organizationsRepository.save(organization)

    return right(null)
  }
}
