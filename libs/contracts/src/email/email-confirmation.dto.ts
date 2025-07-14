import { IsNotEmpty, IsString } from 'class-validator'

export class EmailConfirmationDTO {
	@IsString()
	@IsNotEmpty()
	token: string
}