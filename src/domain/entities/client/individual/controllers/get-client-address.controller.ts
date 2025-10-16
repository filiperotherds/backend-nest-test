import { Body, Controller, Get, HttpCode, UsePipes } from '@nestjs/common'
import { ClientService } from '../client.service'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import {
  getClientAddressBodySchema,
  type GetClientAddressBodySchema,
} from '../schema/get-client-address.schema'

@Controller('/client/address')
export class GetClientAddressController {
  constructor(private clientService: ClientService) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getClientAddressBodySchema))
  async handle(@Body() body: GetClientAddressBodySchema) {
    const { userId } = body

    return this.clientService.getAddressesByUserId(userId)
  }
}
