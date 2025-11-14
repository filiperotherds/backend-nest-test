import { UsersRepository } from '../repositories/users-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { TokenManager } from '../providers/token-manager'
import { Either, left, right } from '@/core/either'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private tokenManager: TokenManager,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.tokenManager.sign({
      sub: user.id.toString(),
      role: user.role,
    })

    return right({
      accessToken,
    })
  }
}
