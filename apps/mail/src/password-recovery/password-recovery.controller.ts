import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { NewPasswordDTO } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDTO } from '@app/contracts/email/reset-password.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PasswordRecoveryService } from './password-recovery.service'

@Controller()
export class PasswordRecoveryController {
  constructor(private readonly passwordRecoveryService: PasswordRecoveryService) { }

  @MessagePattern(EMAIL_PATTERNS.RESET_PASSWORD)
  public async resetPassword(@Payload() dto: ResetPasswordDTO) {
    return this.passwordRecoveryService.resetPassword(dto)
  }
  @MessagePattern(EMAIL_PATTERNS.NEW_PASSWORD)
  public async newPassword(@Payload() payload: { dto: NewPasswordDTO, token: string }) {
    const { dto, token } = payload
    return this.passwordRecoveryService.newPassword(dto, token)
  }

}
