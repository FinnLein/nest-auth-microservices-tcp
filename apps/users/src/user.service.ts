import { PasswordUpdateDto } from '@app/contracts/users/password-update.dto'
import { UserCreateDto } from '@app/contracts/users/user-create.dto'
import { UserUpdateDto } from '@app/contracts/users/user-update.dto'
import { UserDto } from '@app/contracts/users/user.dto'
import { Injectable, } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { hash } from 'argon2'


@Injectable()
export class UserService {
	public constructor(private readonly prisma: PrismaService) { }

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
	public async passwordUpdate(id: string, dto: PasswordUpdateDto): Promise<UserDto> {
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
	public async findAll(): Promise<{ totalCount: number, users: UserDto[] }> {
		const users = await this.prisma.user.findMany()

		const totalCount = await this.prisma.user.count()

		return {
			totalCount,
			users
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
