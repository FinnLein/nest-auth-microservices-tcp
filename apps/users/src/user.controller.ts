import { PasswordUpdateDto } from '@app/contracts/users/password-update.dto'
import { UserCreateDto } from '@app/contracts/users/user-create.dto'
import { UserUpdateDto } from '@app/contracts/users/user-update.dto'
import { USERS_PATTERNS } from '@app/contracts/users/user.patterns'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UserService } from './user.service'
@Controller()
export class UserController {
  constructor(private readonly usersService: UserService) { }

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  public findAll() {
    return this.usersService.findAll()
  }
  @MessagePattern(USERS_PATTERNS.FIND_BY_ID)
  public findById(@Payload() id: string) {
    return this.usersService.findById(id)
  }
  @MessagePattern(USERS_PATTERNS.FIND_BY_EMAIL)
  public findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email)
  }
  @MessagePattern(USERS_PATTERNS.CREATE)
  public create(@Payload() dto: UserCreateDto) {
    return this.usersService.create(dto)
  }
  @MessagePattern(USERS_PATTERNS.UPDATE)
  public update(@Payload() payload: { id: string, dto: UserUpdateDto }) {
    const { id, dto } = payload
    return this.usersService.update(id, dto)
  }
  @MessagePattern(USERS_PATTERNS.PASSWORD_UPDATE)
  public passwordUpdate(@Payload() payload: { id: string, dto: PasswordUpdateDto }) {
    const { id, dto } = payload
    console.log(payload)
    console.log(dto)
    return this.usersService.passwordUpdate(id, dto)
  }
  @MessagePattern(USERS_PATTERNS.DELETE)
  public delete(@Payload() id: string) {
    return this.usersService.delete(id)
  }

}
