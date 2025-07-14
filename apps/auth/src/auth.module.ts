import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory } from '@nestjs/microservices'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { ClientConfigModule } from 'libs/client-config/client-config.module'
import { ClientConfigService } from 'libs/client-config/client-config.service'
import { ACCOUNT_CLIENT, MAIL_CLIENT, USERS_CLIENT } from 'libs/clients/constant'
import { getProvidersConfig } from 'libs/config/providers.config'
import { getRecaptchaConfig } from 'libs/config/recaptcha.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ProviderModule } from './provider/provider.module'

@Module({
  imports: [
    ClientConfigModule,
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
  controllers: [AuthController],
  providers: [
    {
      provide: USERS_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.usersClientOptions
        return ClientProxyFactory.create(clientOptions)
      },
      inject: [ClientConfigService]
    },
    {
      provide: ACCOUNT_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.accountsClientOptions
        return ClientProxyFactory.create(clientOptions)
      },
      inject: [ClientConfigService]
    },
    {
      provide: MAIL_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.mailClientOptions
        return ClientProxyFactory.create(clientOptions)
      },
      inject: [ClientConfigService]
    },
    AuthService, PrismaService],
  exports: [AuthService]
})
export class AuthModule { }
