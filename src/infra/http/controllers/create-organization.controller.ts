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
  CreateOrganizationBodySchema,
  createOrganizationBodySchema,
} from '../dtos/create-organization.dto'
import { CreateOrganizationUseCase } from '@/domain/organization/application/use-cases/create-organization.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

@Controller('/organizations')
@UseGuards(JwtAuthGuard)
export class CreateOrganizationController {
  constructor(private createOrganization: CreateOrganizationUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrganizationBodySchema))
  async handle(@Body() body: CreateOrganizationBodySchema, @Req() req: any) {
    const { name, cnpj, description } = body
    const ownerId = req.user.sub // Assumindo que o userId está no token JWT

    const result = await this.createOrganization.execute({
      ownerId,
      name,
      cnpj,
      description,
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
