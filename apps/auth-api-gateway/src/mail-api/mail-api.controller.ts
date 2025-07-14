import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { Request } from 'express'
import { EmailConfirmationApiDTO } from './dto/email-confirmation-api.dto'
import { NewPasswordApiDTO } from './dto/new-password-api.dto'
import { ResetPasswordApiDTO } from './dto/reset-password-api.dto'
import { MailApiService } from './mail-api.service'

@Controller('auth')
export class MailApiController {
  constructor(private readonly mailApiService: MailApiService) { }

  @Post('email-confirmation')
  @HttpCode(HttpStatus.OK)
  public async newVerification(@Req() req: Request, @Body() dto: EmailConfirmationApiDTO) {
    return this.mailApiService.newVerification(req, dto)
  }
  @Post('password-recovery/reset-password')
  @HttpCode(HttpStatus.OK)
  @Recaptcha()
  public async resetPassword(@Body() dto: ResetPasswordApiDTO) {
    return this.mailApiService.resetPassword(dto)
  }

  @Post('password-recovery/new-password/:token')
  @HttpCode(HttpStatus.OK)
  @Recaptcha()
  public async newPassword(@Body() dto: NewPasswordApiDTO, @Param('token') token: string) {
    return this.mailApiService.newPassword(dto, token)
  }
}
