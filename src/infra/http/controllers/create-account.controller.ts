import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  CreateAccountBodySchema,
  createAccountBodySchema,
} from '../dtos/create-account.dto'
import { CreateUserUseCase } from '@/domain/auth/application/use-cases/create-user.use-case'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, role } = body

    const result = await this.createUser.execute({
      name,
      email,
      password,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ResourceAlreadyExistsError(error.message)
        default:
          throw new Error(error.message)
      }
    }
  }
}
