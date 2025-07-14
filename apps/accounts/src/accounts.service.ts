import { CreateAccountDto } from '@app/contracts/accounts/create-account.dto'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) { }

  public async findOne(id: string, provider: string) {
    
    const account = await this.prisma.account.findFirst({
      where: {
        id,
        provider
      }
    })

    return account
  }

  public async create(dto: CreateAccountDto) {
    const account = await this.prisma.account.create({
      data: {
        userId: dto.userId,
        type: 'oauth',
        provider: dto.provider,
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
        expiresAt: dto.expiresAt
      }
    })

    return account
  }
}
