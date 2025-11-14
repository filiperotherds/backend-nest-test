import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AddAddressBodySchema, addAddressBodySchema } from '../dtos/add-address.dto'
import { AddAddressToOrganizationUseCase } from '@/domain/organization/application/use-cases/add-address-to-org.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@Controller('/organizations/:organizationId/addresses')
@UseGuards(JwtAuthGuard)
export class AddAddressToOrganizationController {
  constructor(private addAddressToOrganization: AddAddressToOrganizationUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(addAddressBodySchema))
  async handle(
    @Body() body: AddAddressBodySchema,
    @Param('organizationId') organizationId: string,
  ) {
    const { street, number, complement, neighborhood, city, state, zipCode } = body

    const result = await this.addAddressToOrganization.execute({
      organizationId,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new Error(error.message)
      }
    }
  }
}
