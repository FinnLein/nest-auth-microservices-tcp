import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordApiDTO {
	@IsEmail()
	@IsNotEmpty()
	email: string

}