import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class NewPasswordApiDTO {
	@IsString()
	@MinLength(6, { message: 'At least 6 symbols' })
	@IsNotEmpty()
	password: string

}