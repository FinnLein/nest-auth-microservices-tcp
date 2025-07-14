import { ACCOUNTS_PATTERNS } from '@app/contracts/accounts/accounts.patterns'
import { CreateAccountDto } from '@app/contracts/accounts/create-account.dto'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AccountsService } from './accounts.service'

@Controller()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @MessagePattern(ACCOUNTS_PATTERNS.CREATE)
  create(dto: CreateAccountDto) {
    return this.accountsService.create(dto)
  }
  @MessagePattern(ACCOUNTS_PATTERNS.FIND_ONE)
  findOne(@Payload() payload: { id: string, profileProvider: string }) {
    return this.accountsService.findOne(payload.id, payload.profileProvider)
  }
}
