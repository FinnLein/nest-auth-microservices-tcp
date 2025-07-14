import { IsNotEmpty, IsString } from 'class-validator'

export class EmailConfirmationApiDTO {
	@IsString()
	@IsNotEmpty()
	token: string
}