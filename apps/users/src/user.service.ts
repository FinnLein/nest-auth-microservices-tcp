import { ChangePasswordDto } from '@app/contracts/users/change-password.dto'
import { RecoverPasswordDto } from '@app/contracts/users/password-recover.dto'
import { UserCreateDto } from '@app/contracts/users/user-create.dto'
import { UserUpdateDto } from '@app/contracts/users/user-update.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { Inject, Injectable, } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { hash, verify } from 'argon2'
import Redis from 'ioredis'
import { v4 as uuid } from 'uuid'
import { REDIS_CLIENT } from './redis/redis.constant'

@Injectable()
export class UserService {
	public constructor(
		@Inject(REDIS_CLIENT) private readonly redisClient: Redis,
		private readonly prisma: PrismaService
	) { }

	public async findById(id: string): Promise<UserDto> {

		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) throw new RpcException({ statusCode: 404, message: 'User not found' })

		return user
	}

	public async findByEmail(email: string): Promise<UserDto> {
		const user = await this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async create(dto: UserCreateDto): Promise<UserDto> {
		const user = await this.prisma.user.create({
			data: {
				password: dto.password ? await hash(dto.password) : '',
				...dto,
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	public async update(id: string, dto: UserUpdateDto): Promise<UserDto> {
		const user = await this.findById(id)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				displayName: dto.displayName,
				picture: dto.picture,
				isTwoFactorEnabled: dto.isTwoFactorEnabled
			}
		})

		return updatedUser
	}
	public async recoverPassword(id: string, dto: RecoverPasswordDto): Promise<UserDto> {
		const user = await this.findById(id)

		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				password: dto.password
			}
		})

		return updatedUser
	}
	public async changePassword(id: string, dto: ChangePasswordDto) {
		const user = await this.findById(id)

		const isValidPassword = await verify(user.password, dto.oldPassword)

		if (!isValidPassword) throw new RpcException({ statusCode: 401, message: 'Invalid password' })

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				password: await hash(dto.newPassword)
			}
		})

		return {
			message: 'You successfully change your password!'
		}
	}
	public async findAll(): Promise<{ totalCount: number, users: UserDto[] }> {
		const users = await this.prisma.user.findMany()

		const totalCount = await this.prisma.user.count()

		return {
			totalCount,
			users
		}
	}
	public async findAllCached(): Promise<{ totalCount: number, users: UserDto[] }> {
		const cacheKey = 'users:all'

		const cached = await this.redisClient.get(cacheKey)
		if (cached) {
			return JSON.parse(cached)
		}

		const data = await this.findAll()

		await this.redisClient.set(cacheKey, JSON.stringify(data), 'EX', 20)

		return {
			totalCount: data.totalCount,
			users: data.users
		}
	}
	public async delete(id: string) {
		return this.prisma.user.delete({
			where: {
				id
			}
		})
	}
}
