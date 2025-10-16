import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ClientService } from '../client.service'
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe'
import {
  createClientAddressBodySchema,
  type CreateClientAddressBodySchema,
} from '../schema/create-client-address.schema'

@Controller('/client/address')
export class CreateClientAddressController {
  constructor(private clientService: ClientService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createClientAddressBodySchema))
  async handle(@Body() body: CreateClientAddressBodySchema) {
    await this.clientService.createAddress(body)
  }
}
