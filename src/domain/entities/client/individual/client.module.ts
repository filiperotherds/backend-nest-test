import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ClientService } from './client.service'
import { ClientRepository } from './client.repository'
import { CreateClientAccountController } from './controllers/create-client-account.controller'
import { CreateClientAddressController } from './controllers/create-client-address.controller'
import { GetClientAddressController } from './controllers/get-client-address.controller'

@Module({
  imports: [],
  controllers: [
    CreateClientAccountController,
    CreateClientAddressController,
    GetClientAddressController,
  ],
  providers: [PrismaService, ClientService, ClientRepository],
})
export class ClientModule {}
