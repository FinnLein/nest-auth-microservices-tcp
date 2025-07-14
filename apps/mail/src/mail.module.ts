import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientProxyFactory } from '@nestjs/microservices'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { ClientConfigModule } from 'libs/client-config/client-config.module'
import { ClientConfigService } from 'libs/client-config/client-config.service'
import { USERS_CLIENT } from 'libs/clients/constant'
import { getMailerConfig } from 'libs/config/mailer.config'
import { EmailConfirmationController } from './email-confirmation/email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'
import { MailService } from './mail.service'
import { PasswordRecoveryController } from './password-recovery/password-recovery.controller'
import { PasswordRecoveryService } from './password-recovery/password-recovery.service'
import { TwoFactorAuthController } from './two-factor-auth/two-factor-auth.controller'
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service'

@Module({
  imports: [
    ClientConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMailerConfig,
      inject: [ConfigService]
    })],
  providers: [MailService, ConfigService, EmailConfirmationService, PrismaService, TwoFactorAuthService, PasswordRecoveryService,
    {
      provide: USERS_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const options = configService.usersClientOptions
        return ClientProxyFactory.create(options)
      },
      inject: [ClientConfigService]
    }
  ],
  controllers: [EmailConfirmationController, TwoFactorAuthController, PasswordRecoveryController],
  exports: [MailService]
})
export class MailModule { }
