import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { TwoFactorAuthService } from './two-factor-auth.service'

@Controller()
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) { }

  @MessagePattern(EMAIL_PATTERNS.SEND_TWO_FACTOR_AUTH)
  public async sendTwoFactorAuthToken(@Payload() email: string) {
    return this.twoFactorAuthService.sendTwoFactorAuthToken(email)
  }
  @MessagePattern(EMAIL_PATTERNS.VALIDATE_TWO_FACTOR_AUTH)
  public async validateTwoFactorAuthToken(@Payload() payload: { email: string, code: string }) {
    const { email, code } = payload
    return this.twoFactorAuthService.validateTwoFactorAuthToken(email, code)
  }
}
