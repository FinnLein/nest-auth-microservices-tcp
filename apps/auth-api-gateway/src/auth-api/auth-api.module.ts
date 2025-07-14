import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory } from '@nestjs/microservices'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { ProviderModule } from 'apps/auth/src/provider/provider.module'
import { AUTH_CLIENT } from 'libs/clients/constant'
import { getProvidersConfig } from 'libs/config/providers.config'
import { getRecaptchaConfig } from 'libs/config/recaptcha.config'
import { ClientConfigModule } from '../../../../libs/client-config/client-config.module'
import { ClientConfigService } from '../../../../libs/client-config/client-config.service'
import { AuthApiController } from './auth-api.controller'
import { AuthApiService } from './auth-api.service'


@Module({
  imports: [ClientConfigModule,
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getProvidersConfig
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthApiController],
  providers: [AuthApiService, {
    provide: AUTH_CLIENT,
    useFactory: (configService: ClientConfigService) => {
      const clientOptions = configService.authClientOptions
      return ClientProxyFactory.create(clientOptions)
    },
    inject: [ClientConfigService]
  }],
  exports: [AuthApiService]
})
export class AuthApiModule { }
