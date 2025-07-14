import { EmailConfirmationDTO } from '@app/contracts/email/email-confirmation.dto'
import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { EmailConfirmationService } from './email-confirmation.service'

@Controller()
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService
  ) { }

  @MessagePattern(EMAIL_PATTERNS.NEW_VERIFICATION)
  public async newVerification(@Payload() dto: EmailConfirmationDTO) {
    return this.emailConfirmationService.newVerificationToken(dto)
  }
  @MessagePattern(EMAIL_PATTERNS.SEND_VERIFICATION)
  public async sendVerification(@Payload() email: string) {
    return this.emailConfirmationService.sendVerificationToken(email)
  }
}
