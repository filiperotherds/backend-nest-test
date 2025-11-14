import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from '../dtos/authenticate.dto'
import { AuthenticateUserUseCase } from '@/domain/auth/application/use-cases/authenticate-user.use-case'
import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new Error(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
