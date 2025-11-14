import { CreateUserUseCase } from '@/domain/auth/application/use-cases/create-user.use-case'
import { InMemoryUsersRepository } from '../repositories/in-memory-users-repository'
import { FakeHashGenerator } from '../cryptography/fake-hash-generator'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHashGenerator: FakeHashGenerator
let sut: CreateUserUseCase

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHashGenerator = new FakeHashGenerator()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHashGenerator)
  })

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'client',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].name).toEqual('John Doe')
    expect(inMemoryUsersRepository.items[0].passwordHash).toEqual(
      'hashed-password123',
    )
  })

  it('should not be able to create a user with existing email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'client',
    })

    const result = await sut.execute({
      name: 'Jane Doe',
      email: 'john.doe@example.com',
      password: 'password456',
      role: 'client',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
