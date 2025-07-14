import { forwardRef, Module } from '@nestjs/common'
import { MailModule } from '../mail.module'
import { MailService } from '../mail.service'
import { EmailConfirmationController } from './email-confirmation.controller'
import { EmailConfirmationService } from './email-confirmation.service'

@Module({
  imports: [MailModule],
  controllers: [EmailConfirmationController, MailService],
  providers: [EmailConfirmationService],
})
export class EmailConfirmationModule { }
