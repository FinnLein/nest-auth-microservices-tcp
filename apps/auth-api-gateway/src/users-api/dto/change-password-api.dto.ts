import { IsString, MinLength } from 'class-validator'
export class ChangePasswordApiDto {
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	oldPassword: string

	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	newPassword: string
}