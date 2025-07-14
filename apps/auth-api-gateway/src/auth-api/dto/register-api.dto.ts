import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'
import { IsPasswordMatchingConstraint } from 'libs/decorators/is-password-matching-constraint.decorator'


export class RegisterApiDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsNotEmpty()
	@IsString()
	displayName: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	password: string

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'Password must be at least 6 symbols' })
	@Validate(IsPasswordMatchingConstraint, { message: 'Password not match' })
	passwordRepeat: string
}