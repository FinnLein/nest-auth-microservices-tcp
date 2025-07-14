import { Module } from '@nestjs/common'
// import { BooksModule } from './books/books.module'
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from 'libs/utils/is-dev.util'
import { AuthApiModule } from './auth-api/auth-api.module'

import { ClientConfigModule } from '../../../libs/client-config/client-config.module'
import { MailApiModule } from './mail-api/mail-api.module'
import { PrismaModule } from './prisma/prisma.module'
import { UsersApiModule } from './users-api/users-api.module'

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    ignoreEnvFile: !IS_DEV_ENV

  }), UsersApiModule, ClientConfigModule, PrismaModule, AuthApiModule, MailApiModule,],
  controllers: [],
  providers: [],
})
export class AuthApiGatewayModule { }
