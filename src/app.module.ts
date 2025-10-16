import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserModule } from './domain/entities/user/user.module'
import { ClientModule } from './domain/entities/client/individual/client.module'

@Module({
  imports: [UserModule, ClientModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
