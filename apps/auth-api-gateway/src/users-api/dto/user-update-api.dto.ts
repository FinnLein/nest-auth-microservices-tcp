import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class UserUpdateApiDto {
	@IsEmail()
	@IsNotEmpty()
	@IsOptional()
	email?: string

	@IsString()
	@IsOptional()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	@IsNotEmpty()
	password?: string


	@IsOptional()
	@IsString()
	@IsNotEmpty()
	displayName?: string

	@IsString()
	@IsOptional()
	@IsNotEmpty()
	picture?: string

	@IsBoolean()
	@IsOptional()
	isTwoFactorEnabled?: boolean
}