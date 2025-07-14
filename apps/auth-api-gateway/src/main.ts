import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import IORedis from 'ioredis'
import { ms, StringValue } from 'libs/utils/ms.util'
import { parseBoolean } from 'libs/utils/parse-boolean.util'
import { AuthApiGatewayModule } from './auth-api-gateway.module'

async function bootstrap() {
  const app = await NestFactory.create(AuthApiGatewayModule)

  const config = app.get(ConfigService)

  const redis = new IORedis(config.getOrThrow('REDIS_URI'))
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie']
  })

  app.use(session({
    secret: config.getOrThrow('COOKIES_SECRET'),
    name: config.getOrThrow('SESSION_NAME'),
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: config.getOrThrow<string>('SESSION_DOMAIN'),
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
      sameSite: 'lax',
    },
    store: new RedisStore({
      client: redis,
      prefix: config.getOrThrow<string>('SESSION_FOLDER')
    })
  }))

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
