import { Module } from '@nestjs/common'
import { PrismaService } from 'apps/auth-api-gateway/src/prisma/prisma.service'
import { RedisModule } from './redis/redis.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule { }
