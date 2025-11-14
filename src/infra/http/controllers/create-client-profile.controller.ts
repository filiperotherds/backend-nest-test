import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import {
  CreateClientProfileBodySchema,
  createClientProfileBodySchema,
} from '../dtos/create-client-profile.dto'
import { CreateClientProfileUseCase } from '@/domain/client/application/use-cases/create-client-profile.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

@Controller('/client-profiles')
@UseGuards(JwtAuthGuard)
export class CreateClientProfileController {
  constructor(private createClientProfile: CreateClientProfileUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientProfileBodySchema))
  async handle(@Body() body: CreateClientProfileBodySchema, @Req() req: any) {
    const { cpf, phone } = body
    const userId = req.user.sub // Assumindo que o userId está no token JWT

    const result = await this.createClientProfile.execute({
      userId,
      cpf,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new Error(error.message)
      }
    }
  }
}
