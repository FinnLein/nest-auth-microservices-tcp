import { EMAIL_PATTERNS } from '@app/contracts/email/email.patterns'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Request } from 'express'
import { MAIL_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { AuthApiService } from '../auth-api/auth-api.service'
import { EmailConfirmationApiDTO } from './dto/email-confirmation-api.dto'
import { NewPasswordApiDTO } from './dto/new-password-api.dto'
import { ResetPasswordApiDTO } from './dto/reset-password-api.dto'

@Injectable()
export class MailApiService {
	public constructor(
		@Inject(MAIL_CLIENT) private readonly mailClientProxy: ClientProxy,
		@Inject(forwardRef(() => AuthApiService)) private readonly authService: AuthApiService
	) { }

	public async newVerification(req: Request, dto: EmailConfirmationApiDTO) {
		try {
			const userId = await lastValueFrom(this.mailClientProxy.send<string>(EMAIL_PATTERNS.NEW_VERIFICATION, dto))

			return this.authService.saveSession(req, userId)
		} catch (error) {
			throw error
		}
	}

	public async newPassword(dto: NewPasswordApiDTO, token: string) {
		try {
			const response = await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.NEW_PASSWORD, { dto, token }))
			return response
		} catch (error) {
			throw error
		}
	}
	public async resetPassword(dto: ResetPasswordApiDTO) {
		try {
			const response = await lastValueFrom(this.mailClientProxy.send(EMAIL_PATTERNS.RESET_PASSWORD, dto))
			return response
		} catch (error) {
			throw error
		}
	}
}
