import { Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { USERS_CLIENT } from 'libs/clients/constant'

import { ClientConfigModule } from 'libs/client-config/client-config.module'
import { ClientConfigService } from 'libs/client-config/client-config.service'
import { UsersApiController } from './users-api.controller'
import { UsersApiService } from './users-api.service'

@Module({
  imports: [ClientConfigModule],
  controllers: [UsersApiController],
  providers: [UsersApiService,
    {
      provide: USERS_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.usersClientOptions
        return ClientProxyFactory.create(clientOptions)
      },
      inject: [ClientConfigService]
    }
  ],
  exports: [UsersApiService, USERS_CLIENT]
})
export class UsersApiModule { }
