import { AuthMethod } from '@prisma/client'
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UserCreateDto {

	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	@IsNotEmpty()
	password: string

	@IsString()
	@IsNotEmpty()
	displayName: string

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	picture?: string

	@IsEnum(AuthMethod, { each: true })
	method: AuthMethod

	@IsBoolean()
	isVerified: boolean
}