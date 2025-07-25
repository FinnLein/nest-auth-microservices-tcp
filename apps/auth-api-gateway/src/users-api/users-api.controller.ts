import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Auth } from '../auth-api/decorators/auth.decorator'
import { CurrentUser } from '../auth-api/decorators/currentUser.decorator'
import { ChangePasswordApiDto } from './dto/change-password-api.dto'
import { UserUpdateApiDto } from './dto/user-update-api.dto'
import { UsersApiService } from './users-api.service'

@Controller('users')
export class UsersApiController {
	constructor(private userService: UsersApiService) { }

	@Get()
	findAll() {
		return this.userService.findAll()
	}
	@Auth(UserRole.REGULAR)
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	public getProfile(@CurrentUser('id') id: string) {
		return this.userService.findById(id)
	}

	@Auth(UserRole.REGULAR)
	@Patch('profile')
	@HttpCode(HttpStatus.OK)
	public update(@CurrentUser('id') id: string, @Body() dto: UserUpdateApiDto) {
		return this.userService.update(id, dto)
	}
	@Auth(UserRole.REGULAR)
	@Post('change-password')
	@HttpCode(HttpStatus.OK)
	public changePassword(@CurrentUser('id') id: string, @Body() dto: ChangePasswordApiDto) {
		return this.userService.changePassword(id, dto)
	}

	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	public findById(@Param('id') id: string) {
		return this.userService.findById(id)
	}
	@Get('by-email/:email')
	@HttpCode(HttpStatus.OK)
	public findByEmail(@Param('email') email: string) {
		return this.userService.findByEmail(email)
	}
	@Delete('user/:id')
	@HttpCode(HttpStatus.OK)
	public delete(@Param('id') id: string) {
		return this.userService.delete(id)
	}
}
