import { AUTH_PATTERNS } from '@app/contracts/auth/auth.patterns'
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Request, Response } from 'express'
import { AUTH_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { UserApiDto } from '../users-api/dto/user-api.dto'
import { LoginApiDto } from './dto/login-api.dto'
import { RegisterApiDto } from './dto/register-api.dto'

@Injectable()
export class AuthApiService {
	constructor(
		@Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
		private readonly configService: ConfigService
	) { }

	async register(dto: RegisterApiDto) {
		try {
			const user = await lastValueFrom(this.authClient.send<UserApiDto, RegisterApiDto>(AUTH_PATTERNS.REGISTER, dto))
			return user
		} catch (err) {
			throw err
		}
	}

	async login(req: Request, dto: LoginApiDto) {
		try {
			const user = await lastValueFrom(this.authClient.send<UserApiDto, LoginApiDto>(AUTH_PATTERNS.LOGIN, dto))
			await this.saveSession(req, user.id)
			return user
		} catch (err) {
			throw err
		}
	}

	public async logout(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					return reject(new InternalServerErrorException('Failed to end session. There may be a problem with the server or the session may have already ended.'))
				}

				res.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"))
				resolve()
			})
		})
	}
	public async extractProfileByCode(
		req: Request,
		provider: string,
		code: string
	) {
		try {
			const user = await lastValueFrom(this.authClient.send<UserApiDto, { provider: string, code: string }>(AUTH_PATTERNS.EXTRACT_PROFILE_BY_CODE, { provider, code }))
			return this.saveSession(req, user.id)

		} catch (err) {
			throw err
		}
	}
	public async saveSession(req: Request, userId: string) {
		return new Promise((resolve, reject) => {
			req.session.userId = userId

			req.session.save(err => {
				if (err) return reject(new InternalServerErrorException('Failed to establish session. Check session parameters'))

				resolve(null)
			})

		})
	}
}
