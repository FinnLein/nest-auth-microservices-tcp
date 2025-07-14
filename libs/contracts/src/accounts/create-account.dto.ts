import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateAccountDto {
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	type: 'oauth'

	@IsString()
	@IsNotEmpty()
	provider: 'google' | 'yandex'

	@IsString()
	@IsNotEmpty()
	accessToken: string

	@IsString()
	@IsNotEmpty()
	refreshToken: string

	@IsNumber()
	@IsNotEmpty()
	expiresAt: number
}