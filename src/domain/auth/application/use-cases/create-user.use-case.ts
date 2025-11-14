import { User } from '@/domain/auth/enterprise/entities/user.entity'
import { UsersRepository } from '../repositories/users-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Either, left, right } from '@/core/either'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  role: 'client' | 'professional'
}

type CreateUserUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new ResourceAlreadyExistsError('User with this email already exists.'))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      passwordHash,
      role,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
