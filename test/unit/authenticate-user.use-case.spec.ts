import { AuthenticateUserUseCase } from '@/domain/auth/application/use-cases/authenticate-user.use-case'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { FakeHashComparer } from '../cryptography/fake-hash-comparer'
import { FakeTokenManager } from '../cryptography/fake-token-manager'
import { makeUser } from '../factories/make-user'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHashComparer: FakeHashComparer
let fakeTokenManager: FakeTokenManager
let sut: AuthenticateUserUseCase

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHashComparer = new FakeHashComparer()
    fakeTokenManager = new FakeTokenManager()
    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHashComparer,
      fakeTokenManager,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'john.doe@example.com',
      passwordHash: 'hashed-password123',
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'wrong-email@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = makeUser({
      email: 'john.doe@example.com',
      passwordHash: 'hashed-wrong-password',
    })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      email: 'john.doe@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
