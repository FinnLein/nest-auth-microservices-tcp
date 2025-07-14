import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { ConfirmationTemplate } from './templates/confirmation.template'
import { ResetTemplate } from './templates/reset.template'
import { TwoFactorAuthTemplate } from './templates/two-factor.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService, 
		private readonly configService: ConfigService
	) { }

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ConfirmationTemplate({ domain, token }))
		return this.sendMail(email, 'Confirm email', html)
	}
	public async sendPasswordResetEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetTemplate({ domain, token }))
		return this.sendMail(email, 'Reset password', html)
	}
	public async sendTwoFactorAuthToken(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }))
		return this.sendMail(email, 'Two factor authentication', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
