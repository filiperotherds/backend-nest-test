import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateUserUseCase } from '@/domain/auth/application/use-cases/create-user.use-case'
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository'
import { HashGenerator } from '@/domain/auth/application/cryptography/hash-generator'
import { BcryptHashGenerator } from '../cryptography/bcrypt-hash-generator'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/auth/application/use-cases/authenticate-user.use-case'
import { HashComparer } from '@/domain/auth/application/cryptography/hash-comparer'
import { BcryptHashComparer } from '../cryptography/bcrypt-hash-comparer'
import { TokenManager } from '@/domain/auth/application/providers/token-manager'
import { AuthModule } from '../auth/auth.module'
import { CreateClientProfileController } from './controllers/create-client-profile.controller'
import { CreateClientProfileUseCase } from '@/domain/client/application/use-cases/create-client-profile.use-case'
import { UserProfilesRepository } from '@/domain/client/application/repositories/user-profiles-repository'
import { AddAddressToClientController } from './controllers/add-address-to-client.controller'
import { AddAddressToClientUseCase } from '@/domain/client/application/use-cases/add-address-to-client.use-case'
import { CreateOrganizationController } from './controllers/create-organization.controller'
import { CreateOrganizationUseCase } from '@/domain/organization/application/use-cases/create-organization.use-case'
import { OrganizationsRepository } from '@/domain/organization/application/repositories/organizations-repository'
import { AddAddressToOrganizationController } from './controllers/add-address-to-organization.controller'
import { AddAddressToOrganizationUseCase } from '@/domain/organization/application/use-cases/add-address-to-org.use-case'
import { InviteMemberController } from './controllers/invite-member.controller'
import { InviteMemberUseCase } from '@/domain/organization/application/use-cases/invite-member.use-case'
import { InviteRepository } from '@/domain/organization/application/repositories/invite-repository'
import { CreateServiceController } from './controllers/create-service.controller'
import { CreateServiceUseCase } from '@/domain/services/application/use-cases/create-service.use-case'
import { ServicesRepository } from '@/domain/services/application/repositories/services-repository'
import { RequestQuotationController } from './controllers/request-quotation.controller'
import { RequestQuotationUseCase } from '@/domain/quotation/application/use-cases/request-quotation.use-case'
import { QuotationsRepository } from '@/domain/quotation/application/repositories/quotations-repository'
import { SendQuotationController } from './controllers/send-quotation.controller'
import { SendQuotationUseCase } from '@/domain/quotation/application/use-cases/send-quotation.use-case'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateClientProfileController,
    AddAddressToClientController,
    CreateOrganizationController,
    AddAddressToOrganizationController,
    InviteMemberController,
    CreateServiceController,
    RequestQuotationController,
    SendQuotationController,
  ],
  providers: [
    // Auth
    { provide: HashGenerator, useClass: BcryptHashGenerator },
    { provide: HashComparer, useClass: BcryptHashComparer },
    CreateUserUseCase,
    AuthenticateUserUseCase,

    // Client
    CreateClientProfileUseCase,
    AddAddressToClientUseCase,

    // Organization
    CreateOrganizationUseCase,
    AddAddressToOrganizationUseCase,
    InviteMemberUseCase,

    // Services
    CreateServiceUseCase,

    // Quotation
    RequestQuotationUseCase,
    SendQuotationUseCase,
  ],
})
export class HttpModule {}
