import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as joi from 'joi'
import { ClientConfigService } from './client-config.service'
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: false,
    validationSchema: joi.object({
      AUTH_CLIENT_PORT: joi.number().default(4001),
      USERS_CLIENT_PORT: joi.number().default(4002),
      ACCOUNT_CLIENT_PORT: joi.number().default(4011),
      MAIL_CLIENT_PORT: joi.number().default(4003)
    })
  })],
  providers: [ClientConfigService],
  exports: [ClientConfigService]
})
export class ClientConfigModule { }
