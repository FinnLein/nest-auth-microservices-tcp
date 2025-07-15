import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { REDIS_CLIENT } from './redis.constant'

@Module({
  imports: [ConfigModule],
  providers: [{
    provide: REDIS_CLIENT,
    useFactory: (config: ConfigService) => {
      return new Redis({
        host: config.getOrThrow<string>('REDIS_HOST'),
        port: config.getOrThrow<number>('REDIS_PORT'),
        password: config.getOrThrow<string>('REDIS_PASSWORD')
      })
    },
    inject: [ConfigService]
  }],
  exports: [REDIS_CLIENT]
})
export class RedisModule { }
