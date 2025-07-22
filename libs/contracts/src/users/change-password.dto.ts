import { IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	oldPassword: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	newPassword: string
}