import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { TokenType } from '@prisma/client'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { MailService } from '../mail.service'

@Injectable()
export class TwoFactorAuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mailService: MailService) { }

	public async validateTwoFactorAuthToken(email: string, code: string) {
		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) throw new RpcException({ statusCode: 404, message: 'Two factor token not found' })

		if (existingToken.token !== code) throw new RpcException({ statusCode: 400, message: 'Invalid two factor authentication code' })

		const isExpiresIn = new Date(existingToken.expiresIn) < new Date()

		if (isExpiresIn) throw new RpcException({ statusCode: 400, message: 'The token is expires out. Please request new two factor authentication token' })

		await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorAuthToken(email: string) {
		try {
			const twoFactorToken = await this.generateTwoFactorAuthToken(email)
			await this.mailService.sendTwoFactorAuthToken(
				twoFactorToken.email,
				twoFactorToken.token
			)
			return true
		} catch (error) {
			console.error("Fetch error", error)
			throw error

		}
	}


	private async generateTwoFactorAuthToken(email: string) {
		const token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString()
		const expiresIn = new Date(new Date().getTime() + 300000)

		const existingToken = await this.prisma.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) await this.prisma.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		const twoFactorAuthToken = await this.prisma.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorAuthToken
	}
}
