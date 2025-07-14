import { Module } from '@nestjs/common'
import { MailModule } from '../mail.module'
import { MailService } from '../mail.service'
import { TwoFactorAuthController } from './two-factor-auth.controller'
import { TwoFactorAuthService } from './two-factor-auth.service'

@Module({
  imports: [MailModule],
  controllers: [TwoFactorAuthController, MailService],
  providers: [TwoFactorAuthService],
})
export class TwoFactorAuthModule { }
