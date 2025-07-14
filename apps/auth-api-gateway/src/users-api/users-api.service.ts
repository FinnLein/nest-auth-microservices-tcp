import { UserUpdateDto } from '@app/contracts/users/user-update.dto'
import { USERS_PATTERNS } from '@app/contracts/users/user.patterns'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { USERS_CLIENT } from 'libs/clients/constant'
import { lastValueFrom } from 'rxjs'
import { UserApiDto } from './dto/user-api.dto'
import { UserCreateApiDto } from './dto/user-create-api.dto'
import { UserUpdateApiDto } from './dto/user-update-api.dto'

@Injectable()
export class UsersApiService {
	constructor(@Inject(USERS_CLIENT) private readonly usersClient: ClientProxy) { }
	findAll() {
		return this.usersClient.send(USERS_PATTERNS.FIND_ALL, {})
	}
	async findById(id: string) {
		const user = await lastValueFrom(this.usersClient.send<UserApiDto, string>(USERS_PATTERNS.FIND_BY_ID, id))
		return user
	}
	async findByEmail(email: string) {
		const user = await lastValueFrom(this.usersClient.send<UserApiDto, string>(USERS_PATTERNS.FIND_BY_EMAIL, email))
		return user
	}
	create({ password, ...dto }: UserCreateApiDto) {
		return this.usersClient.send<UserApiDto, UserCreateApiDto>(USERS_PATTERNS.CREATE, { password, ...dto })
	}
	update(id: string, dto: UserUpdateApiDto) {
		return this.usersClient.send<UserApiDto, { id: string, dto: UserUpdateDto }>(USERS_PATTERNS.UPDATE, { id, dto })
	}

	delete(id: string) {
		return this.usersClient.send(USERS_PATTERNS.DELETE, id)
	}
}
