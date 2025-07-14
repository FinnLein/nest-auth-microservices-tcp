import { AuthMethod, UserRole } from '@prisma/client'
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsString()
	@IsNotEmpty()
	id: string

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'At least 6 symbols' })
	password: string

	@IsString()
	@IsOptional()
	picture: string

	@IsOptional()
	@IsEnum(UserRole, { each: true })
	role?: UserRole

	@IsBoolean()
	isVerified: boolean

	@IsOptional()
	@IsBoolean()
	isTwoFactorEnabled?: boolean

	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsEnum(AuthMethod, { each: true })
	method: AuthMethod
}