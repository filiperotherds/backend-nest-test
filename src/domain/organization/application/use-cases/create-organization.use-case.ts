import { Organization } from '../../enterprise/entities/organization.entity'
import { OrganizationsRepository } from '../repositories/organizations-repository'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'
import { Slug } from '../../enterprise/value-objects/slug.vo'

interface CreateOrganizationUseCaseRequest {
  ownerId: string
  name: string
  cnpj: string
  description: string
}

type CreateOrganizationUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    organization: Organization
  }
>

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    ownerId,
    name,
    cnpj,
    description,
  }: CreateOrganizationUseCaseRequest): Promise<CreateOrganizationUseCaseResponse> {
    const uniqueOwnerId = new UniqueEntityID(ownerId)
    const slug = Slug.createFromText(name)

    const organizationWithSameSlug = await this.organizationsRepository.findBySlug(
      slug.value,
    )

    if (organizationWithSameSlug) {
      return left(
        new ResourceAlreadyExistsError('Organization with this name already exists.'),
      )
    }

    const organization = Organization.create({
      ownerId: uniqueOwnerId,
      name,
      cnpj,
      description,
    })

    await this.organizationsRepository.create(organization)

    return right({
      organization,
    })
  }
}
