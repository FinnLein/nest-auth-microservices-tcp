import { forwardRef, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { ClientConfigModule } from 'libs/client-config/client-config.module'
import { ClientConfigService } from 'libs/client-config/client-config.service'
import { MAIL_CLIENT } from 'libs/clients/constant'
import { AuthApiModule } from '../auth-api/auth-api.module'
import { MailApiController } from './mail-api.controller'
import { MailApiService } from './mail-api.service'

@Module({
  imports: [ClientConfigModule, forwardRef(() => AuthApiModule)],
  controllers: [MailApiController],
  providers: [MailApiService,
    {
      provide: MAIL_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const options = configService.mailClientOptions
        return ClientProxyFactory.create(options)
      },
      inject: [ClientConfigService]
    }
  ],
})
export class MailApiModule { }
