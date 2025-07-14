import { EmailConfirmationDTO } from '@app/contracts/email/email-confirmation.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { USERS_PATTERNS } from '@app/contracts/users/user.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { TokenType } from '@prisma/client'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { USERS_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { v4 as uuid } from 'uuid'
import { MailService } from '../mail.service'

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly mailService: MailService,
		private readonly prisma: PrismaService,
		@Inject(USERS_CLIENT) private readonly usersClientProxy: ClientProxy
	) { }
	//Подумать надо ли тут возвращать респонс. если нет, использовать eventPattern
	public async newVerificationToken(dto: EmailConfirmationDTO) {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		})

		if (!existingToken) throw new RpcException({ statusCode: 400, message: 'Verification token not found' })

		const isExpiresIn = new Date(existingToken.expiresIn) < new Date()

		if (isExpiresIn) {
			throw new RpcException({ statusCode: 400, message: 'The token is expires out. Please request new verification token' })
		}

		const existingUser = await lastValueFrom(this.usersClientProxy.send<UserDto>(USERS_PATTERNS.FIND_BY_EMAIL, existingToken.email))

		if (!existingUser) throw new RpcException({ statusCode: 404, message: 'User with this email not found' })

		await this.prisma.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				isVerified: true
			}
		})

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})

		return existingUser.id
	}

	public async sendVerificationToken(email: string) {
		try {
			const verificationToken = await this.generateVerificationToken(email)
			await this.mailService.sendConfirmationEmail(
				verificationToken.email,
				verificationToken.token
			)
			return true
		} catch (error) {
			console.error("Fetch error", error)
			throw error

		}
	}

	private async generateVerificationToken(email: string) {
		const token = uuid()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})

		if (existingToken) await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})

		const verificationToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})

		return verificationToken
	}
}
