import { NewPasswordDTO } from '@app/contracts/email/new-password.dto'
import { ResetPasswordDTO } from '@app/contracts/email/reset-password.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { TokenType } from '@prisma/client'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { hash } from 'argon2'
import { USERS_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { v4 as uuid } from 'uuid'
import { MailService } from '../mail.service'
import { USERS_PATTERNS } from './../../../../libs/contracts/src/users/user.patterns'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		@Inject(USERS_CLIENT) private readonly usersClientProxy: ClientProxy,
		private readonly prisma: PrismaService,
		private readonly mailService: MailService
	) { }

	public async resetPassword(dto: ResetPasswordDTO) {
		const existingUser = await lastValueFrom(this.usersClientProxy.send<UserDto>(USERS_PATTERNS.FIND_BY_EMAIL, dto.email))

		if (!existingUser) throw new RpcException({ statusCode: 404, message: 'User not found' })

		const passwordResetToken = await this.generatePasswordResetToken(existingUser.email)

		await this.mailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

		return true
	}

	public async newPassword(dto: NewPasswordDTO, token: string) {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (!existingToken) throw new RpcException({ statusCode: 404, message: 'Password reset token not found' })

		const isExpiresIn = new Date(existingToken.expiresIn) < new Date()

		if (isExpiresIn) throw new RpcException({ statusCode: 400, message: 'The token is expires out. Please request new reset password token' })

		const existingUser = await lastValueFrom(this.usersClientProxy.send<UserDto>(USERS_PATTERNS.FIND_BY_EMAIL, existingToken.email))

		if (!existingUser) throw new RpcException({ statusCode: 404, message: 'User with this email not found' })

		await lastValueFrom(this.usersClientProxy.send<UserDto>(USERS_PATTERNS.PASSWORD_UPDATE, {
			id: existingUser.id, dto: { password: await hash(dto.password) }
		}))
		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuid()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (existingToken) await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		const passwordResetToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.PASSWORD_RESET
			}
		})

		return passwordResetToken
	}
}
