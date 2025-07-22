import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class LoginDto {


	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string

	@IsOptional()
	@IsString()
	code: string
}