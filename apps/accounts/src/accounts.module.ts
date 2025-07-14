import { Module } from '@nestjs/common'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { AccountsController } from './accounts.controller'
import { AccountsService } from './accounts.service'

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService],
})
export class AccountsModule { }
