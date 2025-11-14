import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { AddAddressBodySchema, addAddressBodySchema } from '../dtos/add-address.dto'
import { AddAddressToClientUseCase } from '@/domain/client/application/use-cases/add-address-to-client.use-case'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

@Controller('/client-profiles/addresses')
@UseGuards(JwtAuthGuard)
export class AddAddressToClientController {
  constructor(private addAddressToClient: AddAddressToClientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(addAddressBodySchema))
  async handle(@Body() body: AddAddressBodySchema, @Req() req: any) {
    const { street, number, complement, neighborhood, city, state, zipCode } = body
    const userId = req.user.sub // Assumindo que o userId está no token JWT

    const result = await this.addAddressToClient.execute({
      userId,
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
