import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UsersRepository } from '@/domain/auth/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { UserProfilesRepository } from '@/domain/client/application/repositories/user-profiles-repository'
import { PrismaUserProfilesRepository } from './prisma/repositories/prisma-user-profiles-repository'
import { OrganizationsRepository } from '@/domain/organization/application/repositories/organizations-repository'
import { PrismaOrganizationsRepository } from './prisma/repositories/prisma-organizations-repository'
import { MembersRepository } from '@/domain/organization/application/repositories/members-repository'
import { PrismaMembersRepository } from './prisma/repositories/prisma-members-repository'
import { InviteRepository } from '@/domain/organization/application/repositories/invite-repository'
import { PrismaInviteRepository } from './prisma/repositories/prisma-invite-repository'
import { CategoriesRepository } from '@/domain/services/application/repositories/categories-repository'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'
import { ServicesRepository } from '@/domain/services/application/repositories/services-repository'
import { PrismaServicesRepository } from './prisma/repositories/prisma-services-repository'
import { QuotationsRepository } from '@/domain/quotation/application/repositories/quotations-repository'
import { PrismaQuotationsRepository } from './prisma/repositories/prisma-quotations-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: UserProfilesRepository,
      useClass: PrismaUserProfilesRepository,
    },
    {
      provide: OrganizationsRepository,
      useClass: PrismaOrganizationsRepository,
    },
    {
      provide: MembersRepository,
      useClass: PrismaMembersRepository,
    },
    {
      provide: InviteRepository,
      useClass: PrismaInviteRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: ServicesRepository,
      useClass: PrismaServicesRepository,
    },
    {
      provide: QuotationsRepository,
      useClass: PrismaQuotationsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    UserProfilesRepository,
    OrganizationsRepository,
    MembersRepository,
    InviteRepository,
    CategoriesRepository,
    ServicesRepository,
    QuotationsRepository,
  ],
})
export class DatabaseModule {}
